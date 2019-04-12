import sinon from 'sinon';
import { expect } from 'chai';
import { validateApplicantName } from '../../0994/validations';

describe('0994 validations', () => {
  describe('validateApplicantName', () => {
    it('should add an error if first name is blank', () => {
      const err = {
        first: { addError: sinon.spy() },
      };
      validateApplicantName(err, { first: ' ' });
      expect(err.first.addError.called).to.be.true;
    });
    it('should add an error if last name is blank', () => {
      const err = {
        last: { addError: sinon.spy() },
      };
      validateApplicantName(err, { last: ' ' });
      expect(err.last.addError.called).to.be.true;
    });
    it('should not add an error if first and last name have valid values', () => {
      const err = {
        first: { addError: sinon.spy() },
        last: { addError: sinon.spy() },
      };
      validateApplicantName(err, { first: 'Firsty', last: 'Lasty' });
      expect(err.last.addError.called).to.be.false;
    });
  });
});
