import {
  testNumberOfErrorsOnSubmit,
  testNumberOfFields,
} from 'platform/forms-system/test/pageTestHelpers.spec';
import formConfig from '../../../config/form';
import {
  dependentSchema,
  dependentUISchema,
} from '../../../definitions/dependent';

describe('hca Dependent config', () => {
  context('Basic Information config', () => {
    const { basic: schema } = dependentSchema;
    const { basic: uiSchema } = dependentUISchema;
    const pageTitle = 'Dependent\u2019s Basic Information';

    // run test for correct number of fields on the page
    const expectedNumberOfFields = 12;
    testNumberOfFields(
      formConfig,
      schema,
      uiSchema,
      expectedNumberOfFields,
      pageTitle,
    );

    // run test for correct number of error messages on submit
    const expectedNumberOfErrors = 6;
    testNumberOfErrorsOnSubmit(
      formConfig,
      schema,
      uiSchema,
      expectedNumberOfErrors,
      pageTitle,
    );
  });

  context('Educational Expenses config', () => {
    const { education: schema } = dependentSchema;
    const { education: uiSchema } = dependentUISchema;
    const pageTitle = 'Dependent\u2019s Educational Expenses';

    // run test for correct number of fields on the page
    const expectedNumberOfFields = 3;
    testNumberOfFields(
      formConfig,
      schema,
      uiSchema,
      expectedNumberOfFields,
      pageTitle,
    );

    // run test for correct number of error messages on submit
    const expectedNumberOfErrors = 1;
    testNumberOfErrorsOnSubmit(
      formConfig,
      schema,
      uiSchema,
      expectedNumberOfErrors,
      pageTitle,
    );
  });

  context('Additional Information config', () => {
    const { additional: schema } = dependentSchema;
    const { additional: uiSchema } = dependentUISchema;
    const pageTitle = 'Dependent\u2019s Additional Information';

    // run test for correct number of fields on the page
    const expectedNumberOfFields = 6;
    testNumberOfFields(
      formConfig,
      schema,
      uiSchema,
      expectedNumberOfFields,
      pageTitle,
    );

    // run test for correct number of error messages on submit
    const expectedNumberOfErrors = 3;
    testNumberOfErrorsOnSubmit(
      formConfig,
      schema,
      uiSchema,
      expectedNumberOfErrors,
      pageTitle,
    );
  });

  context('Financial Support config', () => {
    const { support: schema } = dependentSchema;
    const { support: uiSchema } = dependentUISchema;
    const pageTitle = 'Dependent\u2019s Financial Support';

    // run test for correct number of fields on the page
    const expectedNumberOfFields = 2;
    testNumberOfFields(
      formConfig,
      schema,
      uiSchema,
      expectedNumberOfFields,
      pageTitle,
    );

    // run test for correct number of error messages on submit
    const expectedNumberOfErrors = 0;
    testNumberOfErrorsOnSubmit(
      formConfig,
      schema,
      uiSchema,
      expectedNumberOfErrors,
      pageTitle,
    );
  });

  context('Annual Income config', () => {
    const { income: schema } = dependentSchema;
    const { income: uiSchema } = dependentUISchema;
    const pageTitle = 'Dependent\u2019s Annual Income';

    // run test for correct number of fields on the page
    const expectedNumberOfFields = 3;
    testNumberOfFields(
      formConfig,
      schema,
      uiSchema,
      expectedNumberOfFields,
      pageTitle,
    );

    // run test for correct number of error messages on submit
    const expectedNumberOfErrors = 3;
    testNumberOfErrorsOnSubmit(
      formConfig,
      schema,
      uiSchema,
      expectedNumberOfErrors,
      pageTitle,
    );
  });
});
