import React from 'react';
import { expect } from 'chai';
import { render } from '@testing-library/react';

import employersPages, {
  SectionTwoIntro,
  hasValue,
  isEmployerAddressIncomplete,
  employersOptions,
} from '../../../pages/sectionTwo';

describe('21-4140 page/sectionTwo', () => {
  describe('hasValue helper function', () => {
    it('returns false for undefined values', () => {
      expect(hasValue(undefined)).to.be.false;
    });

    it('returns false for null values', () => {
      expect(hasValue(null)).to.be.false;
    });

    it('returns false for empty string', () => {
      expect(hasValue('')).to.be.false;
    });

    it('returns true for non-empty string', () => {
      expect(hasValue('test')).to.be.true;
    });

    it('returns true for number zero', () => {
      expect(hasValue(0)).to.be.true;
    });

    it('returns true for positive numbers', () => {
      expect(hasValue(42)).to.be.true;
    });

    it('returns true for boolean false', () => {
      expect(hasValue(false)).to.be.true;
    });

    it('returns true for boolean true', () => {
      expect(hasValue(true)).to.be.true;
    });

    it('returns true for objects', () => {
      expect(hasValue({})).to.be.true;
    });

    it('returns true for arrays', () => {
      expect(hasValue([])).to.be.true;
    });
  });

  describe('isEmployerAddressIncomplete helper function', () => {
    it('returns true when address is null', () => {
      expect(isEmployerAddressIncomplete(null)).to.be.true;
    });

    it('returns true when address is undefined', () => {
      expect(isEmployerAddressIncomplete(undefined)).to.be.true;
    });

    it('returns true when street is missing', () => {
      const address = {
        city: 'New York',
        state: 'NY',
        country: 'USA',
        postalCode: '10001',
      };
      expect(isEmployerAddressIncomplete(address)).to.be.true;
    });

    it('returns true when city is missing', () => {
      const address = {
        street: '123 Main St',
        state: 'NY',
        country: 'USA',
        postalCode: '10001',
      };
      expect(isEmployerAddressIncomplete(address)).to.be.true;
    });

    it('returns true when country is missing', () => {
      const address = {
        street: '123 Main St',
        city: 'New York',
        state: 'NY',
        postalCode: '10001',
      };
      expect(isEmployerAddressIncomplete(address)).to.be.true;
    });

    it('returns true when postalCode is missing', () => {
      const address = {
        street: '123 Main St',
        city: 'New York',
        state: 'NY',
        country: 'USA',
      };
      expect(isEmployerAddressIncomplete(address)).to.be.true;
    });

    it('returns true when state is missing for USA address', () => {
      const address = {
        street: '123 Main St',
        city: 'New York',
        country: 'USA',
        postalCode: '10001',
      };
      expect(isEmployerAddressIncomplete(address)).to.be.true;
    });

    it('returns true when state is missing for CAN address', () => {
      const address = {
        street: '123 Main St',
        city: 'Toronto',
        country: 'CAN',
        postalCode: 'M5H 2N2',
      };
      expect(isEmployerAddressIncomplete(address)).to.be.true;
    });

    it('returns true when state is missing for MEX address', () => {
      const address = {
        street: '123 Main St',
        city: 'Mexico City',
        country: 'MEX',
        postalCode: '01000',
      };
      expect(isEmployerAddressIncomplete(address)).to.be.true;
    });

    it('returns false for complete USA address', () => {
      const address = {
        street: '123 Main St',
        city: 'New York',
        state: 'NY',
        country: 'USA',
        postalCode: '10001',
      };
      expect(isEmployerAddressIncomplete(address)).to.be.false;
    });

    it('returns false for complete CAN address', () => {
      const address = {
        street: '123 Main St',
        city: 'Toronto',
        state: 'ON',
        country: 'CAN',
        postalCode: 'M5H 2N2',
      };
      expect(isEmployerAddressIncomplete(address)).to.be.false;
    });

    it('returns false for complete MEX address', () => {
      const address = {
        street: '123 Main St',
        city: 'Mexico City',
        state: 'CDMX',
        country: 'MEX',
        postalCode: '01000',
      };
      expect(isEmployerAddressIncomplete(address)).to.be.false;
    });

    it('returns false for complete non-USA/CAN/MEX address without state', () => {
      const address = {
        street: '123 Main St',
        city: 'London',
        country: 'GBR',
        postalCode: 'SW1A 1AA',
      };
      expect(isEmployerAddressIncomplete(address)).to.be.false;
    });

    it('returns false for complete international address with state', () => {
      const address = {
        street: '123 Main St',
        city: 'Paris',
        state: 'Île-de-France',
        country: 'FRA',
        postalCode: '75001',
      };
      expect(isEmployerAddressIncomplete(address)).to.be.false;
    });
  });

  describe('employersOptions configuration', () => {
    it('has correct arrayPath', () => {
      expect(employersOptions.arrayPath).to.equal('employers');
    });

    it('has correct noun singular', () => {
      expect(employersOptions.nounSingular).to.equal('employer');
    });

    it('has correct noun plural', () => {
      expect(employersOptions.nounPlural).to.equal('employers');
    });

    it('is marked as required', () => {
      expect(employersOptions.required).to.be.true;
    });

    it('has max items set to 4', () => {
      expect(employersOptions.maxItems).to.equal(4);
    });

    describe('isItemIncomplete function', () => {
      it('returns true when employer name is missing', () => {
        const item = {
          typeOfWork: 'Developer',
          hoursPerWeek: 40,
          datesOfEmployment: { from: '2024-01-01', to: '2024-12-01' },
          employerAddress: {
            street: '123 Main St',
            city: 'New York',
            state: 'NY',
            country: 'USA',
            postalCode: '10001',
          },
          lostTime: 0,
          highestIncome: 5000,
        };
        expect(employersOptions.isItemIncomplete(item)).to.be.true;
      });

      it('returns true when type of work is missing', () => {
        const item = {
          employerName: 'Acme Corp',
          hoursPerWeek: 40,
          datesOfEmployment: { from: '2024-01-01', to: '2024-12-01' },
          employerAddress: {
            street: '123 Main St',
            city: 'New York',
            state: 'NY',
            country: 'USA',
            postalCode: '10001',
          },
          lostTime: 0,
          highestIncome: 5000,
        };
        expect(employersOptions.isItemIncomplete(item)).to.be.true;
      });

      it('returns true when hours per week is missing', () => {
        const item = {
          employerName: 'Acme Corp',
          typeOfWork: 'Developer',
          datesOfEmployment: { from: '2024-01-01', to: '2024-12-01' },
          employerAddress: {
            street: '123 Main St',
            city: 'New York',
            state: 'NY',
            country: 'USA',
            postalCode: '10001',
          },
          lostTime: 0,
          highestIncome: 5000,
        };
        expect(employersOptions.isItemIncomplete(item)).to.be.true;
      });

      it('returns true when employment start date is missing', () => {
        const item = {
          employerName: 'Acme Corp',
          typeOfWork: 'Developer',
          hoursPerWeek: 40,
          datesOfEmployment: { to: '2024-12-01' },
          employerAddress: {
            street: '123 Main St',
            city: 'New York',
            state: 'NY',
            country: 'USA',
            postalCode: '10001',
          },
          lostTime: 0,
          highestIncome: 5000,
        };
        expect(employersOptions.isItemIncomplete(item)).to.be.true;
      });

      it('returns true when employment end date is missing', () => {
        const item = {
          employerName: 'Acme Corp',
          typeOfWork: 'Developer',
          hoursPerWeek: 40,
          datesOfEmployment: { from: '2024-01-01' },
          employerAddress: {
            street: '123 Main St',
            city: 'New York',
            state: 'NY',
            country: 'USA',
            postalCode: '10001',
          },
          lostTime: 0,
          highestIncome: 5000,
        };
        expect(employersOptions.isItemIncomplete(item)).to.be.true;
      });

      it('returns true when employer address is incomplete', () => {
        const item = {
          employerName: 'Acme Corp',
          typeOfWork: 'Developer',
          hoursPerWeek: 40,
          datesOfEmployment: { from: '2024-01-01', to: '2024-12-01' },
          employerAddress: {
            street: '123 Main St',
            city: 'New York',
            country: 'USA',
            postalCode: '10001',
          },
          lostTime: 0,
          highestIncome: 5000,
        };
        expect(employersOptions.isItemIncomplete(item)).to.be.true;
      });

      it('returns true when lost time is missing', () => {
        const item = {
          employerName: 'Acme Corp',
          typeOfWork: 'Developer',
          hoursPerWeek: 40,
          datesOfEmployment: { from: '2024-01-01', to: '2024-12-01' },
          employerAddress: {
            street: '123 Main St',
            city: 'New York',
            state: 'NY',
            country: 'USA',
            postalCode: '10001',
          },
          highestIncome: 5000,
        };
        expect(employersOptions.isItemIncomplete(item)).to.be.true;
      });

      it('returns true when highest income is missing', () => {
        const item = {
          employerName: 'Acme Corp',
          typeOfWork: 'Developer',
          hoursPerWeek: 40,
          datesOfEmployment: { from: '2024-01-01', to: '2024-12-01' },
          employerAddress: {
            street: '123 Main St',
            city: 'New York',
            state: 'NY',
            country: 'USA',
            postalCode: '10001',
          },
          lostTime: 0,
        };
        expect(employersOptions.isItemIncomplete(item)).to.be.true;
      });

      it('returns false when all required fields are present', () => {
        const item = {
          employerName: 'Acme Corp',
          typeOfWork: 'Developer',
          hoursPerWeek: 40,
          datesOfEmployment: { from: '2024-01-01', to: '2024-12-01' },
          employerAddress: {
            street: '123 Main St',
            city: 'New York',
            state: 'NY',
            country: 'USA',
            postalCode: '10001',
          },
          lostTime: 0,
          highestIncome: 5000,
        };
        expect(employersOptions.isItemIncomplete(item)).to.be.false;
      });

      it('handles zero values correctly for numeric fields', () => {
        const item = {
          employerName: 'Acme Corp',
          typeOfWork: 'Developer',
          hoursPerWeek: 0,
          datesOfEmployment: { from: '2024-01-01', to: '2024-12-01' },
          employerAddress: {
            street: '123 Main St',
            city: 'New York',
            state: 'NY',
            country: 'USA',
            postalCode: '10001',
          },
          lostTime: 0,
          highestIncome: 0,
        };
        expect(employersOptions.isItemIncomplete(item)).to.be.false;
      });
    });

    describe('text.getItemName function', () => {
      it('returns employer name when present', () => {
        const item = { employerName: 'Acme Corp' };
        expect(employersOptions.text.getItemName(item)).to.equal('Acme Corp');
      });

      it('returns undefined when employer name is missing', () => {
        const item = {};
        expect(employersOptions.text.getItemName(item)).to.be.undefined;
      });

      it('handles null item', () => {
        expect(employersOptions.text.getItemName(null)).to.be.undefined;
      });

      it('handles undefined item', () => {
        expect(employersOptions.text.getItemName(undefined)).to.be.undefined;
      });
    });

    describe('text.cardDescription function', () => {
      it('returns formatted date range when both dates are present', () => {
        const item = {
          datesOfEmployment: {
            from: '2024-01-01',
            to: '2024-12-01',
          },
        };
        expect(employersOptions.text.cardDescription(item)).to.equal(
          '2024-01-01 - 2024-12-01',
        );
      });

      it('returns default message when start date is missing', () => {
        const item = {
          datesOfEmployment: {
            to: '2024-12-01',
          },
        };
        expect(employersOptions.text.cardDescription(item)).to.equal(
          'Employment dates not provided',
        );
      });

      it('returns default message when end date is missing', () => {
        const item = {
          datesOfEmployment: {
            from: '2024-01-01',
          },
        };
        expect(employersOptions.text.cardDescription(item)).to.equal(
          'Employment dates not provided',
        );
      });

      it('returns default message when datesOfEmployment is missing', () => {
        const item = {};
        expect(employersOptions.text.cardDescription(item)).to.equal(
          'Employment dates not provided',
        );
      });

      it('returns default message when item is null', () => {
        expect(employersOptions.text.cardDescription(null)).to.equal(
          'Employment dates not provided',
        );
      });

      it('returns default message when item is undefined', () => {
        expect(employersOptions.text.cardDescription(undefined)).to.equal(
          'Employment dates not provided',
        );
      });
    });
  });
  describe('SectionTwoIntro component', () => {
    it('renders the section title', () => {
      const mockProps = {
        goBack: () => {},
        goForward: () => {},
        NavButtons: ({ goBack, goForward, submitToContinue }) => (
          <div>
            <button onClick={goBack}>Back</button>
            <button onClick={goForward}>
              {submitToContinue ? 'Continue' : 'Next'}
            </button>
          </div>
        ),
      };

      const { getByText } = render(<SectionTwoIntro {...mockProps} />);
      expect(getByText('Section II: Employment Certification')).to.exist;
    });

    it('renders the employment summary box', () => {
      const mockProps = {
        goBack: () => {},
        goForward: () => {},
        NavButtons: ({ goBack, goForward }) => (
          <div>
            <button onClick={goBack}>Back</button>
            <button onClick={goForward}>Continue</button>
          </div>
        ),
      };

      const { getByText } = render(<SectionTwoIntro {...mockProps} />);
      expect(getByText('What to expect')).to.exist;
      expect(
        getByText(
          'Provide details about your employment in the past 12 months',
        ),
      ).to.exist;
    });
  });

  describe('employerDetailsPage schema', () => {
    const employerDetails = employersPages.employerDetails;

    it('requires all employer fields', () => {
      const itemSchema = employerDetails.schema.properties.employers.items;
      expect(itemSchema.required).to.deep.equal([
        'employerName',
        'employerAddress',
        'datesOfEmployment',
        'typeOfWork',
        'highestIncome',
        'hoursPerWeek',
        'lostTime',
      ]);
    });

    it('includes employer name field in the schema', () => {
      const itemSchema = employerDetails.schema.properties.employers.items;
      expect(itemSchema.properties.employerName).to.exist;
    });

    it('includes employer address field in the schema', () => {
      const itemSchema = employerDetails.schema.properties.employers.items;
      const addressSchema = itemSchema.properties.employerAddress;
      expect(addressSchema).to.exist;
      expect(addressSchema.properties).to.include.keys([
        'street',
        'city',
        'state',
        'postalCode',
        'country',
      ]);
    });

    it('includes dates of employment field in the schema', () => {
      const itemSchema = employerDetails.schema.properties.employers.items;
      expect(itemSchema.properties.datesOfEmployment).to.exist;
    });

    it('includes type of work field in the schema', () => {
      const itemSchema = employerDetails.schema.properties.employers.items;
      expect(itemSchema.properties.typeOfWork).to.exist;
    });

    it('includes highest income field in the schema', () => {
      const itemSchema = employerDetails.schema.properties.employers.items;
      expect(itemSchema.properties.highestIncome).to.exist;
    });

    it('includes hours per week field in the schema', () => {
      const itemSchema = employerDetails.schema.properties.employers.items;
      expect(itemSchema.properties.hoursPerWeek).to.exist;
    });

    it('includes lost time field in the schema', () => {
      const itemSchema = employerDetails.schema.properties.employers.items;
      expect(itemSchema.properties.lostTime).to.exist;
    });
  });

  describe('employerDetailsPage UI schema', () => {
    const employerDetails = employersPages.employerDetails;

    it('provides custom error message for employer name required field', () => {
      const itemUiSchema = employerDetails.uiSchema.employers.items;
      const employerNameUi = itemUiSchema.employerName;

      expect(employerNameUi['ui:errorMessages']?.required).to.equal(
        'Enter the employer name. This field is required.',
      );
    });

    it('configures employer address fields', () => {
      const itemUiSchema = employerDetails.uiSchema.employers.items;
      const addressUi = itemUiSchema.employerAddress;

      expect(addressUi.street).to.exist;
      expect(addressUi.city).to.exist;
      expect(addressUi.state).to.exist;
      expect(addressUi.postalCode).to.exist;
    });

    it('provides a hint for type of work field', () => {
      const itemUiSchema = employerDetails.uiSchema.employers.items;
      const typeOfWorkUi = itemUiSchema.typeOfWork;

      expect(typeOfWorkUi['ui:options']?.hint).to.equal(
        'If self-employed enter "Self"',
      );
    });

    it('provides custom error messages for type of work', () => {
      const itemUiSchema = employerDetails.uiSchema.employers.items;
      const typeOfWorkUi = itemUiSchema.typeOfWork;

      expect(typeOfWorkUi['ui:errorMessages']?.required).to.equal(
        'Enter type of work for this employer, self-employment, or military duties. This field is required.',
      );
    });

    it('provides custom error messages for highest income', () => {
      const itemUiSchema = employerDetails.uiSchema.employers.items;
      const highestIncomeUi = itemUiSchema.highestIncome;

      expect(highestIncomeUi['ui:errorMessages']?.required).to.equal(
        'Enter your monthly gross income. Round to the nearest whole number. This field is required.',
      );
      expect(highestIncomeUi['ui:errorMessages']?.pattern).to.equal(
        'Enter your monthly gross income using numbers only.',
      );
    });

    it('provides custom error messages for hours per week', () => {
      const itemUiSchema = employerDetails.uiSchema.employers.items;
      const hoursPerWeekUi = itemUiSchema.hoursPerWeek;

      expect(hoursPerWeekUi['ui:errorMessages']?.required).to.equal(
        'Enter the number of hours worked per week. This field is required.',
      );
      expect(hoursPerWeekUi['ui:errorMessages']?.pattern).to.equal(
        'Enter the hours worked per week using numbers only.',
      );
    });

    it('provides custom error messages for lost time', () => {
      const itemUiSchema = employerDetails.uiSchema.employers.items;
      const lostTimeUi = itemUiSchema.lostTime;

      expect(lostTimeUi['ui:errorMessages']?.required).to.equal(
        'Enter the number of days missed per month because of illness. This field is required.',
      );
      expect(lostTimeUi['ui:errorMessages']?.pattern).to.equal(
        'Enter the number of days missed per month using numbers only.',
      );
    });

    it('sets minimum value of 0 for numeric fields', () => {
      const itemUiSchema = employerDetails.uiSchema.employers.items;
      expect(itemUiSchema.highestIncome['ui:validations']).to.exist;
      expect(itemUiSchema.hoursPerWeek['ui:validations']).to.exist;
      expect(itemUiSchema.lostTime['ui:validations']).to.exist;
    });
  });

  describe('summaryPage schema', () => {
    const summary = employersPages.employersSummary;

    it('requires the hasEmployers view field', () => {
      expect(summary.schema.required).to.deep.equal(['view:hasEmployers']);
    });

    it('includes the hasEmployers view field in the schema', () => {
      expect(summary.schema.properties['view:hasEmployers']).to.exist;
    });
  });

  describe('summaryPage UI schema', () => {
    const summary = employersPages.employersSummary;

    it('provides the hasEmployers field in UI schema', () => {
      expect(summary.uiSchema['view:hasEmployers']).to.exist;
    });

    it('contains array builder yes/no UI configuration', () => {
      const hasEmployersUi = summary.uiSchema['view:hasEmployers'];
      expect(hasEmployersUi['ui:widget']).to.equal('yesNo');
    });
  });

  describe('array builder pages structure', () => {
    it('contains intro page', () => {
      expect(employersPages.employersIntro).to.exist;
      expect(employersPages.employersIntro.path).to.equal('section-two');
    });

    it('contains summary page', () => {
      expect(employersPages.employersSummary).to.exist;
      expect(employersPages.employersSummary.path).to.equal(
        'section-2-summary',
      );
    });

    it('contains employer details page', () => {
      expect(employersPages.employerDetails).to.exist;
      expect(employersPages.employerDetails.path).to.equal(
        'section-2/:index/basic-info',
      );
    });

    it('intro page uses custom component', () => {
      expect(employersPages.employersIntro.CustomPage).to.equal(
        SectionTwoIntro,
      );
    });

    it('intro page has null custom review', () => {
      expect(employersPages.employersIntro.CustomPageReview).to.be.null;
    });
  });

  describe('field ordering', () => {
    const employerDetails = employersPages.employerDetails;

    it('defines ui:order for employer details fields', () => {
      const itemUiSchema = employerDetails.uiSchema.employers.items;
      expect(itemUiSchema['ui:order']).to.deep.equal([
        'employerName',
        'employerAddress',
        'datesOfEmployment',
        'typeOfWork',
        'highestIncome',
        'hoursPerWeek',
        'lostTime',
      ]);
    });
  });

  describe('employer address configuration', () => {
    const employerDetails = employersPages.employerDetails;

    it('omits street2, street3, and isMilitary from address', () => {
      const itemSchema = employerDetails.schema.properties.employers.items;
      const addressSchema = itemSchema.properties.employerAddress;
      expect(addressSchema.properties.street2).to.be.undefined;
      expect(addressSchema.properties.street3).to.be.undefined;
      expect(addressSchema.properties.isMilitary).to.be.undefined;
    });

    it('provides custom label for street address', () => {
      const itemUiSchema = employerDetails.uiSchema.employers.items;
      const addressUi = itemUiSchema.employerAddress;
      expect(addressUi.street['ui:title']).to.equal('Employer street address');
    });

    it('provides custom label for postal code', () => {
      const itemUiSchema = employerDetails.uiSchema.employers.items;
      const addressUi = itemUiSchema.employerAddress;
      expect(addressUi.postalCode['ui:title']).to.equal('Zip/Postal Code');
    });
  });
});
