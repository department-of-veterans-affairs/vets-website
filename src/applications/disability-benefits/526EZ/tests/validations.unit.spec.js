import { isInPast } from '../validations';
import sinon from 'sinon';

describe('526 Increase validations', () => {
  describe('isInPast', () => {
    it('should not add error when no date present', () => {
      const addError = sinon.spy();
      const errors = { addError };

      isInPast(errors);
      expect(addError.called).toBe(false);
    });

    it('should not add error when end date is in past', () => {
      const addError = sinon.spy();
      const errors = { addError };

      isInPast(errors, '2010-12-31');
      expect(addError.called).toBe(false);
    });

    it('should add error when end date is in past', () => {
      const addError = sinon.spy();
      const errors = { addError };

      isInPast(errors, '2099-01-01');
      expect(addError.calledOnce).toBe(true);
    });
  });
});
