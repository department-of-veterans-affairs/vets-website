import { $ } from '@department-of-veterans-affairs/platform-forms-system/ui';
import { expect } from 'chai';
import {
  testNumberOfErrorsOnSubmitForWebComponents,
  testNumberOfFieldsByType,
  testNumberOfWebComponentFields,
  testShowAlert,
  testSubmitsWithoutErrors,
} from '../pageTests.spec';
import formConfig from '../../../../config/form';
import totalNetWorth from '../../../../config/chapters/05-financial-information/totalNetWorth';
import { fillRadio } from '../../testHelpers/webComponents';

const { schema, uiSchema } = totalNetWorth;

describe('Financial information total net worth pension page', () => {
  const pageTitle = 'total net worth';
  const expectedNumberOfFields = 1;
  testNumberOfWebComponentFields(
    formConfig,
    schema,
    uiSchema,
    expectedNumberOfFields,
    pageTitle,
  );

  const expectedNumberOfErrors = 1;
  testNumberOfErrorsOnSubmitForWebComponents(
    formConfig,
    schema,
    uiSchema,
    expectedNumberOfErrors,
    pageTitle,
  );

  testSubmitsWithoutErrors(formConfig, schema, uiSchema, pageTitle);

  testNumberOfFieldsByType(
    formConfig,
    schema,
    uiSchema,
    {
      'va-radio': 1,
    },
    pageTitle,
  );

  testShowAlert(
    formConfig,
    schema,
    uiSchema,
    pageTitle,
    { totalNetWorth: false },
    async container => {
      const radio = $('va-radio', container);
      expect(radio).to.exist;
      await fillRadio(radio, 'Y');
    },
  );
});
