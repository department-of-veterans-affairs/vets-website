import React from 'react';
import { $$ } from '@department-of-veterans-affairs/platform-forms-system/ui';
import { render } from '@testing-library/react';
import { expect } from 'chai';

import { DefinitionTester } from '@department-of-veterans-affairs/platform-testing/schemaform-utils';
import {
  testNumberOfErrorsOnSubmitForWebComponents,
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
    const expectedNumberOfWebComponentFields = 3;
    const data = { incomeSources: [{}] };
    testNumberOfWebComponentFields(
      formConfig,
      schema,
      uiSchema,
      expectedNumberOfWebComponentFields,
      pageTitle,
      data,
    );

    const expectedNumberOfFields = 1;
    testNumberOfFields(
      formConfig,
      schema,
      uiSchema,
      expectedNumberOfFields,
      pageTitle,
      data,
    );

    const expectedNumberOfErrors = 1;
    testNumberOfErrorsOnSubmit(
      formConfig,
      schema,
      uiSchema,
      expectedNumberOfErrors,
      pageTitle,
      data,
    );

    const expectedNumberOfWebComponentErrors = 3;
    testNumberOfErrorsOnSubmitForWebComponents(
      formConfig,
      schema,
      uiSchema,
      expectedNumberOfWebComponentErrors,
      pageTitle,
      data,
    );
  });
  describe('should include a type of income additional field', async () => {
    const expectedNumberOfWebComponentFields = 4;
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

    const expectedNumberOfFields = 1;
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
    const expectedNumberOfWebComponentFields = 3;
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

    const expectedNumberOfFields = 1;
    testNumberOfFields(
      formConfig,
      schema,
      uiSchema,
      expectedNumberOfFields,
      pageTitle,
      data,
    );

    const expectedNumberOfErrors = 1;
    testNumberOfErrorsOnSubmit(
      formConfig,
      schema,
      uiSchema,
      expectedNumberOfErrors,
      pageTitle,
      data,
    );

    const expectedNumberOfWebComponentErrors = 3;
    testNumberOfErrorsOnSubmitForWebComponents(
      formConfig,
      schema,
      uiSchema,
      expectedNumberOfWebComponentErrors,
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
      'va-text-input': 1,
      input: 1,
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
