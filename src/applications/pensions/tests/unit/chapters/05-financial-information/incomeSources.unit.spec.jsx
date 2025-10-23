import React from 'react';
import { $$ } from '@department-of-veterans-affairs/platform-forms-system/ui';
import { render } from '@testing-library/react';
import { expect } from 'chai';

import { DefinitionTester } from '@department-of-veterans-affairs/platform-testing/schemaform-utils';
import {
  testComponentFieldsMarkedAsRequired,
  testNumberOfErrorsOnSubmit,
  testNumberOfWebComponentFields,
  testNumberOfFields,
  testSubmitsWithoutErrors,
  testNumberOfFieldsByType,
  FakeProvider,
} from '../pageTests.spec';
import formConfig from '../../../../config/form';
import incomeSources from '../../../../config/chapters/05-financial-information/incomeSources';

const { schema, uiSchema } = incomeSources;

describe('Pension: Financial information, income sources page', () => {
  const pageTitle = 'Gross monthly income';
  describe('should not require type of income additional field', () => {
    const expectedNumberOfWebComponentFields = 4;
    const data = { incomeSources: [{}] };
    testNumberOfWebComponentFields(
      formConfig,
      schema,
      uiSchema,
      expectedNumberOfWebComponentFields,
      pageTitle,
      data,
    );

    const expectedNumberOfFields = 0;
    testNumberOfFields(
      formConfig,
      schema,
      uiSchema,
      expectedNumberOfFields,
      pageTitle,
      data,
    );

    const expectedNumberOfErrors = 0;
    testNumberOfErrorsOnSubmit(
      formConfig,
      schema,
      uiSchema,
      expectedNumberOfErrors,
      pageTitle,
      data,
    );

    testComponentFieldsMarkedAsRequired(
      formConfig,
      schema,
      uiSchema,
      [
        `va-radio[label="What type of income?"]`,
        `va-radio[label="Who receives this income?"]`,
        `va-text-input[label="Who pays this income?"]`,
        `va-text-input[label="What’s the monthly amount of income?"]`,
      ],
      pageTitle,
      data,
    );
  });
  describe('should include a type of income additional field', async () => {
    const expectedNumberOfWebComponentFields = 5;
    const data = {
      incomeSources: [
        {
          typeOfIncome: 'OTHER',
        },
      ],
    };
    testNumberOfWebComponentFields(
      formConfig,
      schema,
      uiSchema,
      expectedNumberOfWebComponentFields,
      pageTitle,
      data,
    );

    const expectedNumberOfFields = 0;
    testNumberOfFields(
      formConfig,
      schema,
      uiSchema,
      expectedNumberOfFields,
      pageTitle,
      data,
    );
  });
  describe('with multiple sources', () => {
    const expectedNumberOfWebComponentFields = 4;
    const data = {
      incomeSources: [
        {
          typeOfIncome: 'SOCIAL_SECURITY',
          receiver: 'VETERAN',
          payer: 'John Doe',
          amount: 2.0,
        },
        {},
      ],
    };
    testNumberOfWebComponentFields(
      formConfig,
      schema,
      uiSchema,
      expectedNumberOfWebComponentFields,
      pageTitle,
      data,
    );

    const expectedNumberOfFields = 0;
    testNumberOfFields(
      formConfig,
      schema,
      uiSchema,
      expectedNumberOfFields,
      pageTitle,
      data,
    );
    const expectedNumberOfErrors = 0;
    testNumberOfErrorsOnSubmit(
      formConfig,
      schema,
      uiSchema,
      expectedNumberOfErrors,
      pageTitle,
      data,
    );

    testComponentFieldsMarkedAsRequired(
      formConfig,
      schema,
      uiSchema,
      [
        `va-radio[label="What type of income?"]`,
        `va-radio[label="Who receives this income?"]`,
        `va-text-input[label="Who pays this income?"]`,
        `va-text-input[label="What’s the monthly amount of income?"]`,
      ],
      pageTitle,
      data,
    );
  });

  testSubmitsWithoutErrors(formConfig, schema, uiSchema, pageTitle);

  testNumberOfFieldsByType(
    formConfig,
    schema,
    uiSchema,
    {
      'va-radio': 2,
      'va-text-input': 2,
    },
    pageTitle,
  );

  it('shows additional info instead of alert', () => {
    const data = { incomeSources: [{}] };
    const { container } = render(
      <FakeProvider>
        <DefinitionTester
          schema={schema}
          data={data}
          definitions={formConfig.defaultDefinitions}
          uiSchema={uiSchema}
        />
      </FakeProvider>,
    );

    expect($$('va-alert', container).length).to.equal(0);
    expect($$('va-additional-info', container).length).to.equal(1);
  });
});
