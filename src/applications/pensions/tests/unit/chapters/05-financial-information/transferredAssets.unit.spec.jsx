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
import transferredAssets from '../../../../config/chapters/05-financial-information/transferredAssets';
import { fillRadio } from '../../testHelpers/webComponents';

const { schema, uiSchema } = transferredAssets;

describe('Pensions: Financial information transferred assets page', () => {
  const pageTitle = 'transferred assets';
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
      `va-radio[label="Did you, your spouse, or your dependents transfer any assets in the last 3 calendar years?"]`,
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
