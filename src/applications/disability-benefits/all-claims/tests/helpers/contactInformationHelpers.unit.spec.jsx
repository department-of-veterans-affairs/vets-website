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
  createAddressLineValidator,
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

    describe('createAddressLineValidator', () => {
      const createMockErrors = () => {
        const errorMessages = [];
        return {
          addError: sinon.spy(msg => errorMessages.push(msg)),
          getErrors: () => errorMessages,
        };
      };

      it('should not add error for valid address line', () => {
        const validator = createAddressLineValidator(20, 'Address line 1');
        const errors = createMockErrors();
        validator(errors, '123 Main St');
        expect(errors.addError.called).to.be.false;
      });

      it('should not add error for empty value', () => {
        const validator = createAddressLineValidator(20, 'Address line 1');
        const errors = createMockErrors();
        validator(errors, '');
        expect(errors.addError.called).to.be.false;
      });

      it('should not add error for undefined value', () => {
        const validator = createAddressLineValidator(20, 'Address line 1');
        const errors = createMockErrors();
        validator(errors, undefined);
        expect(errors.addError.called).to.be.false;
      });

      it('should add error when value exceeds max length', () => {
        const validator = createAddressLineValidator(20, 'Address line 1');
        const errors = createMockErrors();
        validator(errors, '123 Main Street Apartment 456');
        expect(
          errors.addError.calledWith(
            'Address line 1 must be 20 characters or less',
          ),
        ).to.be.true;
      });

      it('should add error for invalid characters - parentheses', () => {
        const validator = createAddressLineValidator(20, 'Address line 2');
        const errors = createMockErrors();
        validator(errors, 'Apt (2)');
        expect(errors.addError.calledWithMatch(/may only contain/)).to.be.true;
      });

      it('should add error for invalid characters - forward slash', () => {
        const validator = createAddressLineValidator(20, 'Address line 2');
        const errors = createMockErrors();
        validator(errors, 'Suite 1/2');
        expect(errors.addError.calledWithMatch(/may only contain/)).to.be.true;
      });

      it('should add error for invalid characters - colon', () => {
        const validator = createAddressLineValidator(20, 'Address line 2');
        const errors = createMockErrors();
        validator(errors, 'Unit: 5');
        expect(errors.addError.calledWithMatch(/may only contain/)).to.be.true;
      });

      it('should add error for invalid characters - at symbol', () => {
        const validator = createAddressLineValidator(20, 'Address line 2');
        const errors = createMockErrors();
        validator(errors, 'Care @ John');
        expect(errors.addError.calledWithMatch(/may only contain/)).to.be.true;
      });

      it('should allow valid special characters - apostrophe', () => {
        const validator = createAddressLineValidator(20, 'Address line 1');
        const errors = createMockErrors();
        validator(errors, "O'Brien Lane");
        expect(errors.addError.called).to.be.false;
      });

      it('should allow valid special characters - period', () => {
        const validator = createAddressLineValidator(20, 'Address line 1');
        const errors = createMockErrors();
        validator(errors, 'St. James Ave');
        expect(errors.addError.called).to.be.false;
      });

      it('should allow valid special characters - comma', () => {
        const validator = createAddressLineValidator(20, 'Address line 1');
        const errors = createMockErrors();
        validator(errors, 'Bldg 1, Suite 2');
        expect(errors.addError.called).to.be.false;
      });

      it('should allow valid special characters - ampersand', () => {
        const validator = createAddressLineValidator(20, 'Address line 1');
        const errors = createMockErrors();
        validator(errors, 'A & B Street');
        expect(errors.addError.called).to.be.false;
      });

      it('should allow valid special characters - hash', () => {
        const validator = createAddressLineValidator(20, 'Address line 1');
        const errors = createMockErrors();
        validator(errors, 'Apt #5');
        expect(errors.addError.called).to.be.false;
      });

      it('should allow valid special characters - hyphen', () => {
        const validator = createAddressLineValidator(20, 'Address line 1');
        const errors = createMockErrors();
        validator(errors, '123-A Main St');
        expect(errors.addError.called).to.be.false;
      });

      it('should add both errors when value is too long and has invalid characters', () => {
        const validator = createAddressLineValidator(20, 'Address line 1');
        const errors = createMockErrors();
        validator(errors, '123 Main Street (Apt 456)');
        expect(errors.addError.callCount).to.equal(2);
      });
    });
  });
});
