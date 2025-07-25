import { expect } from 'chai';
import { $ } from '@department-of-veterans-affairs/platform-forms-system/ui';

import {
  testNumberOfWebComponentFields,
  testSubmitsWithoutErrors,
  testShowAlert,
  testNumberOfFieldsByType,
} from '../pageTests.spec';
import formConfig from '../../../../config/form';
import medicaidStatus from '../../../../config/chapters/03-health-and-employment-information/medicaidStatus';
import { fillRadio } from '../../testHelpers/webComponents';

const { schema, uiSchema } = medicaidStatus;

describe('medicaid status pension page', () => {
  const pageTitle = 'medicaid status';
  const expectedNumberOfFields = 1;
  testNumberOfWebComponentFields(
    formConfig,
    schema,
    uiSchema,
    expectedNumberOfFields,
    pageTitle,
  );

  testSubmitsWithoutErrors(formConfig, schema, uiSchema, pageTitle);

  testShowAlert(
    formConfig,
    schema,
    uiSchema,
    pageTitle,
    { medicaidStatus: false },
    async container => {
      const radio = $('va-radio', container);
      expect(radio).to.exist;
      await fillRadio(radio, 'Y');
    },
  );

  testNumberOfFieldsByType(
    formConfig,
    schema,
    uiSchema,
    {
      'va-radio': 1,
    },
    pageTitle,
  );
});
