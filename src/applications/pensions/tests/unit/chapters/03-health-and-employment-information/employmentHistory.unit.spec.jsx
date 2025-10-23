import React from 'react';
import { expect } from 'chai';
import { render } from '@testing-library/react';
import { DefinitionTester } from '@department-of-veterans-affairs/platform-testing/schemaform-utils';
import {
  FakeProvider,
  testComponentFieldsMarkedAsRequired,
  testNumberOfFieldsByType,
  testNumberOfWebComponentFields,
  testSubmitsWithoutErrors,
} from '../pageTests.spec';
import formConfig from '../../../../config/form';
import {
  generateEmployersSchemas,
  EmployerView,
} from '../../../../config/chapters/03-health-and-employment-information/helpers';

const { schema, uiSchema } = generateEmployersSchemas({
  showJobTitleField: true,
  jobTypeFieldLabel: 'What kind of work did you do?',
  jobHoursWeekFieldLabel: 'How many hours per week did you work on average?',
  jobTitleFieldLabel: 'What was your job title?',
});

describe('pensions employment history', () => {
  const pageTitle = 'employment history';
  const expectedNumberOfFields = 3;
  testNumberOfWebComponentFields(
    formConfig,
    schema,
    uiSchema,
    expectedNumberOfFields,
    pageTitle,
  );

  testComponentFieldsMarkedAsRequired(
    formConfig,
    schema,
    uiSchema,
    [
      `va-text-input[label="What kind of work did you do?"]`,
      `va-text-input[label="How many hours per week did you work on average?"]`,
      `va-text-input[label="What was your job title?"]`,
    ],
    pageTitle,
  );

  testSubmitsWithoutErrors(formConfig, schema, uiSchema, pageTitle, {
    currentEmployment: false,
    employers: [
      {
        jobTitle: 'Cashier',
        jobType: 'Customer service',
        jobHoursWeek: '20',
      },
      {
        jobTitle: 'Customer Service Representative',
        jobType: 'Customer service',
        jobHoursWeek: '20',
      },
    ],
  });

  testNumberOfFieldsByType(
    formConfig,
    schema,
    uiSchema,
    {
      'va-text-input': 3,
    },
    pageTitle,
  );

  it('should set the aria-label to the jobTitle or jobType', () => {
    const { container } = render(
      <FakeProvider>
        <DefinitionTester
          definitions={formConfig.defaultDefinitions}
          schema={schema}
          uiSchema={uiSchema}
          data={{
            currentEmployment: false,
            employers: [
              {
                jobTitle: 'Cashier',
                jobType: 'Customer service',
                jobHoursWeek: '20',
              },
              {
                jobTitle: 'Customer Service Representative',
                jobType: 'Customer service',
                jobHoursWeek: '20',
              },
            ],
          }}
        />
      </FakeProvider>,
    );

    const editButtons = container.querySelectorAll('va-button');
    expect(editButtons.length).to.eq(2);

    // Label on these VaButton elements becomes the aria label:
    expect(editButtons[0].label).to.contain('Edit Cashier');
    expect(editButtons[1].label).to.contain(
      'Edit Customer Service Representative',
    );
  });

  describe('EmployerView', () => {
    it('should render a list view', () => {
      const { container } = render(
        <FakeProvider>
          <EmployerView formData={{ jobTitle: 'Contractor' }} />
        </FakeProvider>,
      );
      const text = container.querySelector('h3');
      expect(text.innerHTML).to.equal('Contractor');
    });
    it('should render a list view with a jobType', () => {
      const { container } = render(
        <FakeProvider>
          <EmployerView formData={{ jobType: 'Construction' }} />
        </FakeProvider>,
      );
      const text = container.querySelector('h3');
      expect(text.innerHTML).to.equal('Construction');
    });
  });
});
