import sinon from 'sinon';
import { expect } from 'chai';

import { validateBurialDate } from '../../src/js/burials/validation';

describe('Burials validation', () => {
  describe('validateBurialDate', () => {
    it('should allow burial date after death date', () => {
      const errors = {
        burialDate: {
          addError: sinon.spy()
        }
      };
      validateBurialDate(errors, {
        deathDate: '2017-01-01',
        burialDate: '2017-01-02'
      });

      expect(errors.burialDate.addError.called).to.be.false;
    });
    it('should allow burial date on death date', () => {
      const errors = {
        burialDate: {
          addError: sinon.spy()
        }
      };
      validateBurialDate(errors, {
        deathDate: '2017-01-01',
        burialDate: '2017-01-01'
      });

      expect(errors.burialDate.addError.called).to.be.false;
    });
    it('should not allow burial date before death date', () => {
      const errors = {
        burialDate: {
          addError: sinon.spy()
        }
      };
      validateBurialDate(errors, {
        deathDate: '2017-01-02',
        burialDate: '2017-01-01'
      });

      expect(errors.burialDate.addError.called).to.be.true;
    });
  });
});
