import { expect } from 'chai';
import { validateClaimantSsnNotMatchVeteranSsn } from '../../utils/validations';

describe('21P-601 validations', () => {
  describe('validateClaimantSsnNotMatchVeteranSsn', () => {
    const buildErrors = () => {
      const messages = [];
      return {
        errors: { addError: message => messages.push(message) },
        messages,
      };
    };

    it('adds an error when claimant and veteran SSN match', () => {
      const { errors, messages } = buildErrors();

      validateClaimantSsnNotMatchVeteranSsn(errors, '123-45-6789', {
        veteranIdentification: { ssn: '123456789' },
      });

      expect(messages).to.have.lengthOf(1);
    });

    it('adds an error when both SSNs match with dashes', () => {
      const { errors, messages } = buildErrors();

      validateClaimantSsnNotMatchVeteranSsn(errors, '123-45-6789', {
        veteranIdentification: { ssn: '123-45-6789' },
      });

      expect(messages).to.have.lengthOf(1);
    });

    it('does not add an error when claimant and veteran SSN are different', () => {
      const { errors, messages } = buildErrors();

      validateClaimantSsnNotMatchVeteranSsn(errors, '123-45-6789', {
        veteranIdentification: { ssn: '987-65-4321' },
      });

      expect(messages).to.be.empty;
    });

    it('does not add an error when claimant SSN is missing', () => {
      const { errors, messages } = buildErrors();

      validateClaimantSsnNotMatchVeteranSsn(errors, '', {
        veteranIdentification: { ssn: '123456789' },
      });

      expect(messages).to.be.empty;
    });

    it('does not add an error when veteran SSN is missing', () => {
      const { errors, messages } = buildErrors();

      validateClaimantSsnNotMatchVeteranSsn(errors, '123456789', {});

      expect(messages).to.be.empty;
    });

    it('does not add an error when veteranIdentification is undefined', () => {
      const { errors, messages } = buildErrors();

      validateClaimantSsnNotMatchVeteranSsn(errors, '123456789', {
        veteranIdentification: undefined,
      });

      expect(messages).to.be.empty;
    });
  });
});
