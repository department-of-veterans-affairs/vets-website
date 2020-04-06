import sinon from 'sinon';

import { validateBurialAndDeathDates } from '../validation';

describe('Burials validation', () => {
  describe('validateBurialAndDeathDates', () => {
    test('should allow burial date after death date', () => {
      const errors = {
        burialDate: {
          addError: sinon.spy(),
        },
      };
      validateBurialAndDeathDates(errors, {
        deathDate: '2017-01-01',
        burialDate: '2017-01-02',
      });

      expect(errors.burialDate.addError.called).toBe(false);
    });
    test('should allow burial date on death date', () => {
      const errors = {
        burialDate: {
          addError: sinon.spy(),
        },
      };
      validateBurialAndDeathDates(errors, {
        deathDate: '2017-01-01',
        burialDate: '2017-01-01',
      });

      expect(errors.burialDate.addError.called).toBe(false);
    });
    test('should not allow burial date before death date', () => {
      const errors = {
        burialDate: {
          addError: sinon.spy(),
        },
      };
      validateBurialAndDeathDates(errors, {
        deathDate: '2017-01-02',
        burialDate: '2017-01-01',
      });

      expect(errors.burialDate.addError.called).toBe(true);
    });
    test('should allow birth date before death date', () => {
      const errors = {
        deathDate: {
          addError: sinon.spy(),
        },
      };
      validateBurialAndDeathDates(errors, {
        deathDate: '2017-01-02',
        veteranDateOfBirth: '2017-01-01',
      });

      expect(errors.deathDate.addError.called).toBe(false);
    });
    test('should not allow birth date after death date', () => {
      const errors = {
        deathDate: {
          addError: sinon.spy(),
        },
      };
      validateBurialAndDeathDates(errors, {
        deathDate: '2017-01-01',
        veteranDateOfBirth: '2017-01-02',
      });

      expect(errors.deathDate.addError.called).toBe(true);
    });
  });
});
