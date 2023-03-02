import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-words-to-morse',
  templateUrl: './words-to-morse.component.html',
  styleUrls: ['./words-to-morse.component.css']
})
export class WordsToMorseComponent implements OnInit {

  morseDictionary: { [key: string]: string } = {
    'a': '.-', 'b': '-...', 'c': '-.-.', 'd': '-..', 'e': '.', 'f': '..-.',
    'g': '--.', 'h': '....', 'i': '..', 'j': '.---', 'k': '-.-', 'l': '.-..',
    'm': '--', 'n': '-.', 'o': '---', 'p': '.--.', 'q': '--.-', 'r': '.-.',
    's': '...', 't': '-', 'u': '..-', 'v': '...-', 'w': '.--', 'x': '-..-',
    'y': '-.--', 'z': '--..', '0': '-----', '1': '.----', '2': '..---',
    '3': '...--', '4': '....-', '5': '.....', '6': '-....', '7': '--...',
    '8': '---..', '9': '----.'
  };

  audioContext = new AudioContext();

  code: string = '';

  constructor() { }

  ngOnInit(): void {
    this.playMorseCode('.-- --- .-. .-.. -..');
  }

  convert(enteredText: string) {
    console.log(enteredText);
    if (this.isMorseCode(enteredText)) {
      this.morseToSentence(enteredText);
    }
    else {
      this.sentenceToMorse(enteredText);
    }
  }

  // Function to check if a string is in Morse code
  isMorseCode(str: string): boolean {
    const morseRegex: RegExp = /^[.-\s/]+$/;
    return morseRegex.test(str);
  }

  sentenceToMorse(sentence: string) {
    const words: string[] = sentence.toLowerCase().split(' ');
    const morseWords: string[] = words.map((word: string) => {
      return word.split('').map((char: string) => {
        return this.morseDictionary[char] || char; // use the Morse code if available, otherwise keep the character
      }).join(' ');
    });
    this.code = morseWords.join(' / ');
  }

  morseToSentence(morseCode: string) {
    const words: string[] = morseCode.split(' / ');
    const sentence: string[] = words.map((word: string) => {
      return word.split(' ').map((morseChar: string) => {
        return Object.keys(this.morseDictionary).find((key: string) => this.morseDictionary[key] === morseChar) || morseChar; // find the character that matches the Morse code, otherwise keep the Morse code
      }).join('');
    });
    this.code = sentence.join(' ').toUpperCase();
  }

  playMorseCode(morseCode: string): void {
    console.log(morseCode);

    // audioContext = new AudioContext();
    const beepLength = 100; // milliseconds
    const longBeepLength = 300; // milliseconds
    const dotFrequency = 800; // Hz
    const dashFrequency = 600; // Hz
    const silenceLength = beepLength;

    const dotBuffer = this.audioContext.createBuffer(1, this.audioContext.sampleRate * beepLength / 1000, this.audioContext.sampleRate);
    const longBeepBuffer = this.audioContext.createBuffer(1, this.audioContext.sampleRate * longBeepLength / 1000, this.audioContext.sampleRate);
    const silenceBuffer = this.audioContext.createBuffer(1, this.audioContext.sampleRate * silenceLength / 1000, this.audioContext.sampleRate);

    const oscillator = this.audioContext.createOscillator();
    oscillator.type = 'sine';
    oscillator.connect(this.audioContext.destination);

    for (let i = 0; i < morseCode.length; i++) {
      const character = morseCode.charAt(i);
      if (character === '.') {
        oscillator.frequency.setValueAtTime(dotFrequency, this.audioContext.currentTime);
        oscillator.start();
        oscillator.stop(this.audioContext.currentTime + beepLength / 1000);
        this.audioContext.decodeAudioData(dotBuffer.getChannelData(0).buffer, (buffer) => {
          const source = this.audioContext.createBufferSource();
          source.buffer = buffer;
          source.connect(this.audioContext.destination);
          source.start();
        });
      } else if (character === '-') {
        oscillator.frequency.setValueAtTime(dashFrequency, this.audioContext.currentTime);
        oscillator.start();
        oscillator.stop(this.audioContext.currentTime + longBeepLength / 1000);
        this.audioContext.decodeAudioData(longBeepBuffer.getChannelData(0).buffer, (buffer) => {
          const source = this.audioContext.createBufferSource();
          source.buffer = buffer;
          source.connect(this.audioContext.destination);
          source.start();
        });
      } else if (character === ' ') {
        this.audioContext.decodeAudioData(silenceBuffer.getChannelData(0).buffer, (buffer) => {
          const source = this.audioContext.createBufferSource();
          source.buffer = buffer;
          source.connect(this.audioContext.destination);
          source.start();
        });
      }
    }

    oscillator.disconnect();
    this.audioContext.close();
  }

}
