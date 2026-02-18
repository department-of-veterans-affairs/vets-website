import merge from 'lodash/merge';
import {
  arrayBuilderItemFirstPageTitleUI,
  fullNameNoSuffixUI,
  fullNameNoSuffixSchema,
  ssnUI,
  ssnSchema,
} from '~/platform/forms-system/src/js/web-component-patterns';
import { VaCheckboxField } from 'platform/forms-system/src/js/web-component-fields';
import {
  testComponentFieldsMarkedAsRequired,
  testNumberOfFieldsByType,
  testNumberOfWebComponentFields,
  testSubmitsWithoutErrors,
} from '../pageTests.spec';
import formConfig from '../../../../config/form';
import { dependentChildrenPages } from '../../../../config/chapters/04-household-information/dependentChildrenPages';

describe('dependents summary page', () => {
  const { dependentChildrenSummary } = dependentChildrenPages;

  const pageTitle = 'dependent children summary';
  const expectedNumberOfFields = 1;
  testNumberOfWebComponentFields(
    formConfig,
    dependentChildrenSummary.schema,
    dependentChildrenSummary.uiSchema,
    expectedNumberOfFields,
    pageTitle,
  );

  testComponentFieldsMarkedAsRequired(
    formConfig,
    dependentChildrenSummary.schema,
    dependentChildrenSummary.uiSchema,
    [`va-radio[label="Do you have any dependent children?"]`],
    pageTitle,
  );

  testSubmitsWithoutErrors(
    formConfig,
    dependentChildrenSummary.schema,
    dependentChildrenSummary.uiSchema,
    pageTitle,
  );

  testNumberOfFieldsByType(
    formConfig,
    dependentChildrenSummary.schema,
    dependentChildrenSummary.uiSchema,
    {
      'va-radio': 1,
    },
    pageTitle,
  );
});

describe('dependents full name page', () => {
  const dependentChildFullNamePage = {
    uiSchema: {
      ...arrayBuilderItemFirstPageTitleUI({
        title: 'dependent full name',
        nounSingular: 'dependent child',
      }),
      fullName: fullNameNoSuffixUI(title => `Child's ${title}`),
    },
    schema: {
      type: 'object',
      properties: {
        fullName: fullNameNoSuffixSchema,
      },
      required: ['fullName'],
    },
  };
  const pageTitle = 'dependent';
  const expectedNumberOfFields = 3;
  testNumberOfWebComponentFields(
    formConfig,
    dependentChildFullNamePage.schema,
    dependentChildFullNamePage.uiSchema,
    expectedNumberOfFields,
    pageTitle,
  );

  testComponentFieldsMarkedAsRequired(
    formConfig,
    dependentChildFullNamePage.schema,
    dependentChildFullNamePage.uiSchema,
    [
      `va-text-input[name="root_fullName_first"]`,
      `va-text-input[name="root_fullName_last"]`,
    ],
    pageTitle,
  );

  testSubmitsWithoutErrors(
    formConfig,
    dependentChildFullNamePage.schema,
    dependentChildFullNamePage.uiSchema,
    pageTitle,
    {
      fullName: {
        first: 'Emily',
        last: 'Doe',
      },
    },
  );

  testNumberOfFieldsByType(
    formConfig,
    dependentChildFullNamePage.schema,
    dependentChildFullNamePage.uiSchema,
    {
      'va-text-input': 3,
    },
    pageTitle,
  );
});

describe('dependents ssn page', () => {
  const dependentChildSocialSecurityNumberPage = {
    uiSchema: {
      childSocialSecurityNumber: merge({}, ssnUI(), {
        'ui:required': (formData, index) => {
          return (
            formData?.['view:noSsn'] !== true &&
            formData?.dependents?.[index]?.['view:noSsn'] !== true
          );
        },
      }),
      'view:noSsn': {
        'ui:title': "Doesn't have a Social Security number",
        'ui:webComponentField': VaCheckboxField,
      },
    },
    schema: {
      type: 'object',
      properties: {
        childSocialSecurityNumber: ssnSchema,
        'view:noSsn': { type: 'boolean' },
      },
    },
  };
  const pageTitle = 'dependent';
  const expectedNumberOfFields = 2;
  testNumberOfWebComponentFields(
    formConfig,
    dependentChildSocialSecurityNumberPage.schema,
    dependentChildSocialSecurityNumberPage.uiSchema,
    expectedNumberOfFields,
    pageTitle,
  );

  testComponentFieldsMarkedAsRequired(
    formConfig,
    dependentChildSocialSecurityNumberPage.schema,
    dependentChildSocialSecurityNumberPage.uiSchema,
    [`va-text-input[label="Social Security number"]`],
    pageTitle,
  );

  testSubmitsWithoutErrors(
    formConfig,
    dependentChildSocialSecurityNumberPage.schema,
    dependentChildSocialSecurityNumberPage.uiSchema,
    pageTitle,
    {
      childSocialSecurityNumber: '987654321',
    },
  );

  testSubmitsWithoutErrors(
    formConfig,
    dependentChildSocialSecurityNumberPage.schema,
    dependentChildSocialSecurityNumberPage.uiSchema,
    pageTitle,
    {
      'view:noSsn': true,
    },
  );

  testNumberOfFieldsByType(
    formConfig,
    dependentChildSocialSecurityNumberPage.schema,
    dependentChildSocialSecurityNumberPage.uiSchema,
    {
      'va-text-input': 1,
      'va-checkbox': 1,
    },
    pageTitle,
  );
});
