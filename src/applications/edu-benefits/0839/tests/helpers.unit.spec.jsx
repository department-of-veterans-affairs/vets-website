import { expect } from 'chai';
import {
  validateInitials,
  formatAddress,
  toTitleCase,
  getCardDescription,
  getCardTitle,
  createBannerMessage,
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

      it('returns message when code is not in branches or extensions', () => {
        const details = {
          facilityCode: '99999999',
          yrEligible: true,
          ihlEligible: true,
        };
        const result = createBannerMessage(details, true, mainInstitution);
        expect(result).to.equal(
          "This facility code can't be accepted because it's not associated with your main campus. Check your WEAMS 22-1998 Report or contact your ELR for a list of eligible codes.",
        );
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
});
