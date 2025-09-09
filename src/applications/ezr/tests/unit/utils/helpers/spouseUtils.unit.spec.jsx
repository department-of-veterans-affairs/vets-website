import { expect } from 'chai';
import { isItemIncomplete } from '../../../../utils/helpers/spouseUtils';

describe('spouseUtils', () => {
  describe('isItemIncomplete', () => {
    const completeSpouseItem = {
      spouseFullName: {
        first: 'Jane',
        last: 'Doe',
      },
      spouseSocialSecurityNumber: '123456789',
      spouseDateOfBirth: '1980-01-01',
      dateOfMarriage: '2010-06-15',
      cohabitedLastYear: true,
      sameAddress: true,
      provideSupportLastYear: false,
    };

    const completeSpouseItemWithSeparateAddress = {
      ...completeSpouseItem,
      sameAddress: false,
      spouseAddress: {
        street: '123 Main St',
        city: 'Anytown',
        state: 'CA',
        country: 'USA',
        postalCode: '12345',
      },
      spousePhone: '5551234567',
    };

    describe('always required fields', () => {
      it('should return false when all required fields are present and spouse has same address', () => {
        const result = isItemIncomplete(completeSpouseItem);
        expect(result).to.be.false;
      });

      it('should return false when all required fields are present and spouse has different address', () => {
        const result = isItemIncomplete(completeSpouseItemWithSeparateAddress);
        expect(result).to.be.false;
      });

      it('should return true if spouseFullName.first is missing', () => {
        const item = {
          ...completeSpouseItem,
          spouseFullName: { last: 'Doe' },
        };
        const result = isItemIncomplete(item);
        expect(result).to.be.true;
      });

      it('should return true if spouseFullName.last is missing', () => {
        const item = {
          ...completeSpouseItem,
          spouseFullName: { first: 'Jane' },
        };
        const result = isItemIncomplete(item);
        expect(result).to.be.true;
      });

      it('should return true if spouseFullName is missing entirely', () => {
        const item = {
          ...completeSpouseItem,
          spouseFullName: undefined,
        };
        const result = isItemIncomplete(item);
        expect(result).to.be.true;
      });

      it('should return true if spouseSocialSecurityNumber is missing', () => {
        const item = {
          ...completeSpouseItem,
          spouseSocialSecurityNumber: undefined,
        };
        const result = isItemIncomplete(item);
        expect(result).to.be.true;
      });

      it('should return true if spouseDateOfBirth is missing', () => {
        const item = {
          ...completeSpouseItem,
          spouseDateOfBirth: undefined,
        };
        const result = isItemIncomplete(item);
        expect(result).to.be.true;
      });

      it('should return true if dateOfMarriage is missing', () => {
        const item = {
          ...completeSpouseItem,
          dateOfMarriage: undefined,
        };
        const result = isItemIncomplete(item);
        expect(result).to.be.true;
      });

      it('should return true if cohabitedLastYear is undefined', () => {
        const item = {
          ...completeSpouseItem,
          cohabitedLastYear: undefined,
        };
        const result = isItemIncomplete(item);
        expect(result).to.be.true;
      });

      it('should return false if cohabitedLastYear is false', () => {
        const item = {
          ...completeSpouseItem,
          cohabitedLastYear: false,
        };
        const result = isItemIncomplete(item);
        expect(result).to.be.false;
      });

      it('should return true if sameAddress is undefined', () => {
        const item = {
          ...completeSpouseItem,
          sameAddress: undefined,
        };
        const result = isItemIncomplete(item);
        expect(result).to.be.true;
      });

      it('should return true if provideSupportLastYear is undefined', () => {
        const item = {
          ...completeSpouseItem,
          provideSupportLastYear: undefined,
        };
        const result = isItemIncomplete(item);
        expect(result).to.be.true;
      });

      it('should return false if provideSupportLastYear is false', () => {
        const item = {
          ...completeSpouseItem,
          provideSupportLastYear: false,
        };
        const result = isItemIncomplete(item);
        expect(result).to.be.false;
      });
    });

    describe('conditional contact information requirements', () => {
      describe('when sameAddress is true', () => {
        it('should return false even without contact information', () => {
          const item = {
            ...completeSpouseItem,
            sameAddress: true,
            // No spouseAddress or spousePhone.
          };
          const result = isItemIncomplete(item);
          expect(result).to.be.false;
        });

        it('should return false with partial contact information', () => {
          const item = {
            ...completeSpouseItem,
            sameAddress: true,
            spouseAddress: { street: '123 Main St' }, // Incomplete address.
            // No spousePhone.
          };
          const result = isItemIncomplete(item);
          expect(result).to.be.false;
        });
      });

      describe('when sameAddress is false', () => {
        it('should return true if spouseAddress is missing', () => {
          const item = {
            ...completeSpouseItem,
            sameAddress: false,
            spousePhone: '5551234567',
            // No spouseAddress.
          };
          const result = isItemIncomplete(item);
          expect(result).to.be.true;
        });

        it('should return true if spousePhone is missing', () => {
          const item = {
            ...completeSpouseItem,
            sameAddress: false,
            spouseAddress: {
              street: '123 Main St',
              city: 'Anytown',
              state: 'CA',
              country: 'USA',
              postalCode: '12345',
            },
            // No spousePhone.
          };
          const result = isItemIncomplete(item);
          expect(result).to.be.true;
        });

        it('should return true if spouseAddress.street is missing', () => {
          const item = {
            ...completeSpouseItemWithSeparateAddress,
            spouseAddress: {
              ...completeSpouseItemWithSeparateAddress.spouseAddress,
              street: undefined,
            },
          };
          const result = isItemIncomplete(item);
          expect(result).to.be.true;
        });

        it('should return true if spouseAddress.city is missing', () => {
          const item = {
            ...completeSpouseItemWithSeparateAddress,
            spouseAddress: {
              ...completeSpouseItemWithSeparateAddress.spouseAddress,
              city: undefined,
            },
          };
          const result = isItemIncomplete(item);
          expect(result).to.be.true;
        });

        it('should return true if spouseAddress.state is missing', () => {
          const item = {
            ...completeSpouseItemWithSeparateAddress,
            spouseAddress: {
              ...completeSpouseItemWithSeparateAddress.spouseAddress,
              state: undefined,
            },
          };
          const result = isItemIncomplete(item);
          expect(result).to.be.true;
        });

        it('should return true if spouseAddress.country is missing', () => {
          const item = {
            ...completeSpouseItemWithSeparateAddress,
            spouseAddress: {
              ...completeSpouseItemWithSeparateAddress.spouseAddress,
              country: undefined,
            },
          };
          const result = isItemIncomplete(item);
          expect(result).to.be.true;
        });

        it('should return true if spouseAddress.postalCode is missing', () => {
          const item = {
            ...completeSpouseItemWithSeparateAddress,
            spouseAddress: {
              ...completeSpouseItemWithSeparateAddress.spouseAddress,
              postalCode: undefined,
            },
          };
          const result = isItemIncomplete(item);
          expect(result).to.be.true;
        });

        it('should return false when all contact fields are present', () => {
          const result = isItemIncomplete(
            completeSpouseItemWithSeparateAddress,
          );
          expect(result).to.be.false;
        });
      });
    });

    describe('edge cases', () => {
      it('should return true for null item', () => {
        const result = isItemIncomplete(null);
        expect(result).to.be.true;
      });

      it('should return true for undefined item', () => {
        const result = isItemIncomplete(undefined);
        expect(result).to.be.true;
      });

      it('should return true for empty object', () => {
        const result = isItemIncomplete({});
        expect(result).to.be.true;
      });

      it('should handle empty strings as missing values', () => {
        const item = {
          ...completeSpouseItem,
          spouseFullName: {
            first: '',
            last: 'Doe',
          },
        };
        const result = isItemIncomplete(item);
        expect(result).to.be.true;
      });

      it('should handle null values as missing', () => {
        const item = {
          ...completeSpouseItem,
          spouseSocialSecurityNumber: null,
        };
        const result = isItemIncomplete(item);
        expect(result).to.be.true;
      });
    });
  });
});
