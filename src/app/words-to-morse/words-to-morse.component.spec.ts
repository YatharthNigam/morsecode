import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WordsToMorseComponent } from './words-to-morse.component';

describe('WordsToMorseComponent', () => {
  let component: WordsToMorseComponent;
  let fixture: ComponentFixture<WordsToMorseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WordsToMorseComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WordsToMorseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
