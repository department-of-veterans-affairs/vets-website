import { expect } from 'chai';
import sinon from 'sinon';

import { validateSponsorDeathDate, validateEmailParts } from '../validation';

describe('Pre-need validation', () => {
  describe('validateSponsorDeathDate', () => {
    it('should return error if death is before birth', () => {
      const errors = {
        dateOfDeath: {
          addError: sinon.spy(),
        },
      };

      validateSponsorDeathDate(errors, {
        isDeceased: 'yes',
        dateOfBirth: '2011-01-01',
        dateOfDeath: '2010-01-01',
      });

      expect(errors.dateOfDeath.addError.called).to.be.true;
    });

    it('should return error if death is same as birth', () => {
      const errors = {
        dateOfDeath: {
          addError: sinon.spy(),
        },
      };

      validateSponsorDeathDate(errors, {
        isDeceased: 'yes',
        dateOfBirth: '2010-01-01',
        dateOfDeath: '2010-01-01',
      });

      expect(errors.dateOfDeath.addError.called).to.be.true;
    });

    it('should not add error if death is after birth', () => {
      const errors = {
        dateOfDeath: {
          addError: sinon.spy(),
        },
      };

      validateSponsorDeathDate(errors, {
        isDeceased: 'yes',
        dateOfBirth: '2010-01-01',
        dateOfDeath: '2011-01-01',
      });

      expect(errors.dateOfDeath.addError.called).to.be.false;
    });

    it('should not add error if not deceased', () => {
      const errors = {
        dateOfDeath: {
          addError: sinon.spy(),
        },
      };

      validateSponsorDeathDate(errors, {
        isDeceased: 'no',
        dateOfBirth: '2011-01-01',
        dateOfDeath: '2010-01-01',
      });

      expect(errors.dateOfDeath.addError.called).to.be.false;
    });
    it('should not add error if no death date', () => {
      const errors = {
        dateOfDeath: {
          addError: sinon.spy(),
        },
      };

      validateSponsorDeathDate(errors, {
        isDeceased: 'yes',
        dateOfBirth: '2011-01-01',
      });

      expect(errors.dateOfDeath.addError.called).to.be.false;
    });
    it('should not add error if no dates', () => {
      const errors = {
        dateOfDeath: {
          addError: sinon.spy(),
        },
      };

      validateSponsorDeathDate(errors, {
        isDeceased: 'yes',
      });

      expect(errors.dateOfDeath.addError.called).to.be.false;
    });
  });

  describe('validateLocalPart', () => {
    it('should return error if local part contains ampersand', () => {
      const errors = {
        addError: sinon.spy(),
      };

      validateEmailParts(errors, 'te&st@test.com');

      expect(errors.addError.called).to.be.true;
    });

    it('should not return error if local part is valid', () => {
      const errors = {
        addError: sinon.spy(),
      };

      validateEmailParts(errors, 'test@test.com');

      expect(errors.addError.called).to.be.false;
    });

    it('should return if email is empty', () => {
      const errors = {
        addError: sinon.spy(),
      };

      validateEmailParts(errors, '');
      expect(errors.addError.called).to.be.false;
    });
  });

  describe('validateTopLevelDomain', () => {
    it('should return error if top level domain name contains digit', () => {
      const errors = {
        addError: sinon.spy(),
      };

      validateEmailParts(errors, 'test@test.c0m');

      expect(errors.addError.called).to.be.true;
    });

    it('should not return error if top level domain is valid', () => {
      const errors = {
        addError: sinon.spy(),
      };

      validateEmailParts(errors, 'test@test.com');

      expect(errors.addError.called).to.be.false;
    });

    it('should return error if top level domain name contains digit', () => {
      const errors = {
        addError: sinon.spy(),
      };

      validateEmailParts(errors, 'test@test.c0m');

      expect(errors.addError.called).to.be.true;
    });

    it('should return error if top level domain name contains digit', () => {
      const errors = {
        addError: sinon.spy(),
      };

      validateEmailParts(errors, '');
      expect(errors.addError.called).to.be.false;
    });

    it('should return if email is empty', () => {
      const errors = {
        addError: sinon.spy(),
      };

      validateEmailParts(errors, '');
      expect(errors.addError.called).to.be.false;
    });
  });
});
