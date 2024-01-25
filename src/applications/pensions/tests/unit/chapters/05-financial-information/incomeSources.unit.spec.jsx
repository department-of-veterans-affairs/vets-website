import {
  testNumberOfErrorsOnSubmitForWebComponents,
  testNumberOfErrorsOnSubmit,
  testNumberOfWebComponentFields,
  testNumberOfFields,
} from '../pageTests.spec';
import formConfig from '../../../../config/form';
import incomeSources from '../../../../config/chapters/05-financial-information/incomeSources';

const { schema, uiSchema } = incomeSources;

describe('Pension: Financial information, income sources page', () => {
  describe('should not require type of income additional field', () => {
    const pageTitle = 'Gross monthly income';
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
    const pageTitle = 'Gross monthly income';
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
    const pageTitle = 'Gross monthly income';
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
});
