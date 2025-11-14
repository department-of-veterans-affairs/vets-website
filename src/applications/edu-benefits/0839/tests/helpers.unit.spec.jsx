import { expect } from 'chai';
import {
  validateInitials,
  formatAddress,
  toTitleCase,
  getCardDescription,
  getCardTitle,
  createBannerMessage,
  facilityCodeUIValidation,
} from '../helpers';

describe('0839 Helpers', () => {
  describe('validateInitials', () => {
    const firstName = 'John';
    const lastName = 'Doe';

    it('returns empty string when inputValue is empty', () => {
      expect(validateInitials('', firstName, lastName)).to.equal('');
    });

    it('returns empty string when inputValue is null', () => {
      expect(validateInitials(null, firstName, lastName)).to.equal('');
    });

    it('returns error when inputValue contains non-letter characters', () => {
      expect(validateInitials('J1', firstName, lastName)).to.equal(
        'Please enter your initials using letters only',
      );
    });

    it('returns error when inputValue contains special characters', () => {
      expect(validateInitials('J@', firstName, lastName)).to.equal(
        'Please enter your initials using letters only',
      );
    });

    it('returns error when inputValue contains spaces', () => {
      expect(validateInitials('J D', firstName, lastName)).to.equal(
        'Please enter your initials using letters only',
      );
    });

    it('does not error when initials match first and last name', () => {
      expect(validateInitials('JD', firstName, lastName)).to.equal('');
    });

    it('returns error when first initial does not match', () => {
      expect(validateInitials('AD', firstName, lastName)).to.equal(
        `Initials must match your name: ${firstName} ${lastName}`,
      );
    });

    it('returns error when last initial does not match', () => {
      expect(validateInitials('JA', firstName, lastName)).to.equal(
        `Initials must match your name: ${firstName} ${lastName}`,
      );
    });

    it('returns error when both initials do not match', () => {
      expect(validateInitials('AB', firstName, lastName)).to.equal(
        `Initials must match your name: ${firstName} ${lastName}`,
      );
    });

    describe('with hyphenated last name', () => {
      const hyphenatedLastName = 'Smith-Jones';

      it('accepts 3 initials when matching hyphenated last name', () => {
        expect(validateInitials('JSJ', firstName, hyphenatedLastName)).to.equal(
          '',
        );
      });

      it('returns error when third initial does not match second part of hyphenated last name', () => {
        expect(validateInitials('JSA', firstName, hyphenatedLastName)).to.equal(
          `Initials must match your name: ${firstName} ${hyphenatedLastName}`,
        );
      });

      it('returns empty string when only 2 initials provided for hyphenated last name', () => {
        expect(validateInitials('JS', firstName, hyphenatedLastName)).to.equal(
          '',
        );
      });
    });
  });

  describe('formatAddress', () => {
    it('returns input when not a string', () => {
      expect(formatAddress(null)).to.equal(null);
      expect(formatAddress(undefined)).to.equal(undefined);
      expect(formatAddress(123)).to.equal(123);
    });

    it('returns input when empty string', () => {
      expect(formatAddress('')).to.equal('');
      expect(formatAddress('   ')).to.equal('   ');
    });

    it('capitalizes normal words', () => {
      expect(formatAddress('main street')).to.equal('Main Street');
      expect(formatAddress('MAIN STREET')).to.equal('Main Street');
      expect(formatAddress('main STREET')).to.equal('Main Street');
    });

    it('keeps directional abbreviations uppercase', () => {
      expect(formatAddress('123 nw main street')).to.equal(
        '123 NW Main Street',
      );
      expect(formatAddress('456 ne avenue')).to.equal('456 NE Avenue');
      expect(formatAddress('789 sw boulevard')).to.equal('789 SW Boulevard');
      expect(formatAddress('101 se road')).to.equal('101 SE Road');
    });

    it('handles PO Box correctly', () => {
      expect(formatAddress('po box 123')).to.equal('PO Box 123');
      expect(formatAddress('PO BOX 456')).to.equal('PO Box 456');
    });

    it('handles hyphenated words', () => {
      expect(formatAddress('saint-charles street')).to.equal(
        'Saint-Charles Street',
      );
      expect(formatAddress('NORTH-WEST avenue')).to.equal('North-West Avenue');
    });

    it('handles address with numbers and letters', () => {
      expect(formatAddress('123A main street')).to.equal('123A Main Street');
      expect(formatAddress('456b elm avenue')).to.equal('456b Elm Avenue');
    });

    it('handles already uppercase numbers with letters', () => {
      expect(formatAddress('123ABC main')).to.equal('123ABC Main');
    });

    it('handles multiple spaces', () => {
      expect(formatAddress('123   main   street')).to.equal('123 Main Street');
    });

    it('trims whitespace', () => {
      expect(formatAddress('  123 main street  ')).to.equal('123 Main Street');
    });
  });

  describe('toTitleCase', () => {
    it('returns empty string for non-string input', () => {
      expect(toTitleCase(null)).to.equal('');
      expect(toTitleCase(undefined)).to.equal('');
      expect(toTitleCase(123)).to.equal('');
    });

    it('returns empty string for empty or whitespace input', () => {
      expect(toTitleCase('')).to.equal('');
      expect(toTitleCase('   ')).to.equal('');
    });

    it('capitalizes first letter of each word', () => {
      expect(toTitleCase('hello world')).to.equal('Hello World');
      expect(toTitleCase('HELLO WORLD')).to.equal('Hello World');
      expect(toTitleCase('hello WORLD')).to.equal('Hello World');
    });

    it('handles hyphenated words', () => {
      expect(toTitleCase('saint-charles university')).to.equal(
        'Saint-Charles University',
      );
      expect(toTitleCase('NORTH-WEST college')).to.equal('North-West College');
    });

    it('handles multiple spaces', () => {
      expect(toTitleCase('university   of   california')).to.equal(
        'University Of California',
      );
    });

    it('trims whitespace', () => {
      expect(toTitleCase('  university of california  ')).to.equal(
        'University Of California',
      );
    });
  });

  describe('getCardDescription', () => {
    it('returns null when item is null or undefined', () => {
      expect(getCardDescription(null)).to.equal(null);
      expect(getCardDescription(undefined)).to.equal(null);
    });

    it('renders facility code', () => {
      const item = {
        facilityCode: '12345678',
      };
      const result = getCardDescription(item);
      expect(result).to.not.be.null;
    });

    it('renders address when present', () => {
      const item = {
        facilityCode: '12345678',
        institutionAddress: {
          street: '123 Main St',
          city: 'Boston',
          state: 'MA',
          postalCode: '02101',
        },
      };
      const result = getCardDescription(item);
      expect(result).to.not.be.null;
    });

    it('handles multiple street lines', () => {
      const item = {
        facilityCode: '12345678',
        institutionAddress: {
          street: '123 Main St',
          street2: 'Suite 100',
          street3: 'Building A',
          city: 'Boston',
          state: 'MA',
          postalCode: '02101',
        },
      };
      const result = getCardDescription(item);
      expect(result).to.not.be.null;
    });

    it('handles missing optional address fields', () => {
      const item = {
        facilityCode: '12345678',
        institutionAddress: {
          street: '123 Main St',
          city: 'Boston',
          state: 'MA',
          postalCode: '02101',
        },
      };
      const result = getCardDescription(item);
      expect(result).to.not.be.null;
    });
  });

  describe('getCardTitle', () => {
    it('returns default title when item is null or undefined', () => {
      expect(getCardTitle(null)).to.equal('Institution Details');
      expect(getCardTitle(undefined)).to.equal('Institution Details');
    });

    it('returns institution name when present', () => {
      const item = {
        institutionName: 'harvard university',
        facilityCode: '12345678',
      };
      expect(getCardTitle(item)).to.equal('Harvard University');
    });

    it('returns facility code when institution name is missing', () => {
      const item = {
        facilityCode: '12345678',
      };
      expect(getCardTitle(item)).to.equal('Facility Code: 12345678');
    });

    it('returns facility code when institution name is empty', () => {
      const item = {
        institutionName: '',
        facilityCode: '12345678',
      };
      expect(getCardTitle(item)).to.equal('Facility Code: 12345678');
    });
  });

  describe('createBannerMessage', () => {
    const mainInstitution = {
      facilityCode: '12345678',
      facilityMap: {
        branches: [
          { institution: { facilityCode: '11111111' } },
          { institution: { facilityCode: '22222222' } },
        ],
        extensions: [
          { institution: { facilityCode: '33333333' } },
          { institution: { facilityCode: '44444444' } },
        ],
      },
    };

    describe('for main institution (isArrayItem = false)', () => {
      it('returns null when institution is not found', () => {
        const details = {
          facilityCode: '12345678',
          institutionName: 'not found',
        };
        const result = createBannerMessage(details, false, mainInstitution);
        expect(result).to.be.null;
      });

      it('returns message when institution is not YR eligible', () => {
        const details = {
          facilityCode: '12345678',
          yrEligible: false,
          ihlEligible: true,
        };
        const result = createBannerMessage(details, false, mainInstitution);
        expect(result).to.equal(
          'This institution is unable to participate in the Yellow Ribbon Program. You can enter a main or branch campus facility code to continue.',
        );
      });

      it('returns message when institution is YR eligible but not IHL', () => {
        const details = {
          facilityCode: '12345678',
          yrEligible: true,
          ihlEligible: false,
        };
        const result = createBannerMessage(details, false, mainInstitution);
        expect(result).to.equal(
          'This institution is unable to participate in the Yellow Ribbon Program.',
        );
      });

      it('returns null when institution is both YR and IHL eligible', () => {
        const details = {
          facilityCode: '12345678',
          yrEligible: true,
          ihlEligible: true,
        };
        const result = createBannerMessage(details, false, mainInstitution);
        expect(result).to.be.null;
      });

      it('returns null when institution is not IHL and not YR eligible', () => {
        const details = {
          facilityCode: '12345678',
          yrEligible: false,
          ihlEligible: false,
        };
        const result = createBannerMessage(details, false, mainInstitution);
        expect(result).to.equal(
          'This institution is unable to participate in the Yellow Ribbon Program. You can enter a main or branch campus facility code to continue.',
        );
      });
    });

    describe('for additional institution (isArrayItem = true)', () => {
      it('returns message for X in third position', () => {
        const details = {
          facilityCode: '12X45678',
          yrEligible: true,
          ihlEligible: true,
        };
        const result = createBannerMessage(details, true, mainInstitution);
        expect(result).to.equal(
          "This facility code can't be accepted. Check your WEAMS 22-1998 Report or contact your ELR for a list of eligible codes.",
        );
      });

      it('returns null when code is not in branches or extensions', () => {
        const details = {
          facilityCode: '99999999',
          yrEligible: true,
          ihlEligible: true,
        };
        const result = createBannerMessage(details, true, mainInstitution);
        expect(result).to.be.null;
      });

      it('returns null when code is in branches', () => {
        const details = {
          facilityCode: '11111111',
          yrEligible: true,
          ihlEligible: true,
        };
        const result = createBannerMessage(details, true, mainInstitution);
        expect(result).to.be.null;
      });

      it('returns null when code is in extensions', () => {
        const details = {
          facilityCode: '33333333',
          yrEligible: true,
          ihlEligible: true,
        };
        const result = createBannerMessage(details, true, mainInstitution);
        expect(result).to.be.null;
      });
    });
  });

  describe('facilityCodeUIValidation', () => {
    let errors;

    beforeEach(() => {
      errors = {
        addError(message) {
          this.message = message;
        },
      };
    });

    describe('loading state', () => {
      it('does not add errors when item is loading', () => {
        const formData = {
          institutionDetails: {
            facilityCode: '12345678',
            facilityMap: {
              branches: [],
              extensions: [],
            },
          },
          additionalInstitutionDetails: [
            {
              facilityCode: '12345678',
              isLoading: true,
              institutionName: 'not found',
              yrEligible: false,
              ihlEligible: false,
            },
          ],
        };

        facilityCodeUIValidation(errors, '12345678', formData);
        expect(errors.message).to.be.undefined;
      });
    });

    describe('X in third position validation', () => {
      it('adds error when facility code has uppercase X in third position', () => {
        const formData = {
          institutionDetails: {
            facilityCode: '12345678',
            facilityMap: {
              branches: [{ institution: { facilityCode: '12X45678' } }],
              extensions: [],
            },
          },
          additionalInstitutionDetails: [
            {
              facilityCode: '12X45678',
              isLoading: false,
              institutionName: 'Test Institution',
              yrEligible: true,
              ihlEligible: true,
            },
          ],
        };

        facilityCodeUIValidation(errors, '12X45678', formData);
        expect(errors.message).to.equal(
          'Codes with an "X" in the third position are not eligible',
        );
      });

      it('does not add error when X is in another position', () => {
        const formData = {
          institutionDetails: {
            facilityCode: '12345678',
            facilityMap: {
              branches: [{ institution: { facilityCode: '1X345678' } }],
              extensions: [],
            },
          },
          additionalInstitutionDetails: [
            {
              facilityCode: '1X345678',
              isLoading: false,
              institutionName: 'Test Institution',
              yrEligible: true,
              ihlEligible: true,
            },
          ],
        };

        facilityCodeUIValidation(errors, '1X345678', formData);
        expect(errors.message).to.be.undefined;
      });
    });

    describe('format validation', () => {
      it('adds error for facility code with less than 8 characters', () => {
        const formData = {
          institutionDetails: {
            facilityCode: '12345678',
            facilityMap: {
              branches: [],
              extensions: [],
            },
          },
          additionalInstitutionDetails: [
            {
              facilityCode: '1234',
              isLoading: false,
            },
          ],
        };

        facilityCodeUIValidation(errors, '1234', formData);
        expect(errors.message).to.equal(
          'Please enter a valid facility code. To determine your facility code, refer to your WEAMS 22-1998 Report or contact your ELR.',
        );
      });

      it('adds error for facility code with more than 8 characters', () => {
        const formData = {
          institutionDetails: {
            facilityCode: '12345678',
            facilityMap: {
              branches: [],
              extensions: [],
            },
          },
          additionalInstitutionDetails: [
            {
              facilityCode: '123456789',
              isLoading: false,
            },
          ],
        };

        facilityCodeUIValidation(errors, '123456789', formData);
        expect(errors.message).to.equal(
          'Please enter a valid facility code. To determine your facility code, refer to your WEAMS 22-1998 Report or contact your ELR.',
        );
      });

      it('adds error for facility code with special characters', () => {
        const formData = {
          institutionDetails: {
            facilityCode: '12345678',
            facilityMap: {
              branches: [],
              extensions: [],
            },
          },
          additionalInstitutionDetails: [
            {
              facilityCode: '1234-678',
              isLoading: false,
            },
          ],
        };

        facilityCodeUIValidation(errors, '1234-678', formData);
        expect(errors.message).to.equal(
          'Please enter a valid facility code. To determine your facility code, refer to your WEAMS 22-1998 Report or contact your ELR.',
        );
      });

      it('handles whitespace trimming', () => {
        const formData = {
          institutionDetails: {
            facilityCode: '12345678',
            facilityMap: {
              branches: [{ institution: { facilityCode: 'ABCD1234' } }],
              extensions: [],
            },
          },
          additionalInstitutionDetails: [
            {
              facilityCode: '  ABCD1234  ',
              isLoading: false,
              institutionName: 'Test Institution',
              yrEligible: true,
              ihlEligible: true,
            },
          ],
        };

        facilityCodeUIValidation(errors, '  ABCD1234  ', formData);
        expect(errors.message).to.equal(
          'Please enter a valid facility code. To determine your facility code, refer to your WEAMS 22-1998 Report or contact your ELR.',
        );
      });
    });

    describe('institution not found validation', () => {
      it('adds error when institution name is "not found"', () => {
        const formData = {
          institutionDetails: {
            facilityCode: '12345678',
            facilityMap: {
              branches: [{ institution: { facilityCode: 'ABCD1234' } }],
              extensions: [],
            },
          },
          additionalInstitutionDetails: [
            {
              facilityCode: 'ABCD1234',
              institutionName: 'not found',
              isLoading: false,
            },
          ],
        };

        facilityCodeUIValidation(errors, 'ABCD1234', formData);
        expect(errors.message).to.equal(
          'Please enter a valid facility code. To determine your facility code, refer to your WEAMS 22-1998 Report or contact your ELR.',
        );
      });

      it('does not add error when institution is found', () => {
        const formData = {
          institutionDetails: {
            facilityCode: '12345678',
            facilityMap: {
              branches: [{ institution: { facilityCode: 'ABCD1234' } }],
              extensions: [],
            },
          },
          additionalInstitutionDetails: [
            {
              facilityCode: 'ABCD1234',
              institutionName: 'Harvard University',
              isLoading: false,
              yrEligible: true,
              ihlEligible: true,
            },
          ],
        };

        facilityCodeUIValidation(errors, 'ABCD1234', formData);
        expect(errors.message).to.be.undefined;
      });
    });

    describe('branch list validation', () => {
      it('does not add error when facility code is not in branches or extensions', () => {
        const formData = {
          institutionDetails: {
            facilityCode: '12345678',
            facilityMap: {
              branches: [{ institution: { facilityCode: 'ABCD1234' } }],
              extensions: [{ institution: { facilityCode: 'EFGH5678' } }],
            },
          },
          additionalInstitutionDetails: [
            {
              facilityCode: 'ZZZZ9999',
              institutionName: 'Test Institution',
              isLoading: false,
              yrEligible: true,
              ihlEligible: true,
            },
          ],
        };

        facilityCodeUIValidation(errors, 'ZZZZ9999', formData);
        expect(errors.message).to.be.undefined;
      });

      it('does not add error when facility code is in branches list', () => {
        const formData = {
          institutionDetails: {
            facilityCode: '12345678',
            facilityMap: {
              branches: [{ institution: { facilityCode: '11234567' } }],
              extensions: [],
            },
          },
          additionalInstitutionDetails: [
            {
              facilityCode: '11234567',
              institutionName: 'Test Branch Institution',
              isLoading: false,
              yrEligible: true,
              ihlEligible: true,
            },
          ],
        };

        facilityCodeUIValidation(errors, '11234567', formData);
        expect(errors.message).to.be.undefined;
      });

      it('does not add error when facility code is in extensions list', () => {
        const formData = {
          institutionDetails: {
            facilityCode: '12345678',
            facilityMap: {
              branches: [],
              extensions: [{ institution: { facilityCode: 'EFGH5678' } }],
            },
          },
          additionalInstitutionDetails: [
            {
              facilityCode: 'EFGH5678',
              institutionName: 'Test Extension Institution',
              isLoading: false,
              yrEligible: true,
              ihlEligible: true,
            },
          ],
        };

        facilityCodeUIValidation(errors, 'EFGH5678', formData);
        expect(errors.message).to.be.undefined;
      });

      it('does not add error when branches and extensions arrays are empty', () => {
        const formData = {
          institutionDetails: {
            facilityCode: '12345678',
            facilityMap: {
              branches: [],
              extensions: [],
            },
          },
          additionalInstitutionDetails: [
            {
              facilityCode: 'ABCD1234',
              institutionName: 'Test Institution',
              isLoading: false,
              yrEligible: true,
              ihlEligible: true,
            },
          ],
        };

        facilityCodeUIValidation(errors, 'ABCD1234', formData);
        expect(errors.message).to.be.undefined;
      });

      it('does not add error when facilityMap is missing', () => {
        const formData = {
          institutionDetails: {
            facilityCode: '12345678',
          },
          additionalInstitutionDetails: [
            {
              facilityCode: 'ABCD1234',
              institutionName: 'Test Institution',
              isLoading: false,
              yrEligible: true,
              ihlEligible: true,
            },
          ],
        };

        facilityCodeUIValidation(errors, 'ABCD1234', formData);
        expect(errors.message).to.be.undefined;
      });
    });

    describe('Yellow Ribbon eligibility validation', () => {
      it('adds error when institution is not YR eligible', () => {
        const formData = {
          institutionDetails: {
            facilityCode: '12345678',
            facilityMap: {
              branches: [{ institution: { facilityCode: 'ABCD1234' } }],
              extensions: [],
            },
          },
          additionalInstitutionDetails: [
            {
              facilityCode: 'ABCD1234',
              institutionName: 'Test Institution',
              yrEligible: false,
              ihlEligible: true,
              isLoading: false,
            },
          ],
        };

        facilityCodeUIValidation(errors, 'ABCD1234', formData);
        expect(errors.message).to.equal(
          "The institution isn't eligible for the Yellow Ribbon Program.",
        );
      });

      it('does not add YR error when yrEligible is true', () => {
        const formData = {
          institutionDetails: {
            facilityCode: '12345678',
            facilityMap: {
              branches: [{ institution: { facilityCode: '21234567' } }],
              extensions: [],
            },
          },
          additionalInstitutionDetails: [
            {
              facilityCode: '21234567',
              institutionName: 'Test Institution',
              yrEligible: true,
              ihlEligible: true,
              isLoading: false,
            },
          ],
        };

        facilityCodeUIValidation(errors, '21234567', formData);
        expect(errors.message).to.be.undefined;
      });

      it('does not add YR error when yrEligible is undefined', () => {
        const formData = {
          institutionDetails: {
            facilityCode: '12345678',
            facilityMap: {
              branches: [{ institution: { facilityCode: 'ABCD1234' } }],
              extensions: [],
            },
          },
          additionalInstitutionDetails: [
            {
              facilityCode: 'ABCD1234',
              institutionName: 'Test Institution',
              ihlEligible: true,
              isLoading: false,
            },
          ],
        };

        facilityCodeUIValidation(errors, 'ABCD1234', formData);
        expect(errors.message).to.be.undefined;
      });
    });

    describe('IHL eligibility validation', () => {
      it('adds error when institution is not IHL eligible but is YR eligible', () => {
        const formData = {
          institutionDetails: {
            facilityCode: '12345678',
            facilityMap: {
              branches: [{ institution: { facilityCode: '14234567' } }],
              extensions: [],
            },
          },
          additionalInstitutionDetails: [
            {
              facilityCode: '14234567',
              institutionName: 'Test Institution',
              yrEligible: true,
              ihlEligible: false,
              isLoading: false,
            },
          ],
        };

        facilityCodeUIValidation(errors, '14234567', formData);
        expect(errors.message).to.equal(
          'This institution is not an IHL. Please see information below.',
        );
      });

      it('does not add IHL error when institution is not YR eligible', () => {
        const formData = {
          institutionDetails: {
            facilityCode: '12345678',
            facilityMap: {
              branches: [{ institution: { facilityCode: 'ABCD1234' } }],
              extensions: [],
            },
          },
          additionalInstitutionDetails: [
            {
              facilityCode: 'ABCD1234',
              institutionName: 'Test Institution',
              yrEligible: false,
              ihlEligible: false,
              isLoading: false,
            },
          ],
        };

        facilityCodeUIValidation(errors, 'ABCD1234', formData);
        // Should fail with YR error, not IHL error
        expect(errors.message).to.equal(
          "The institution isn't eligible for the Yellow Ribbon Program.",
        );
      });

      it('does not add error when both YR and IHL eligible', () => {
        const formData = {
          institutionDetails: {
            facilityCode: '12345678',
            facilityMap: {
              branches: [{ institution: { facilityCode: '31234567' } }],
              extensions: [],
            },
          },
          additionalInstitutionDetails: [
            {
              facilityCode: '31234567',
              institutionName: 'Test Institution',
              yrEligible: true,
              ihlEligible: true,
              isLoading: false,
            },
          ],
        };

        facilityCodeUIValidation(errors, '31234567', formData);
        expect(errors.message).to.be.undefined;
      });

      it('does not add IHL error when ihlEligible is undefined', () => {
        const formData = {
          institutionDetails: {
            facilityCode: '12345678',
            facilityMap: {
              branches: [{ institution: { facilityCode: 'ABCD1234' } }],
              extensions: [],
            },
          },
          additionalInstitutionDetails: [
            {
              facilityCode: 'ABCD1234',
              institutionName: 'Test Institution',
              yrEligible: true,
              isLoading: false,
            },
          ],
        };

        facilityCodeUIValidation(errors, 'ABCD1234', formData);
        expect(errors.message).to.be.undefined;
      });
    });

    describe('validation priority order', () => {
      it('prioritizes X in third position over other errors', () => {
        const formData = {
          institutionDetails: {
            facilityCode: '12345678',
            facilityMap: {
              branches: [],
              extensions: [],
            },
          },
          additionalInstitutionDetails: [
            {
              facilityCode: '12X45678',
              institutionName: 'not found',
              yrEligible: false,
              ihlEligible: false,
              isLoading: false,
            },
          ],
        };

        facilityCodeUIValidation(errors, '12X45678', formData);
        expect(errors.message).to.equal(
          'Codes with an "X" in the third position are not eligible',
        );
      });

      it('prioritizes bad format over branch list check', () => {
        const formData = {
          institutionDetails: {
            facilityCode: '12345678',
            facilityMap: {
              branches: [],
              extensions: [],
            },
          },
          additionalInstitutionDetails: [
            {
              facilityCode: '1234',
              institutionName: 'Test',
              yrEligible: false,
              ihlEligible: false,
              isLoading: false,
            },
          ],
        };

        facilityCodeUIValidation(errors, '1234', formData);
        expect(errors.message).to.equal(
          'Please enter a valid facility code. To determine your facility code, refer to your WEAMS 22-1998 Report or contact your ELR.',
        );
      });

      it('prioritizes YR eligibility when facility code is not in branch list', () => {
        const formData = {
          institutionDetails: {
            facilityCode: '12345678',
            facilityMap: {
              branches: [{ institution: { facilityCode: 'ABCD1234' } }],
              extensions: [],
            },
          },
          additionalInstitutionDetails: [
            {
              facilityCode: 'ZZZZ9999',
              institutionName: 'Test Institution',
              yrEligible: false,
              ihlEligible: false,
              isLoading: false,
            },
          ],
        };

        facilityCodeUIValidation(errors, 'ZZZZ9999', formData);
        expect(errors.message).to.equal(
          "The institution isn't eligible for the Yellow Ribbon Program.",
        );
      });

      it('prioritizes YR eligibility over IHL eligibility', () => {
        const formData = {
          institutionDetails: {
            facilityCode: '12345678',
            facilityMap: {
              branches: [{ institution: { facilityCode: 'ABCD1234' } }],
              extensions: [],
            },
          },
          additionalInstitutionDetails: [
            {
              facilityCode: 'ABCD1234',
              institutionName: 'Test Institution',
              yrEligible: false,
              ihlEligible: false,
              isLoading: false,
            },
          ],
        };

        facilityCodeUIValidation(errors, 'ABCD1234', formData);
        expect(errors.message).to.equal(
          "The institution isn't eligible for the Yellow Ribbon Program.",
        );
      });
    });
  });
});
