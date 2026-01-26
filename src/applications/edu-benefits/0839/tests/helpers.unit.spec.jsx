import { expect } from 'chai';
import { renderToStaticMarkup } from 'react-dom/server';
import {
  validateInitials,
  formatAddress,
  toTitleCase,
  getCardDescription,
  getCardTitle,
  createBannerMessage,
  facilityCodeUIValidation,
  showAdditionalPointsOfContact,
  getAdditionalContactTitle,
  capitalizeFirstLetter,
  matchYearPattern,
  additionalInstitutionDetailsArrayOptions,
  arrayBuilderOptions,
  yellowRibbonProgramCardDescription,
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

  describe('additionalInstitutionDetailsArrayOptions', () => {
    it('has expected base configuration', () => {
      expect(additionalInstitutionDetailsArrayOptions.arrayPath).to.equal(
        'additionalInstitutionDetails',
      );
      expect(additionalInstitutionDetailsArrayOptions.nounSingular).to.equal(
        'location',
      );
      expect(additionalInstitutionDetailsArrayOptions.nounPlural).to.equal(
        'locations',
      );
      expect(additionalInstitutionDetailsArrayOptions.required).to.equal(false);
      expect(additionalInstitutionDetailsArrayOptions.maxItems).to.equal(10);
    });

    describe('isItemIncomplete', () => {
      it('returns true when facilityCode is missing', () => {
        expect(additionalInstitutionDetailsArrayOptions.isItemIncomplete({})).to
          .be.true;
        expect(
          additionalInstitutionDetailsArrayOptions.isItemIncomplete({
            facilityCode: '',
          }),
        ).to.be.true;
        expect(additionalInstitutionDetailsArrayOptions.isItemIncomplete(null))
          .to.be.true;
      });

      it('returns false when facilityCode is present', () => {
        expect(
          additionalInstitutionDetailsArrayOptions.isItemIncomplete({
            facilityCode: '12345678',
          }),
        ).to.be.false;
      });
    });

    describe('text.summaryTitle', () => {
      it('returns plural title when count is > 1', () => {
        const props = {
          formData: {
            additionalInstitutionDetails: [
              { facilityCode: '12345678' },
              { facilityCode: '87654321' },
            ],
          },
        };

        expect(
          additionalInstitutionDetailsArrayOptions.text.summaryTitle(props),
        ).to.equal('Review your additional locations ');
      });
    });

    describe('text.summaryDescriptionWithoutItems', () => {
      it('renders ADD copy when agreementType is not withdraw', () => {
        const props = {
          formData: {
            agreementType: 'addToYellowRibbonProgram',
          },
        };

        const node = additionalInstitutionDetailsArrayOptions.text.summaryDescriptionWithoutItems(
          props,
        );
        const html = renderToStaticMarkup(node);

        expect(html).to.include('You can add more locations to this agreement');
        expect(html).to.include(
          'If you have any more campuses or additional locations to add to this agreement',
        );
        expect(html).to.include(
          'You will need a facility code for each location you would like to add.',
        );
      });

      it('renders WITHDRAW copy when agreementType is withdraw', () => {
        const props = {
          formData: {
            agreementType: 'withdrawFromYellowRibbonProgram',
          },
        };

        const node = additionalInstitutionDetailsArrayOptions.text.summaryDescriptionWithoutItems(
          props,
        );
        const html = renderToStaticMarkup(node);

        expect(html).to.include(
          'You can withdraw more locations from this agreement',
        );
        expect(html).to.include(
          'If you have any more campuses or additional locations to withdraw from this agreement',
        );
        expect(html).to.include(
          'You will need a facility code for each location you would like to withdraw.',
        );
      });

      it('defaults to ADD copy when agreementType is missing', () => {
        const node = additionalInstitutionDetailsArrayOptions.text.summaryDescriptionWithoutItems(
          { formData: {} },
        );
        const html = renderToStaticMarkup(node);

        expect(html).to.include('You can add more locations to this agreement');
      });
    });
  });
  describe('createBannerMessage', () => {
    describe('for main institution (isArrayItem = false)', () => {
      it('returns null when institution is not found', () => {
        const details = {
          facilityCode: '12345678',
          institutionName: 'not found',
        };
        const result = createBannerMessage(details);
        expect(result).to.be.null;
      });

      it('returns message when facility code has X in third position', () => {
        const details = {
          facilityCode: '12X45678',
          yrEligible: false,
        };
        const result = createBannerMessage(details);
        expect(result).to.equal(
          "This facility code can't be accepted. Check your WEAMS 22-1998 Report or contact your ELR for a list of eligible codes.",
        );
      });

      it('returns null when facility code does not have X in third position', () => {
        const details = {
          facilityCode: '12345678',
          yrEligible: true,
        };
        const result = createBannerMessage(details);
        expect(result).to.be.null;
      });

      it('returns null when institution is YR eligible', () => {
        const details = {
          facilityCode: '12345678',
          yrEligible: true,
        };
        const result = createBannerMessage(details);
        expect(result).to.be.null;
      });

      it('returns null when institution is not YR eligible', () => {
        const details = {
          facilityCode: '12345678',
          yrEligible: false,
        };
        const result = createBannerMessage(details);
        expect(result).to.be.null;
      });
    });

    describe('for additional institution (isArrayItem = true)', () => {
      it('returns message for X in third position', () => {
        const details = {
          facilityCode: '12X45678',
          yrEligible: true,
        };
        const result = createBannerMessage(details);
        expect(result).to.equal(
          "This facility code can't be accepted. Check your WEAMS 22-1998 Report or contact your ELR for a list of eligible codes.",
        );
      });

      it('returns null when code does not have X in third position', () => {
        const details = {
          facilityCode: '99999999',
          yrEligible: true,
        };
        const result = createBannerMessage(details);
        expect(result).to.be.null;
      });

      it('returns null when code is in branches', () => {
        const details = {
          facilityCode: '11111111',
          yrEligible: true,
        };
        const result = createBannerMessage(details);
        expect(result).to.be.null;
      });

      it('returns null when code is in extensions', () => {
        const details = {
          facilityCode: '33333333',
          yrEligible: true,
        };
        const result = createBannerMessage(details);
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
              isLoading: false,
            },
          ],
        };

        facilityCodeUIValidation(errors, 'ZZZZ9999', formData);
        expect(errors.message).to.equal(
          "The institution isn't eligible for the Yellow Ribbon Program.",
        );
      });

      it('prioritizes YR eligibility validation', () => {
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

  describe('showAdditionalPointsOfContact', () => {
    const baseFormData = {
      pointsOfContact: {
        roles: {
          isYellowRibbonProgramPointOfContact: false,
          isSchoolFinancialRepresentative: false,
          isSchoolCertifyingOfficial: false,
        },
      },
    };

    it('returns false when Yellow Ribbon POC and School Certifying Official are both true', () => {
      const formData = {
        pointsOfContact: {
          roles: {
            ...baseFormData.pointsOfContact.roles,
            isYellowRibbonProgramPointOfContact: true,
            isSchoolCertifyingOfficial: true,
          },
        },
      };

      expect(showAdditionalPointsOfContact(formData)).to.be.false;
    });

    it('returns false when School Financial Representative and School Certifying Official are both true', () => {
      const formData = {
        pointsOfContact: {
          roles: {
            ...baseFormData.pointsOfContact.roles,
            isSchoolFinancialRepresentative: true,
            isSchoolCertifyingOfficial: true,
          },
        },
      };

      expect(showAdditionalPointsOfContact(formData)).to.be.false;
    });

    it('returns true when School Certifying Official is false', () => {
      const formData = {
        pointsOfContact: {
          roles: {
            ...baseFormData.pointsOfContact.roles,
            isYellowRibbonProgramPointOfContact: true,
            isSchoolCertifyingOfficial: false,
          },
        },
      };

      expect(showAdditionalPointsOfContact(formData)).to.be.true;
    });

    it('returns true when Yellow Ribbon and Financial roles are false but School Certifying Official is true', () => {
      const formData = {
        pointsOfContact: {
          roles: {
            ...baseFormData.pointsOfContact.roles,
            isSchoolCertifyingOfficial: true,
          },
        },
      };

      expect(showAdditionalPointsOfContact(formData)).to.be.true;
    });

    it('returns true when no role data is provided', () => {
      expect(showAdditionalPointsOfContact({})).to.be.true;
      expect(showAdditionalPointsOfContact()).to.be.true;
    });
  });

  describe('getAdditionalContactTitle', () => {
    it('returns Yellow Ribbon title when both Yellow Ribbon and Financial roles are false', () => {
      const formData = {
        pointsOfContact: {
          roles: {
            isYellowRibbonProgramPointOfContact: false,
            isSchoolFinancialRepresentative: false,
          },
        },
      };

      expect(getAdditionalContactTitle(formData)).to.equal(
        'Add Yellow Ribbon Program point of contact',
      );
    });

    it('returns school certifying official title when either role is true', () => {
      const yellowRibbonFormData = {
        pointsOfContact: {
          roles: {
            isYellowRibbonProgramPointOfContact: true,
            isSchoolFinancialRepresentative: false,
          },
        },
      };
      const financialRepFormData = {
        pointsOfContact: {
          roles: {
            isYellowRibbonProgramPointOfContact: false,
            isSchoolFinancialRepresentative: true,
          },
        },
      };

      expect(getAdditionalContactTitle(yellowRibbonFormData)).to.equal(
        'Add school certifying official',
      );
      expect(getAdditionalContactTitle(financialRepFormData)).to.equal(
        'Add school certifying official',
      );
    });
  });

  describe('capitalizeFirstLetter', () => {
    it('returns empty string when str is null', () => {
      expect(capitalizeFirstLetter(null)).to.equal('');
    });

    it('returns empty string when str is undefined', () => {
      expect(capitalizeFirstLetter(undefined)).to.equal('');
    });

    it('returns empty string when str is empty string', () => {
      expect(capitalizeFirstLetter('')).to.equal('');
    });

    it('capitalizes first letter of lowercase string', () => {
      expect(capitalizeFirstLetter('president')).to.equal('President');
      expect(capitalizeFirstLetter('chief administrative officer')).to.equal(
        'Chief administrative officer',
      );
    });

    it('handles already capitalized strings', () => {
      expect(capitalizeFirstLetter('President')).to.equal('President');
    });

    it('handles single character strings', () => {
      expect(capitalizeFirstLetter('a')).to.equal('A');
      expect(capitalizeFirstLetter('A')).to.equal('A');
    });

    it('handles all uppercase strings', () => {
      expect(capitalizeFirstLetter('PRESIDENT')).to.equal('PRESIDENT');
    });
  });

  describe('matchYearPattern', () => {
    it('returns true for valid year pattern with four-digit years', () => {
      expect(matchYearPattern('2024-2025')).to.be.true;
      expect(matchYearPattern('2023-2024')).to.be.true;
      expect(matchYearPattern('1999-2000')).to.be.true;
    });

    it('returns false when end year is not one year after start year', () => {
      expect(matchYearPattern('2025-2024')).to.be.false;
      expect(matchYearPattern('2025-2027')).to.be.false;
    });

    it('returns false for patterns with wrong number of digits', () => {
      expect(matchYearPattern('24-25')).to.be.false;
      expect(matchYearPattern('2024-25')).to.be.false;
      expect(matchYearPattern('24-2025')).to.be.false;
      expect(matchYearPattern('202-2025')).to.be.false;
    });

    it('returns false for patterns with wrong separator', () => {
      expect(matchYearPattern('2024/2025')).to.be.false;
      expect(matchYearPattern('2024_2025')).to.be.false;
      expect(matchYearPattern('2024.2025')).to.be.false;
    });

    it('returns false for patterns with extra characters', () => {
      expect(matchYearPattern('2024-2025 ')).to.be.false;
      expect(matchYearPattern(' 2024-2025')).to.be.false;
      expect(matchYearPattern('a2024-2025')).to.be.false;
      expect(matchYearPattern('2024-2025b')).to.be.false;
    });

    it('returns false for empty or invalid input', () => {
      expect(matchYearPattern('')).to.be.false;
      expect(matchYearPattern('invalid')).to.be.false;
      expect(matchYearPattern('2024')).to.be.false;
    });
  });
  describe('arrayBuilderOptions', () => {
    it('has expected base configuration', () => {
      expect(arrayBuilderOptions.arrayPath).to.equal(
        'yellowRibbonProgramRequest',
      );
      expect(arrayBuilderOptions.nounSingular).to.equal('contribution');
      expect(arrayBuilderOptions.nounPlural).to.equal('contributions');
      expect(arrayBuilderOptions.required).to.equal(true);
    });

    describe('title', () => {
      it('returns expected us title', () => {
        const props = {
          formData: {
            institutionDetails: {
              isUsaSchool: true,
            },
          },
        };
        expect(arrayBuilderOptions.title(props)).to.equal(
          'U.S. Yellow Ribbon Program contributions',
        );
      });
      it('returns expected foreign title', () => {
        const props = {
          formData: {
            institutionDetails: {
              isUsaSchool: false,
            },
          },
        };
        expect(arrayBuilderOptions.title(props)).to.equal(
          'Foreign Yellow Ribbon Program contributions',
        );
      });
      it('returns expected foreign title if institution details is null', () => {
        const props = {
          formData: {},
        };
        expect(arrayBuilderOptions.title(props)).to.equal(
          'Foreign Yellow Ribbon Program contributions',
        );
      });
    });

    describe('text.summaryTitle', () => {
      it('returns us title if us school', () => {
        const props = {
          formData: {
            institutionDetails: {
              isUsaSchool: true,
            },
          },
        };

        expect(arrayBuilderOptions.text.summaryTitle(props)).to.equal(
          'Review your Yellow Ribbon Program contributions (U.S. schools)',
        );
      });
      it('returns foreign title if foreign school', () => {
        const props = {
          formData: {
            institutionDetails: {
              isUsaSchool: false,
            },
          },
        };

        expect(arrayBuilderOptions.text.summaryTitle(props)).to.equal(
          'Review your Yellow Ribbon Program contributions (foreign schools)',
        );
      });
      it('returns foreign title if null insitution details', () => {
        const props = {
          formData: {},
        };

        expect(arrayBuilderOptions.text.summaryTitle(props)).to.equal(
          'Review your Yellow Ribbon Program contributions (foreign schools)',
        );
      });
    });
    describe('text.getItemName', () => {
      it('returns expected ItemName starting new agreement', () => {
        const props = {
          academicYearDisplay: '2026-2027',
        };

        expect(arrayBuilderOptions.text.getItemName(props)).to.equal(
          '2026-2027',
        );
      });
      it('returns expected ItemName modify existing agreement', () => {
        const props = {
          academicYear: '2026-2027',
        };

        expect(arrayBuilderOptions.text.getItemName(props)).to.equal(
          '2026-2027',
        );
      });
    });
    describe('text.cardDescription', () => {
      it('returns null when item is null or undefined', () => {
        expect(arrayBuilderOptions.text.cardDescription(null)).to.equal(null);
        expect(arrayBuilderOptions.text.cardDescription(undefined)).to.equal(
          null,
        );
      });

      it('renders cardDescription', () => {
        const item = {
          degreeLevel: 'Graduate',
          collegeOrProfessionalSchool: 'Colege"',
        };
        const result = arrayBuilderOptions.text.getItemName(item);
        expect(result).to.not.be.null;
      });
    });
  });
  describe('yellowRibbonProgramCardDescription', () => {
    it('returns null when item is null or undefined', () => {
      expect(yellowRibbonProgramCardDescription(null)).to.equal(null);
      expect(yellowRibbonProgramCardDescription(undefined)).to.equal(null);
    });

    it('renders contribution', () => {
      const item = {
        maximumStudentsOption: 'specific',
        maximumStudents: 10,
        degreeLevel: 'Graduate',
        collegeOrProfessionalSchool: 'College',
      };
      const result = yellowRibbonProgramCardDescription(item);
      expect(result).to.not.be.null;
    });

    it('renders contribution unlimited', () => {
      const item = {
        maximumStudentsOption: 'unlimited',
        degreeLevel: 'Graduate',
        collegeOrProfessionalSchool: 'College',
        specificContributionAmount: 100,
      };
      const result = yellowRibbonProgramCardDescription(item);
      expect(result).to.not.be.null;
    });
  });
});
