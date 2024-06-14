import { expect } from 'chai';

import {
  titleCase,
  sentenceCase,
  lowerCase,
  aOrAn,
} from '../../utils/formatters';

describe('VAOS Formatters', () => {
  describe('titleCase', () => {
    it('should return capitalize the 1st letter of each word in a sentence', () => {
      expect(titleCase('THE cOw jumpeD over the moon')).to.equal(
        'The Cow Jumped Over The Moon',
      );
    });
  });

  describe('sentenceCase', () => {
    it('should return a string in sentence case', () => {
      expect(sentenceCase('Apples and Oranges')).to.equal('Apples and oranges');
    });

    it('should ignore capital words', () => {
      expect(sentenceCase('MOVE! Weight Management')).to.equal(
        'MOVE! weight management',
      );
    });
  });

  describe('lowerCase', () => {
    it('should lower the case of each word in a sentence', () => {
      expect(lowerCase('The cOW jumpeD Over tHe moon')).to.equal(
        'the cow jumped over the moon',
      );
    });
    it('should ignore capital words', () => {
      expect(lowerCase('The COW jumpeD Over tHe moon')).to.equal(
        'the COW jumped over the moon',
      );
    });
  });

  describe('aOrAn', () => {
    it('should return an if noun starts with a vowel', () => {
      expect(aOrAn('Audiology')).to.equal('an');
      expect(aOrAn('Eye care')).to.equal('an');
      expect(aOrAn('injury')).to.equal('an');
      expect(aOrAn('Opthalmology')).to.equal('an');
      expect(aOrAn('ulna')).to.equal('an');
    });

    it('should return an if noun starts with a consonant', () => {
      expect(aOrAn('Primary care')).to.equal('a');
    });
  });
});
