import React from 'react';
import { expect } from 'chai';
import { render } from '@testing-library/react';

import employersPages, { SectionTwoIntro } from '../../../pages/sectionTwo';

describe('21-4140 page/sectionTwo', () => {
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
