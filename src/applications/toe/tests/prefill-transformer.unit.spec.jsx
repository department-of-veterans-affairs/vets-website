import { expect } from 'chai';
import { prefillTransformerV1, prefillTransformerV2 } from '../helpers';
import { formFields } from '../constants';

describe('prefillTransformerV1', () => {
  describe('Bank account confirmation fields prefill', () => {
    it('correctly pre-fills routingNumberConfirmation field from bankInformation', () => {
      const state = {
        data: {
          bankInformation: {
            accountType: 'Checking',
            accountNumber: '12345678',
            routingNumber: '123456789',
          },
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
      };

      const result = prefillTransformerV1({}, {}, {}, state);

      expect(
        result.formData?.[formFields.bankAccount]?.routingNumberConfirmation,
      ).to.equal('123456789');
    });

    it('correctly pre-fills accountNumberConfirmation field from bankInformation', () => {
      const state = {
        data: {
          bankInformation: {
            accountType: 'Savings',
            accountNumber: '98765432101',
            routingNumber: '987654321',
          },
          formData: {
            data: {
              id: '12345',
              attributes: {
                claimant: {
                  claimantId: 1000,
                  firstName: 'Jane',
                  lastName: 'Smith',
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
      };

      const result = prefillTransformerV1({}, {}, {}, state);

      expect(
        result.formData?.[formFields.bankAccount]?.accountNumberConfirmation,
      ).to.equal('98765432101');
    });

    it('handles missing bankInformation gracefully', () => {
      const state = {
        data: {
          bankInformation: {},
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
      };

      const result = prefillTransformerV1({}, {}, {}, state);

      expect(
        result.formData?.[formFields.bankAccount]?.routingNumberConfirmation,
      ).to.be.undefined;
      expect(
        result.formData?.[formFields.bankAccount]?.accountNumberConfirmation,
      ).to.be.undefined;
    });

    it('pre-fills both confirmation fields when both are present', () => {
      const state = {
        data: {
          bankInformation: {
            accountType: 'Checking',
            accountNumber: '11223344556',
            routingNumber: '111222333',
          },
          formData: {
            data: {
              id: '12345',
              attributes: {
                claimant: {
                  claimantId: 1000,
                  firstName: 'Test',
                  lastName: 'User',
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
      };

      const result = prefillTransformerV1({}, {}, {}, state);

      expect(
        result.formData?.[formFields.bankAccount]?.routingNumberConfirmation,
      ).to.equal('111222333');
      expect(
        result.formData?.[formFields.bankAccount]?.accountNumberConfirmation,
      ).to.equal('11223344556');
    });
  });
});

describe('prefillTransformerV2', () => {
  describe('Bank account confirmation fields prefill', () => {
    it('correctly pre-fills routingNumberConfirmation field from bankInformation', () => {
      const state = {
        data: {
          bankInformation: {
            accountType: 'Checking',
            accountNumber: '12345678',
            routingNumber: '123456789',
          },
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
      };

      const result = prefillTransformerV2({}, {}, {}, state);

      expect(
        result.formData?.[formFields.bankAccount]?.routingNumberConfirmation,
      ).to.equal('123456789');
    });

    it('correctly pre-fills accountNumberConfirmation field from bankInformation', () => {
      const state = {
        data: {
          bankInformation: {
            accountType: 'Savings',
            accountNumber: '98765432101',
            routingNumber: '987654321',
          },
          formData: {
            data: {
              id: '12345',
              attributes: {
                claimant: {
                  claimantId: 1000,
                  firstName: 'Jane',
                  lastName: 'Smith',
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
      };

      const result = prefillTransformerV2({}, {}, {}, state);

      expect(
        result.formData?.[formFields.bankAccount]?.accountNumberConfirmation,
      ).to.equal('98765432101');
    });

    it('handles missing bankInformation gracefully', () => {
      const state = {
        data: {
          bankInformation: {},
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
      };

      const result = prefillTransformerV2({}, {}, {}, state);

      expect(
        result.formData?.[formFields.bankAccount]?.routingNumberConfirmation,
      ).to.be.undefined;
      expect(
        result.formData?.[formFields.bankAccount]?.accountNumberConfirmation,
      ).to.be.undefined;
    });

    it('pre-fills both confirmation fields when both are present', () => {
      const state = {
        data: {
          bankInformation: {
            accountType: 'Checking',
            accountNumber: '11223344556',
            routingNumber: '111222333',
          },
          formData: {
            data: {
              id: '12345',
              attributes: {
                claimant: {
                  claimantId: 1000,
                  firstName: 'Test',
                  lastName: 'User',
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
      };

      const result = prefillTransformerV2({}, {}, {}, state);

      expect(
        result.formData?.[formFields.bankAccount]?.routingNumberConfirmation,
      ).to.equal('111222333');
      expect(
        result.formData?.[formFields.bankAccount]?.accountNumberConfirmation,
      ).to.equal('11223344556');
    });
  });
});
