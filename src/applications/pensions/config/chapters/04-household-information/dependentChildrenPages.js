import merge from 'lodash/merge';
import get from 'platform/utilities/data/get';
import fullSchemaPensions from 'vets-json-schema/dist/21P-527EZ-schema.json';

import {
  arrayBuilderItemFirstPageTitleUI,
  arrayBuilderItemSubsequentPageTitleUI,
  arrayBuilderYesNoSchema,
  arrayBuilderYesNoUI,
  dateOfBirthUI,
  dateOfBirthSchema,
  fullNameUI,
  fullNameSchema,
  ssnUI,
  ssnSchema,
} from '~/platform/forms-system/src/js/web-component-patterns';
import {
  VaCheckboxField,
  VaTextInputField,
} from 'platform/forms-system/src/js/web-component-fields';
import { arrayBuilderPages } from '~/platform/forms-system/src/js/patterns/array-builder';
import { formatFullName, showDependentsMultiplePage } from '../../../helpers';

const {
  childPlaceOfBirth,
} = fullSchemaPensions.properties.dependents.items.properties;

/** @type {ArrayBuilderOptions} */
const options = {
  arrayPath: 'dependents',
  nounSingular: 'dependent child',
  nounPlural: 'dependent children',
  required: false,
  isItemIncomplete: item =>
    !item?.fullName || !item.childDateOfBirth || !item.childPlaceOfBirth, // include all required fields here
  maxItems: 15,
  text: {
    getItemName: item => formatFullName(item.fullName),
  },
};

/**
 * Cards are populated on this page above the uiSchema if items are present
 *
 * @returns {PageSchema}
 */
const summaryPage = {
  uiSchema: {
    'view:hasDependentsSummaryPage': arrayBuilderYesNoUI(options),
  },
  schema: {
    type: 'object',
    properties: {
      'view:hasDependentsSummaryPage': arrayBuilderYesNoSchema,
    },
    required: ['view:hasDependentsSummaryPage'],
  },
};

/** @returns {PageSchema} */
const fullNamePage = {
  uiSchema: {
    ...arrayBuilderItemFirstPageTitleUI({
      title: 'Add a dependent child',
      nounSingular: options.nounSingular,
    }),
    fullName: fullNameUI(title => `Child’s ${title}`),
  },
  schema: {
    type: 'object',
    properties: {
      fullName: fullNameSchema,
    },
    required: ['fullName'],
  },
};

/** @returns {PageSchema} */
const birthInformationPage = {
  uiSchema: {
    ...arrayBuilderItemSubsequentPageTitleUI(
      ({ formData }) =>
        formData?.fullName
          ? `${formatFullName(formData.fullName)} birth information`
          : 'Birth Information',
    ),
    childDateOfBirth: dateOfBirthUI(),
    childPlaceOfBirth: {
      'ui:title': 'Place of birth (city and state or foreign country)',
      'ui:webComponentField': VaTextInputField,
    },
  },
  schema: {
    type: 'object',
    properties: {
      childDateOfBirth: dateOfBirthSchema,
      childPlaceOfBirth,
    },
    required: ['childDateOfBirth', 'childPlaceOfBirth'],
  },
};

/** @returns {PageSchema} */
const socialSecurityNumberPage = {
  uiSchema: {
    ...arrayBuilderItemSubsequentPageTitleUI(
      ({ formData }) =>
        formData?.fullName
          ? `${formatFullName(formData.fullName)} social security information`
          : 'Social security information',
    ),
    childSocialSecurityNumber: merge({}, ssnUI(), {
      'ui:required': (formData, index) =>
        !get(['dependents', index, 'view:noSSN'], formData),
    }),
    'view:noSSN': {
      'ui:title': "Doesn't have a Social Security number",
      'ui:webComponentField': VaCheckboxField,
    },
  },
  schema: {
    type: 'object',
    properties: {
      childSocialSecurityNumber: ssnSchema,
      'view:noSSN': { type: 'boolean' },
    },
  },
};

export const dependentChildrenPages = arrayBuilderPages(
  options,
  pageBuilder => ({
    dependentChildrenSummary: pageBuilder.summaryPage({
      title:
        'Review your recurring income not associated with accounts or assets',
      path: 'household/dependents/summary',
      depends: () => showDependentsMultiplePage(),
      uiSchema: summaryPage.uiSchema,
      schema: summaryPage.schema,
    }),
    dependentChildFullNamePage: pageBuilder.itemPage({
      title: 'Dependent children',
      path: 'household/dependents/:index/name',
      depends: () => showDependentsMultiplePage(),
      uiSchema: fullNamePage.uiSchema,
      schema: fullNamePage.schema,
    }),
    dependentChildBirthInformationPage: pageBuilder.itemPage({
      title: 'Dependent children',
      path: 'household/dependents/:index/birth',
      depends: () => showDependentsMultiplePage(),
      uiSchema: birthInformationPage.uiSchema,
      schema: birthInformationPage.schema,
    }),
    dependentChildSocialSecurityNumberPage: pageBuilder.itemPage({
      title: 'Dependent children',
      path: 'household/dependents/:index/social-security-number',
      depends: () => showDependentsMultiplePage(),
      uiSchema: socialSecurityNumberPage.uiSchema,
      schema: socialSecurityNumberPage.schema,
    }),
  }),
);
