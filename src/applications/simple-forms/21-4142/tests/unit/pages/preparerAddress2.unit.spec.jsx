import environment from 'platform/utilities/environment';
import {
  testNumberOfErrorsOnSubmit,
  testNumberOfErrorsOnSubmitForWebComponents,
  testNumberOfFields,
  testNumberOfWebComponentFields,
} from '../../../../shared/tests/pages/pageTests.spec';
import {
  preparerIdentificationFields,
  veteranIsSelfText,
} from '../../../definitions/constants';
import formConfig from '../../../config/form';

const {
  schema,
  uiSchema,
} = formConfig.chapters.preparerAddress.pages.preparerAddress2;

const pageTitle = 'preparer address 2';

const mockData = {
  [preparerIdentificationFields.parentObject]: {
    [preparerIdentificationFields.relationshipToVeteran]: veteranIsSelfText,
    [preparerIdentificationFields.preparerHasSameAddressAsVeteran]: false,
  },
};

if (environment.isProduction()) {
  const expectedNumberOfFields = 6;
  testNumberOfFields(
    formConfig,
    schema,
    uiSchema,
    expectedNumberOfFields,
    pageTitle,
    mockData,
  );

  const expectedNumberOfErrors = 4;
  testNumberOfErrorsOnSubmit(
    formConfig,
    schema,
    uiSchema,
    expectedNumberOfErrors,
    pageTitle,
    mockData,
  );
} else {
  const numberOfWebComponentFields = 6;
  testNumberOfWebComponentFields(
    formConfig,
    schema,
    uiSchema,
    numberOfWebComponentFields,
    pageTitle,
    mockData,
  );

  const numberOfWebComponentErrors = 4;
  testNumberOfErrorsOnSubmitForWebComponents(
    formConfig,
    schema,
    uiSchema,
    numberOfWebComponentErrors,
    pageTitle,
    mockData,
  );
}
