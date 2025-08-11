import { $ } from '@department-of-veterans-affairs/platform-forms-system/ui';
import { expect } from 'chai';
import {
  testComponentFieldsMarkedAsRequired,
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

  testComponentFieldsMarkedAsRequired(
    formConfig,
    schema,
    uiSchema,
    [
      `va-radio[label="Do you and your dependents have over $25,000 in assets?"]`,
    ],
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
