import sinon from 'sinon';
import { expect } from 'chai';

import { isValidYear } from '../validations';

describe('526 All Claims validations', () => {
  describe('isValidYear', () => {
    it('should add an error if the year is not a number', () => {
      const err = {
        addError: sinon.spy(),
      };
      isValidYear(err, 'asdf');
      expect(err.addError.called).to.be.true;
    });

    it('should add an error if the year contains more than just four digits', () => {
      const err = {
        addError: sinon.spy(),
      };
      isValidYear(err, '1990asdf');
      expect(err.addError.called).to.be.true;
    });

    it('should add an error if the year is less than 1900', () => {
      const err = {
        addError: sinon.spy(),
      };
      isValidYear(err, '1899');
      expect(err.addError.called).to.be.true;
    });

    it('should add an error if the year is more than 3000', () => {
      const err = {
        addError: sinon.spy(),
      };
      isValidYear(err, '3001');
      expect(err.addError.called).to.be.true;
    });

    it('should not add an error if the year is between 1900 and 3000', () => {
      const err = {
        addError: sinon.spy(),
      };
      isValidYear(err, '2010');
      expect(err.addError.called).to.be.false;
    });

    it('should add an error if the year is in the future', () => {
      const err = {
        addError: sinon.spy(),
      };
      isValidYear(err, '2999');
      expect(err.addError.called).to.be.true;
    });
  });
});
