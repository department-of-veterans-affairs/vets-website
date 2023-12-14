import {
  testNumberOfErrorsOnSubmitForWebComponents,
  testNumberOfErrorsOnSubmit,
  testNumberOfWebComponentFields,
  testNumberOfFields,
} from '../pageTests.spec';
import formConfig from '../../../config/form';
import incomeSources from '../../../config/chapters/05-financial-information/incomeSources';

const { schema, uiSchema } = incomeSources;

describe('Pension: Financial information, income sources page', () => {
  describe('with one source', () => {
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

    const expectedNumberOfErrors = 3;
    testNumberOfErrorsOnSubmitForWebComponents(
      formConfig,
      schema,
      uiSchema,
      expectedNumberOfErrors,
      pageTitle,
      data,
    );

    const expectedNumberOfWebComponentErrors = 1;
    testNumberOfErrorsOnSubmit(
      formConfig,
      schema,
      uiSchema,
      expectedNumberOfWebComponentErrors,
      pageTitle,
      data,
    );
  });
  describe('with mmultiple sources', () => {
    const pageTitle = 'Gross monthly income';
    const expectedNumberOfWebComponentFields = 3;
    const data = {
      incomeSources: [
        {
          typeOfIncome: 'Social Security',
          receiver: 'Jane Doe',
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

    const expectedNumberOfErrors = 3;
    testNumberOfErrorsOnSubmitForWebComponents(
      formConfig,
      schema,
      uiSchema,
      expectedNumberOfErrors,
      pageTitle,
      data,
    );

    const expectedNumberOfWebComponentErrors = 1;
    testNumberOfErrorsOnSubmit(
      formConfig,
      schema,
      uiSchema,
      expectedNumberOfWebComponentErrors,
      pageTitle,
      data,
    );
  });
});
