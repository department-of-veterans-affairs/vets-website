import {
  testComponentFieldsMarkedAsRequired,
  testNumberOfFieldsByType,
  testNumberOfWebComponentFields,
  testSubmitsWithoutErrors,
} from '../pageTests.spec';

import formConfig from '../../../../config/form';
import servicePeriod from '../../../../config/chapters/03-military-history/servicePeriod';

const { schema, uiSchema } = servicePeriod;

describe('service period page', () => {
  const pageTitle = 'service period';

  const expectedNumberOfFields = 4;
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
    [`va-select[label="Branch of service"]`],
    pageTitle,
  );

  testNumberOfFieldsByType(
    formConfig,
    schema,
    uiSchema,
    {
      'va-select': 1,
      'va-memorable-date': 2,
      'va-text-input': 1,
    },
    pageTitle,
  );

  testSubmitsWithoutErrors(
    formConfig,
    schema,
    uiSchema,
    pageTitle,
    { serviceBranch: 'airForce' },
    {
      loggedIn: true,
    },
  );
});
