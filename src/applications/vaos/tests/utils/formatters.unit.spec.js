import { expect } from 'chai';

import {
  formatTypeOfCare,
  formatOperatingHours,
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
  describe('formatOperatingHours', () => {
    it('should return if falsy', () => {
      const result = formatOperatingHours(false);

      expect(result).to.equal(false);
    });
    it('should convert sunrise - sunset to All day', () => {
      const result = formatOperatingHours('sunrise-sunset');

      expect(result).to.equal('All Day');
    });
    it('should return closed', () => {
      const result = formatOperatingHours('close');

      expect(result).to.equal('Closed');
    });
    it('should format hmmA times', () => {
      const result = formatOperatingHours('800AM-1000AM');

      expect(result).to.equal('8:00a.m. - 10:00a.m.');
    });
    it('should format h:mmA times', () => {
      const result = formatOperatingHours('8:00AM-10:00PM');

      expect(result).to.equal('8:00a.m. - 10:00p.m.');
    });
    it('should skip invalid date', () => {
      const result = formatOperatingHours('whatever-whatever');

      expect(result).to.equal('whatever-whatever');
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
