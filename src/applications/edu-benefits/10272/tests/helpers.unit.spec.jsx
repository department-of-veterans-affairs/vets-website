import { expect } from 'chai';
import sinon from 'sinon';
import { validatePrepCourseStartDate } from '../helpers';

describe('10272 Helpers', () => {
  describe('validatePrepCourseStartDate', () => {
    it('allows valid dates', () => {
      const errors = { addError: sinon.spy() };
      validatePrepCourseStartDate(errors, '2025-01-03', {
        prepCourseStartDate: '2025-01-03',
        prepCourseEndDate: '2025-01-10',
      });
      expect(errors.addError.called).to.be.false;
    });

    it('rejects invalid date start after end', () => {
      const errors = { addError: sinon.spy() };
      validatePrepCourseStartDate(errors, '2026-01-01', {
        prepCourseStartDate: '2026-01-01',
        prepCourseEndDate: '2025-01-10',
      });
      expect(errors.addError.calledOnce).to.be.true;
    });

    it('rejects invalid date start same as end', () => {
      const errors = { addError: sinon.spy() };
      validatePrepCourseStartDate(errors, '2025-01-01', {
        prepCourseStartDate: '2025-01-01',
        prepCourseEndDate: '2025-01-01',
      });
      expect(errors.addError.calledOnce).to.be.true;
    });

    it('if empty return from function', () => {
      const errors = { addError: sinon.spy() };
      validatePrepCourseStartDate(errors, '', {
        prepCourseStartDate: '',
        prepCourseEndDate: '',
      });
      expect(errors.addError.calledOnce).to.be.false;
    });

    it('invalid date string', () => {
      const errors = { addError: sinon.spy() };
      validatePrepCourseStartDate(errors, 'XXXX-02-XX', {
        prepCourseStartDate: 'XXXX-02-XX',
        prepCourseEndDate: '',
      });
      expect(errors.addError.calledOnce).to.be.true;
    });
  });
});
