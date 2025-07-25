import environment from 'platform/utilities/environment';
import {
  testNumberOfErrorsOnSubmit,
  testNumberOfErrorsOnSubmitForWebComponents,
  testNumberOfFields,
  testNumberOfWebComponentFields,
} from '../../../../shared/tests/pages/pageTests.spec';
import {
  preparerIdentificationFields,
  veteranDirectRelative,
} from '../../../definitions/constants';
import formConfig from '../../../config/form';

const {
  schema,
  uiSchema,
} = formConfig.chapters.preparerPersonalInformation.pages.preparerPersonalInformation;

const pageTitleForDirectRelative =
  'preparer personal information - direct relative';
const pageTitleForThirdParty = 'preparer personal information - third party';

const mockDataForDirectRelative = {
  [preparerIdentificationFields.parentObject]: {
    [preparerIdentificationFields.relationshipToVeteran]:
      veteranDirectRelative[0],
  },
};

const mockDataForThirdParty = {
  [preparerIdentificationFields.parentObject]: {
    [preparerIdentificationFields.relationshipToVeteran]: 'Third-party',
  },
};

if (environment.isProduction()) {
  const expectedNumberOfFieldsForDirectRelative = 4;
  testNumberOfFields(
    formConfig,
    schema,
    uiSchema,
    expectedNumberOfFieldsForDirectRelative,
    pageTitleForDirectRelative,
    mockDataForDirectRelative,
  );

  const expectedNumberOfFieldsForThirdParty = 7;
  testNumberOfFields(
    formConfig,
    schema,
    uiSchema,
    expectedNumberOfFieldsForThirdParty,
    pageTitleForThirdParty,
    mockDataForThirdParty,
  );

  const expectedNumberOfErrorsForDirectRelative = 2;
  testNumberOfErrorsOnSubmit(
    formConfig,
    schema,
    uiSchema,
    expectedNumberOfErrorsForDirectRelative,
    pageTitleForDirectRelative,
    mockDataForDirectRelative,
  );

  const expectedNumberOfErrorsForThirdParty = 4;
  testNumberOfErrorsOnSubmit(
    formConfig,
    schema,
    uiSchema,
    expectedNumberOfErrorsForThirdParty,
    pageTitleForThirdParty,
    mockDataForThirdParty,
  );
} else {
  const expectedNumberOfFieldsForDirectRelative = 4;
  testNumberOfWebComponentFields(
    formConfig,
    schema,
    uiSchema,
    expectedNumberOfFieldsForDirectRelative,
    pageTitleForDirectRelative,
    mockDataForDirectRelative,
  );

  const expectedNumberOfFieldsForThirdParty = 7;
  testNumberOfWebComponentFields(
    formConfig,
    schema,
    uiSchema,
    expectedNumberOfFieldsForThirdParty,
    pageTitleForThirdParty,
    mockDataForThirdParty,
  );

  const expectedNumberOfErrorsForDirectRelative = 2;
  testNumberOfErrorsOnSubmitForWebComponents(
    formConfig,
    schema,
    uiSchema,
    expectedNumberOfErrorsForDirectRelative,
    pageTitleForDirectRelative,
    mockDataForDirectRelative,
  );

  const expectedNumberOfErrorsForThirdParty = 4;
  testNumberOfErrorsOnSubmitForWebComponents(
    formConfig,
    schema,
    uiSchema,
    expectedNumberOfErrorsForThirdParty,
    pageTitleForThirdParty,
    mockDataForThirdParty,
  );
}
