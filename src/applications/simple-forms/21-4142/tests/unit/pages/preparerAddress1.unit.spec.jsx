import environment from 'platform/utilities/environment';
import {
  testNumberOfErrorsOnSubmit,
  testNumberOfErrorsOnSubmitForWebComponents,
  testNumberOfFields,
  testNumberOfWebComponentFields,
} from '../../../../shared/tests/pages/pageTests.spec';
import {
  preparerIdentificationFields,
  veteranFields,
  veteranIsSelfText,
} from '../../../definitions/constants';
import formConfig from '../../../config/form';

const {
  schema,
  uiSchema,
} = formConfig.chapters.preparerAddress.pages.preparerAddress1;

const pageTitle = 'preparer address 1';

const mockData = {
  [veteranFields.parentObject]: {
    [veteranFields.address]: {
      street: '1 street',
      city: 'city',
      state: 'AL',
      postalCode: '15541',
    },
  },
  [preparerIdentificationFields.parentObject]: {
    [preparerIdentificationFields.relationshipToVeteran]: veteranIsSelfText,
  },
};

if (environment.isProduction()) {
  const expectedNumberOfFields = 2;
  testNumberOfFields(
    formConfig,
    schema,
    uiSchema,
    expectedNumberOfFields,
    pageTitle,
    mockData,
  );

  const expectedNumberOfErrors = 1;
  testNumberOfErrorsOnSubmit(
    formConfig,
    schema,
    uiSchema,
    expectedNumberOfErrors,
    pageTitle,
    mockData,
  );
} else {
  const numberOfWebComponentFields = 1;
  testNumberOfWebComponentFields(
    formConfig,
    schema,
    uiSchema,
    numberOfWebComponentFields,
    pageTitle,
    mockData,
  );

  const numberOfWebComponentErrors = 1;
  testNumberOfErrorsOnSubmitForWebComponents(
    formConfig,
    schema,
    uiSchema,
    numberOfWebComponentErrors,
    pageTitle,
    mockData,
  );
}
