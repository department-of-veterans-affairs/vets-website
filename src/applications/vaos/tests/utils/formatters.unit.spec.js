import { expect } from 'chai';

import {
  formatTypeOfCare,
  titleCase,
  sentenceCase,
  lowerCase,
} from '../../utils/formatters';

describe('VAOS formatters', () => {
  describe('formatTypeOfCare', () => {
    it('should not lower case MOVE', () => {
      const result = formatTypeOfCare('MOVE! weight management');

      expect(result).to.equal('MOVE! weight management');
    });
    it('should lower case regular types of care', () => {
      const result = formatTypeOfCare('Primary care');

      expect(result).to.equal('primary care');
    });
  });

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
});
