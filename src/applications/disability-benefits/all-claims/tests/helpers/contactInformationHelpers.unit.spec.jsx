import { expect } from 'chai';
import sinon from 'sinon';

import {
  getCountryOptions,
  getRegularStateOptions,
  isMilitaryLocation,
  shouldAutoDetectMilitary,
  isCountryRequired,
  shouldHideState,
  isStateRequired,
  createAddressValidator,
  normalizeAddressLine,
  hasInvalidPrefillData,
} from '../../utils/contactInformationHelpers';

describe('contactInformationHelpers', () => {
  describe('getCountryOptions', () => {
    it('should return object with COUNTRY_VALUES and COUNTRY_NAMES', () => {
      const result = getCountryOptions();
      expect(result).to.have.property('COUNTRY_VALUES');
      expect(result).to.have.property('COUNTRY_NAMES');
      expect(result.COUNTRY_VALUES).to.be.an('array');
      expect(result.COUNTRY_NAMES).to.be.an('array');
      expect(result.COUNTRY_VALUES.length).to.equal(
        result.COUNTRY_NAMES.length,
      );
    });
  });

  describe('getRegularStateOptions', () => {
    it('should return object with STATE_VALUES and STATE_LABELS without military states', () => {
      const result = getRegularStateOptions();
      expect(result).to.have.property('STATE_VALUES');
      expect(result).to.have.property('STATE_LABELS');
      expect(result.STATE_VALUES).to.be.an('array');
      expect(result.STATE_LABELS).to.be.an('array');
      expect(result.STATE_VALUES.length).to.equal(result.STATE_LABELS.length);
      // Should not contain military states
      expect(result.STATE_VALUES).to.not.include('AA');
      expect(result.STATE_VALUES).to.not.include('AE');
      expect(result.STATE_VALUES).to.not.include('AP');
    });

    describe('isMilitaryLocation', () => {
      it('should return true for military city (uppercase)', () => {
        expect(isMilitaryLocation('APO', '')).to.be.true;
      });

      it('should return true for military city (lowercase)', () => {
        expect(isMilitaryLocation('apo', '')).to.be.true;
      });

      it('should return true for military city (mixed case)', () => {
        expect(isMilitaryLocation('ApO', '')).to.be.true;
      });

      it('should return true for military city with extra spaces', () => {
        expect(isMilitaryLocation('  FPO  ', '')).to.be.true;
      });

      it('should return true for military state (uppercase)', () => {
        expect(isMilitaryLocation('Springfield', 'AE')).to.be.true;
      });

      it('should return true for military state (lowercase)', () => {
        expect(isMilitaryLocation('Springfield', 'ae')).to.be.true;
      });

      it('should return true for military state (mixed case)', () => {
        expect(isMilitaryLocation('Springfield', 'Ae')).to.be.true;
      });

      it('should return true for military state with extra spaces', () => {
        expect(isMilitaryLocation('Springfield', '  AP  ')).to.be.true;
      });

      it('should return false for non-military address', () => {
        expect(isMilitaryLocation('Los Angeles', 'CA')).to.be.false;
      });

      it('should handle empty values', () => {
        expect(isMilitaryLocation('', '')).to.be.false;
        expect(isMilitaryLocation(null, null)).to.be.false;
        expect(isMilitaryLocation(undefined, undefined)).to.be.false;
      });
    });

    describe('shouldAutoDetectMilitary', () => {
      it('should return true when military location detected and flag unchanged', () => {
        const oldFormData = {
          mailingAddress: { 'view:livesOnMilitaryBase': false },
        };
        const newFormData = {
          mailingAddress: {
            city: 'APO',
            state: '',
            'view:livesOnMilitaryBase': false,
          },
        };

        expect(shouldAutoDetectMilitary(oldFormData, newFormData)).to.be.true;
      });

      it('should return false when military flag was explicitly changed', () => {
        const oldFormData = {
          mailingAddress: { 'view:livesOnMilitaryBase': false },
        };
        const newFormData = {
          mailingAddress: {
            city: 'APO',
            state: '',
            'view:livesOnMilitaryBase': true,
          },
        };

        expect(shouldAutoDetectMilitary(oldFormData, newFormData)).to.be.false;
      });

      it('should return false when military flag is already true', () => {
        const oldFormData = {
          mailingAddress: { 'view:livesOnMilitaryBase': true },
        };
        const newFormData = {
          mailingAddress: {
            city: 'APO',
            state: '',
            'view:livesOnMilitaryBase': true,
          },
        };

        expect(shouldAutoDetectMilitary(oldFormData, newFormData)).to.be.false;
      });

      it('should handle missing address data', () => {
        const oldFormData = {};
        const newFormData = {};
        expect(shouldAutoDetectMilitary(oldFormData, newFormData)).to.be.false;
      });
    });

    describe('isCountryRequired', () => {
      it('should return true when military base is not checked', () => {
        const formData = {
          mailingAddress: { 'view:livesOnMilitaryBase': false },
        };
        expect(isCountryRequired(formData)).to.be.true;
      });

      it('should return false when military base is checked', () => {
        const formData = {
          mailingAddress: { 'view:livesOnMilitaryBase': true },
        };
        expect(isCountryRequired(formData)).to.be.false;
      });

      it('should return true when no address data', () => {
        const formData = {};
        expect(isCountryRequired(formData)).to.be.true;
      });
    });

    describe('shouldHideState', () => {
      it('should return false when military base is checked', () => {
        const formData = {
          mailingAddress: { 'view:livesOnMilitaryBase': true },
        };
        expect(shouldHideState(formData)).to.be.false;
      });

      it('should return true when country is not USA', () => {
        const formData = {
          mailingAddress: {
            'view:livesOnMilitaryBase': false,
            country: 'CAN',
          },
        };
        expect(shouldHideState(formData)).to.be.true;
      });

      it('should return false when military base is unchecked and country is USA', () => {
        const formData = {
          mailingAddress: {
            'view:livesOnMilitaryBase': false,
            country: 'USA',
          },
        };
        expect(shouldHideState(formData)).to.be.false;
      });
    });

    describe('isStateRequired', () => {
      it('should return true when military base is checked', () => {
        const formData = {
          mailingAddress: {
            'view:livesOnMilitaryBase': true,
            country: 'USA',
          },
        };
        expect(isStateRequired(formData)).to.be.true;
      });

      it('should return true when country is USA and military base is not checked', () => {
        const formData = {
          mailingAddress: {
            'view:livesOnMilitaryBase': false,
            country: 'USA',
          },
        };
        expect(isStateRequired(formData)).to.be.true;
      });

      it('should return false when country is not USA and military base is not checked', () => {
        const formData = {
          mailingAddress: {
            'view:livesOnMilitaryBase': false,
            country: 'CAN',
          },
        };
        expect(isStateRequired(formData)).to.be.false;
      });
    });

    describe('normalizeAddressLine', () => {
      it('should return the same value if no normalization needed', () => {
        expect(normalizeAddressLine('123 Main St')).to.equal('123 Main St');
      });

      it('should trim leading whitespace', () => {
        expect(normalizeAddressLine('   123 Main St')).to.equal('123 Main St');
      });

      it('should trim trailing whitespace', () => {
        expect(normalizeAddressLine('123 Main St   ')).to.equal('123 Main St');
      });

      it('should trim both leading and trailing whitespace', () => {
        expect(normalizeAddressLine('  123 Main St  ')).to.equal('123 Main St');
      });

      it('should collapse multiple consecutive spaces into a single space', () => {
        expect(normalizeAddressLine('123  Main  St')).to.equal('123 Main St');
      });

      it('should collapse many consecutive spaces into a single space', () => {
        expect(normalizeAddressLine('123     Main     St')).to.equal(
          '123 Main St',
        );
      });

      it('should handle both trim and collapse together', () => {
        expect(normalizeAddressLine('  123   Main   St  ')).to.equal(
          '123 Main St',
        );
      });

      it('should return empty string unchanged', () => {
        expect(normalizeAddressLine('')).to.equal('');
      });

      it('should return null unchanged', () => {
        expect(normalizeAddressLine(null)).to.equal(null);
      });

      it('should return undefined unchanged', () => {
        expect(normalizeAddressLine(undefined)).to.equal(undefined);
      });

      it('should handle string with only spaces', () => {
        expect(normalizeAddressLine('     ')).to.equal('');
      });

      it('should preserve single spaces between words', () => {
        expect(normalizeAddressLine('Apt 123 Suite B')).to.equal(
          'Apt 123 Suite B',
        );
      });

      it('should handle addresses with special characters and extra spaces', () => {
        expect(normalizeAddressLine("  O'Brien   Lane  ")).to.equal(
          "O'Brien Lane",
        );
      });
    });

    describe('createAddressValidator for addressLine', () => {
      const createMockErrors = () => {
        const errorMessages = [];
        return {
          addError: sinon.spy(msg => errorMessages.push(msg)),
          getErrors: () => errorMessages,
        };
      };

      it('should not add error for valid address line', () => {
        const validator = createAddressValidator('addressLine1');
        const errors = createMockErrors();
        validator(errors, '123 Main St');
        expect(errors.addError.called).to.be.false;
      });

      it('should not add error for empty value', () => {
        const validator = createAddressValidator('addressLine1');
        const errors = createMockErrors();
        validator(errors, '');
        expect(errors.addError.called).to.be.false;
      });

      it('should not add error for undefined value', () => {
        const validator = createAddressValidator('addressLine1');
        const errors = createMockErrors();
        validator(errors, undefined);
        expect(errors.addError.called).to.be.false;
      });

      it('should add error when value exceeds max length of 20', () => {
        const validator = createAddressValidator('addressLine1');
        const errors = createMockErrors();
        validator(errors, '123 Main Street Apartment 456');
        expect(
          errors.addError.calledWith(
            'Address line 1 must be 20 characters or less',
          ),
        ).to.be.true;
      });

      it('should add error for invalid characters - parentheses', () => {
        const validator = createAddressValidator('addressLine2');
        const errors = createMockErrors();
        validator(errors, 'Apt (2)');
        expect(errors.addError.calledWithMatch(/may only contain/)).to.be.true;
      });

      it('should add error for invalid characters - forward slash', () => {
        const validator = createAddressValidator('addressLine2');
        const errors = createMockErrors();
        validator(errors, 'Suite 1/2');
        expect(errors.addError.calledWithMatch(/may only contain/)).to.be.true;
      });

      it('should add error for invalid characters - colon', () => {
        const validator = createAddressValidator('addressLine2');
        const errors = createMockErrors();
        validator(errors, 'Unit: 5');
        expect(errors.addError.calledWithMatch(/may only contain/)).to.be.true;
      });

      it('should add error for invalid characters - at symbol', () => {
        const validator = createAddressValidator('addressLine2');
        const errors = createMockErrors();
        validator(errors, 'Care @ John');
        expect(errors.addError.calledWithMatch(/may only contain/)).to.be.true;
      });

      it('should allow valid special characters - apostrophe', () => {
        const validator = createAddressValidator('addressLine1');
        const errors = createMockErrors();
        validator(errors, "O'Brien Lane");
        expect(errors.addError.called).to.be.false;
      });

      it('should allow valid special characters - period', () => {
        const validator = createAddressValidator('addressLine1');
        const errors = createMockErrors();
        validator(errors, 'St. James Ave');
        expect(errors.addError.called).to.be.false;
      });

      it('should allow valid special characters - comma', () => {
        const validator = createAddressValidator('addressLine1');
        const errors = createMockErrors();
        validator(errors, 'Bldg 1, Suite 2');
        expect(errors.addError.called).to.be.false;
      });

      it('should allow valid special characters - ampersand', () => {
        const validator = createAddressValidator('addressLine1');
        const errors = createMockErrors();
        validator(errors, 'A & B Street');
        expect(errors.addError.called).to.be.false;
      });

      it('should allow valid special characters - hash', () => {
        const validator = createAddressValidator('addressLine1');
        const errors = createMockErrors();
        validator(errors, 'Apt #5');
        expect(errors.addError.called).to.be.false;
      });

      it('should allow valid special characters - hyphen', () => {
        const validator = createAddressValidator('addressLine1');
        const errors = createMockErrors();
        validator(errors, '123-A Main St');
        expect(errors.addError.called).to.be.false;
      });

      it('should add both errors when value is too long and has invalid characters', () => {
        const validator = createAddressValidator('addressLine1');
        const errors = createMockErrors();
        validator(errors, '123 Main Street (Apt 456)');
        expect(errors.addError.callCount).to.equal(2);
      });

      it('should include "spaces" in the error message for invalid characters', () => {
        const validator = createAddressValidator('addressLine1');
        const errors = createMockErrors();
        validator(errors, 'Apt (2)');
        expect(
          errors.addError.calledWith(
            "Address line 1 may only contain letters, numbers, spaces, and these special characters: ' . , & # -",
          ),
        ).to.be.true;
      });

      it('should throw error for invalid field key', () => {
        expect(() => createAddressValidator('invalidField')).to.throw(
          /Invalid field key/,
        );
      });

      describe('normalized value validation', () => {
        it('should validate against normalized value - passes when normalized is within limit', () => {
          const validator = createAddressValidator('addressLine1');
          const errors = createMockErrors();
          // Raw value is 21 chars but normalized is 11 chars - passes
          validator(errors, '  123    Main    St  ');
          expect(errors.addError.called).to.be.false;
        });

        it('should validate against normalized value - fails when normalized exceeds limit', () => {
          const validator = createAddressValidator('addressLine1');
          const errors = createMockErrors();
          // Raw value is 33 chars but normalized is 25 chars - still too long
          validator(errors, '  123  Main  Street  Apartment  ');
          expect(
            errors.addError.calledWith(
              'Address line 1 must be 20 characters or less',
            ),
          ).to.be.true;
        });
      });
    });

    describe('createAddressValidator for city', () => {
      const createMockErrors = () => {
        const errorMessages = [];
        return {
          addError: sinon.spy(msg => errorMessages.push(msg)),
          getErrors: () => errorMessages,
        };
      };

      it('should not add error for valid city name', () => {
        const validator = createAddressValidator('city');
        const errors = createMockErrors();
        validator(errors, 'Los Angeles');
        expect(errors.addError.called).to.be.false;
      });

      it('should not add error for empty value', () => {
        const validator = createAddressValidator('city');
        const errors = createMockErrors();
        validator(errors, '');
        expect(errors.addError.called).to.be.false;
      });

      it('should not add error for undefined value', () => {
        const validator = createAddressValidator('city');
        const errors = createMockErrors();
        validator(errors, undefined);
        expect(errors.addError.called).to.be.false;
      });

      it('should validate max length of 30', () => {
        const validator = createAddressValidator('city');
        const errors = createMockErrors();
        // 31 character city name
        validator(errors, 'Abcdefghijklmnopqrstuvwxyz12345');
        expect(errors.addError.calledWith('City must be 30 characters or less'))
          .to.be.true;
      });

      it('should add error for invalid characters - parentheses', () => {
        const validator = createAddressValidator('city');
        const errors = createMockErrors();
        validator(errors, 'City (Old)');
        expect(errors.addError.calledWithMatch(/may only contain/)).to.be.true;
      });

      it('should add helpful error when city contains comma (common user mistake)', () => {
        const validator = createAddressValidator('city');
        const errors = createMockErrors();
        validator(errors, 'Houston, TX');
        expect(
          errors.addError.calledWith(
            'Please enter only the city name. Do not include the state, zip code, or country.',
          ),
        ).to.be.true;
      });

      it('should add error for invalid characters - ampersand', () => {
        const validator = createAddressValidator('city');
        const errors = createMockErrors();
        validator(errors, 'Town & City');
        expect(errors.addError.calledWithMatch(/may only contain/)).to.be.true;
      });

      it('should allow valid special characters - apostrophe', () => {
        const validator = createAddressValidator('city');
        const errors = createMockErrors();
        validator(errors, "O'Fallon");
        expect(errors.addError.called).to.be.false;
      });

      it('should allow valid special characters - period', () => {
        const validator = createAddressValidator('city');
        const errors = createMockErrors();
        validator(errors, 'St. Louis');
        expect(errors.addError.called).to.be.false;
      });

      it('should allow valid special characters - hash', () => {
        const validator = createAddressValidator('city');
        const errors = createMockErrors();
        validator(errors, 'City #1');
        expect(errors.addError.called).to.be.false;
      });

      it('should allow valid special characters - hyphen', () => {
        const validator = createAddressValidator('city');
        const errors = createMockErrors();
        validator(errors, 'Winston-Salem');
        expect(errors.addError.called).to.be.false;
      });

      it('should allow international city names', () => {
        const validator = createAddressValidator('city');
        const errors = createMockErrors();
        validator(errors, 'Al Farwaniyah');
        expect(errors.addError.called).to.be.false;
      });

      it('should allow military cities', () => {
        const validator = createAddressValidator('city');
        const errors = createMockErrors();
        validator(errors, 'APO');
        expect(errors.addError.called).to.be.false;
      });

      describe('normalized value validation', () => {
        it('should validate against normalized value - passes when normalized is within limit', () => {
          const validator = createAddressValidator('city');
          const errors = createMockErrors();
          // Raw value has extra spaces but normalized is 11 chars - passes (max 30)
          validator(errors, '  Los   Angeles  ');
          expect(errors.addError.called).to.be.false;
        });

        it('should not fail pattern check for value with extra spaces', () => {
          const validator = createAddressValidator('city');
          const errors = createMockErrors();
          // Extra spaces would fail the pattern, but normalization fixes it
          validator(errors, 'Los    Angeles');
          expect(errors.addError.called).to.be.false;
        });
      });
    });
  });

  describe('hasInvalidPrefillData', () => {
    it('should return false for null/undefined input', () => {
      expect(hasInvalidPrefillData(null)).to.be.false;
      expect(hasInvalidPrefillData(undefined)).to.be.false;
    });

    it('should return false for valid address data', () => {
      expect(
        hasInvalidPrefillData({
          addressLine1: '123 Main St',
          city: 'Anytown',
        }),
      ).to.be.false;
    });

    it('should return false for empty fields', () => {
      expect(
        hasInvalidPrefillData({
          addressLine1: '',
          addressLine2: '',
          city: '',
        }),
      ).to.be.false;
    });

    it('should return true for addressLine1 with disallowed characters', () => {
      expect(
        hasInvalidPrefillData({
          addressLine1: '123 Main St @#!',
          city: 'Anytown',
        }),
      ).to.be.true;
    });

    it('should return true for addressLine2 with disallowed characters', () => {
      expect(
        hasInvalidPrefillData({
          addressLine1: '123 Main St',
          addressLine2: 'Apt (2)',
          city: 'Anytown',
        }),
      ).to.be.true;
    });

    it('should return true for addressLine3 with disallowed characters', () => {
      expect(
        hasInvalidPrefillData({
          addressLine1: '123 Main St',
          addressLine3: 'Suite [5]',
          city: 'Anytown',
        }),
      ).to.be.true;
    });

    it('should return true for city with disallowed characters', () => {
      expect(
        hasInvalidPrefillData({
          addressLine1: '123 Main St',
          city: 'Any$town!',
        }),
      ).to.be.true;
    });

    it('should return false for address with extra spaces (normalized before check)', () => {
      // Extra spaces get collapsed by normalization, so they should NOT
      // be considered invalid — same behavior as createAddressValidator
      expect(
        hasInvalidPrefillData({
          addressLine1: '123  Main   St',
          city: 'Los    Angeles',
        }),
      ).to.be.false;
    });

    it('should return false for address with leading/trailing spaces', () => {
      expect(
        hasInvalidPrefillData({
          addressLine1: '  123 Main St  ',
          city: '  Anytown  ',
        }),
      ).to.be.false;
    });

    it('should return true if any one field is invalid even if others are valid', () => {
      expect(
        hasInvalidPrefillData({
          addressLine1: '123 Main St', // valid
          addressLine2: 'Apt 2', // valid
          city: 'Bad@City', // invalid
        }),
      ).to.be.true;
    });

    it('should return false when only missing fields are present', () => {
      expect(hasInvalidPrefillData({})).to.be.false;
    });

    it('should allow all valid special characters in address lines', () => {
      // Pattern allows: ' . , & # -
      expect(
        hasInvalidPrefillData({
          addressLine1: "St. Mary's #2, A-B&C",
        }),
      ).to.be.false;
    });

    it('should allow all valid special characters in city', () => {
      // City pattern allows: ' . # -
      expect(
        hasInvalidPrefillData({
          city: "St. Mary's #2-B",
        }),
      ).to.be.false;
    });

    it('should detect comma in city as invalid', () => {
      // City pattern does NOT allow commas
      expect(
        hasInvalidPrefillData({
          addressLine1: '123 Main St',
          city: 'Anytown, MI',
        }),
      ).to.be.true;
    });

    it('should return true for addressLine1 exceeding 20 chars after normalization', () => {
      expect(
        hasInvalidPrefillData({
          addressLine1: 'This Address Is Way Too Long For Field',
          city: 'Anytown',
        }),
      ).to.be.true;
    });

    it('should return true for city exceeding 30 chars after normalization', () => {
      expect(
        hasInvalidPrefillData({
          addressLine1: '123 Main St',
          city:
            'A Very Long City Name That Exceeds The Thirty Character Maximum',
        }),
      ).to.be.true;
    });

    it('should return false when extra spaces make raw length > 20 but normalized length <= 20', () => {
      // Raw: "  also.        spaces" = 21 chars (> 20)
      // Normalized: "also. spaces" = 12 chars (<= 20)
      expect(
        hasInvalidPrefillData({
          addressLine3: '  also.        spaces',
        }),
      ).to.be.false;
    });

    it('should return true when normalized length still exceeds maxLength', () => {
      // Even after normalization, this is over 20 chars
      expect(
        hasInvalidPrefillData({
          addressLine1: '1234567890 1234567890 Extra',
        }),
      ).to.be.true;
    });
  });
});
