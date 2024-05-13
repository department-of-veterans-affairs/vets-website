import { expect } from 'chai';
import { $ } from '@department-of-veterans-affairs/platform-forms-system/ui';

import {
  testNumberOfErrorsOnSubmitForWebComponents,
  testNumberOfWebComponentFields,
  testSubmitsWithoutErrors,
  testShowAlert,
  testNumberOfFieldsByType,
} from '../pageTests.spec';
import formConfig from '../../../../config/form';
import medicalCondition from '../../../../config/chapters/03-health-and-employment-information/medicalCondition';
import { fillRadio } from '../../testHelpers/webComponents';

const { schema, uiSchema } = medicalCondition;

describe('pension medical condition page', () => {
  const pageTitle = 'medical condition information';
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

  testShowAlert(
    formConfig,
    schema,
    uiSchema,
    pageTitle,
    { medicalCondition: false },
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
