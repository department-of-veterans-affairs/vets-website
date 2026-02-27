import { expect } from 'chai';
import { prefillTransformer } from '../helpers';
import { formFields } from '../constants';

const createState = bankInformation => ({
  data: {
    bankInformation,
    formData: {
      data: {
        id: '12345',
        attributes: {
          claimant: {
            claimantId: 1000,
            firstName: 'John',
            lastName: 'Doe',
            contactInfo: {},
          },
        },
      },
    },
  },
  user: {
    profile: {
      vapContactInfo: {},
    },
  },
});

describe('prefillTransformer', () => {
  describe('Bank account confirmation fields prefill', () => {
    it('correctly pre-fills routingNumberConfirmation field from bankInformation', () => {
      const state = createState({
        accountType: 'Checking',
        accountNumber: '12345678',
        routingNumber: '123456789',
      });

      const result = prefillTransformer({}, {}, {}, state);

      expect(
        result.formData?.[formFields.bankAccount]?.routingNumberConfirmation,
      ).to.equal('123456789');
    });

    it('correctly pre-fills accountNumberConfirmation field from bankInformation', () => {
      const state = createState({
        accountType: 'Savings',
        accountNumber: '98765432101',
        routingNumber: '987654321',
      });

      const result = prefillTransformer({}, {}, {}, state);

      expect(
        result.formData?.[formFields.bankAccount]?.accountNumberConfirmation,
      ).to.equal('98765432101');
    });

    it('handles missing bankInformation gracefully', () => {
      const state = createState({});

      const result = prefillTransformer({}, {}, {}, state);

      expect(
        result.formData?.[formFields.bankAccount]?.routingNumberConfirmation,
      ).to.be.undefined;
      expect(
        result.formData?.[formFields.bankAccount]?.accountNumberConfirmation,
      ).to.be.undefined;
    });

    it('pre-fills both confirmation fields when both are present', () => {
      const state = createState({
        accountType: 'Checking',
        accountNumber: '11223344556',
        routingNumber: '111222333',
      });

      const result = prefillTransformer({}, {}, {}, state);

      expect(
        result.formData?.[formFields.bankAccount]?.routingNumberConfirmation,
      ).to.equal('111222333');
      expect(
        result.formData?.[formFields.bankAccount]?.accountNumberConfirmation,
      ).to.equal('11223344556');
    });
  });
});
