import merge from 'lodash/merge';
import get from 'platform/utilities/data/get';

import {
  arrayBuilderItemFirstPageTitleUI,
  arrayBuilderItemSubsequentPageTitleUI,
  arrayBuilderYesNoSchema,
  arrayBuilderYesNoUI,
  addressUI,
  addressSchema,
  currencyUI,
  currencySchema,
  dateOfBirthUI,
  dateOfBirthSchema,
  fullNameNoSuffixUI,
  fullNameNoSuffixSchema,
  radioUI,
  radioSchema,
  ssnUI,
  ssnSchema,
  yesNoUI,
  yesNoSchema,
} from '~/platform/forms-system/src/js/web-component-patterns';
import {
  VaCheckboxField,
  VaTextInputField,
} from 'platform/forms-system/src/js/web-component-fields';
import { arrayBuilderPages } from '~/platform/forms-system/src/js/patterns/array-builder';
import {
  DisabilityDocsAlert,
  SchoolAttendanceAlert,
} from '../../../components/FormAlerts';
import { childRelationshipLabels } from '../../../labels';
import { isBetween18And23 } from './helpers';
import {
  DependentSeriouslyDisabledDescription,
  formatFullName,
  formatPossessiveString,
  showMultiplePageResponse,
} from '../../../helpers';

/** @type {ArrayBuilderOptions} */
const options = {
  arrayPath: 'dependents',
  nounSingular: 'dependent child',
  nounPlural: 'dependent children',
  required: false,
  isItemIncomplete: item =>
    !item?.fullName?.first ||
    !item.fullName.last ||
    !item.childDateOfBirth ||
    !item.childPlaceOfBirth ||
    (!item.childSocialSecurityNumber && !item['view:noSsn']) ||
    !item.childRelationship ||
    typeof item.disabled !== 'boolean' ||
    typeof item.previouslyMarried !== 'boolean' ||
    typeof item.childInHousehold !== 'boolean' ||
    (!item.childInHousehold &&
      (!item.childAddress ||
        !item.childAddress.street ||
        !item.childAddress.city ||
        !item.childAddress.postalCode ||
        !item.childAddress.country)) ||
    (!item.childInHousehold &&
      (!item.personWhoLivesWithChild ||
        !item.personWhoLivesWithChild.first ||
        !item.personWhoLivesWithChild.last)) ||
    (!item.childInHousehold && !item.monthlyPayment), // include all required fields here
  text: {
    getItemName: item =>
      item.fullName ? formatFullName(item.fullName) : undefined,
    summaryTitleWithoutItems: 'Dependent children',
    alertItemUpdated: 'Your dependents information has been updated',
    alertItemDeleted: 'Your dependents information has been deleted',
    cancelAddTitle: 'Cancel adding this dependent child',
    cancelAddYes: 'Yes, cancel adding this dependent child',
    cancelAddNo: 'No',
    cancelEditTitle: 'Cancel editing this dependent child',
    cancelEditYes: 'Yes, cancel editing this dependent child',
    cancelEditNo: 'No',
    cancelNo: 'No',
    deleteTitle: 'Delete this dependent child',
    deleteNo: 'No',
  },
};

/**
 * Cards are populated on this page above the uiSchema if items are present
 *
 * @returns {PageSchema}
 */
const summaryPage = {
  uiSchema: {
    'view:isAddingDependents': arrayBuilderYesNoUI(options, {
      title: 'Do you have any dependent children?',
      labelHeaderLevel: ' ',
      hint: null,
    }),
  },
  schema: {
    type: 'object',
    properties: {
      'view:isAddingDependents': arrayBuilderYesNoSchema,
    },
    required: ['view:isAddingDependents'],
  },
};

/** @returns {PageSchema} */
const fullNamePage = {
  uiSchema: {
    ...arrayBuilderItemFirstPageTitleUI({
      title: 'Dependent child',
      nounSingular: options.nounSingular,
    }),
    fullName: fullNameNoSuffixUI(title => `Child’s ${title}`),
  },
  schema: {
    type: 'object',
    properties: {
      fullName: fullNameNoSuffixSchema,
    },
    required: ['fullName'],
  },
};

/** @returns {PageSchema} */
const birthInformationPage = {
  uiSchema: {
    ...arrayBuilderItemSubsequentPageTitleUI(
      ({ formData }) =>
        `${formatPossessiveString(
          formatFullName(formData.fullName),
        )} birth information`,
      undefined,
      false,
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
      childPlaceOfBirth: {
        type: 'string',
      },
    },
    required: ['childDateOfBirth', 'childPlaceOfBirth'],
  },
};

/** @returns {PageSchema} */
const socialSecurityNumberPage = {
  uiSchema: {
    ...arrayBuilderItemSubsequentPageTitleUI(
      ({ formData }) =>
        `${formatPossessiveString(
          formatFullName(formData.fullName),
        )} Social Security information`,
      undefined,
      false,
    ),
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

/** @returns {PageSchema} */
const relationshipPage = {
  uiSchema: {
    ...arrayBuilderItemSubsequentPageTitleUI(
      ({ formData }) =>
        `${formatPossessiveString(
          formatFullName(formData.fullName),
        )} relationship information`,
      undefined,
      false,
    ),
    childRelationship: radioUI({
      title: "What's your relationship?",
      labels: childRelationshipLabels,
    }),
  },
  schema: {
    type: 'object',
    properties: {
      childRelationship: radioSchema(Object.keys(childRelationshipLabels)),
    },
    required: ['childRelationship'],
  },
};

/** @returns {PageSchema} */
const attendingSchoolPage = {
  uiSchema: {
    ...arrayBuilderItemSubsequentPageTitleUI(
      ({ formData }) =>
        `${formatPossessiveString(
          formatFullName(formData.fullName),
        )} school information`,
      undefined,
      false,
    ),
    attendingCollege: yesNoUI({
      title: 'Is your child in school?',
    }),
    'view:schoolWarning': {
      'ui:description': SchoolAttendanceAlert,
      'ui:options': {
        expandUnder: 'attendingCollege',
      },
      'ui:required': (formData, index) => {
        return (
          isBetween18And23(formData?.childDateOfBirth) ||
          isBetween18And23(formData?.dependents?.[index]?.childDateOfBirth)
        );
      },
    },
  },
  schema: {
    type: 'object',
    properties: {
      attendingCollege: yesNoSchema,
      'view:schoolWarning': { type: 'object', properties: {} },
    },
  },
};

/** @returns {PageSchema} */
const disabledPage = {
  uiSchema: {
    ...arrayBuilderItemSubsequentPageTitleUI(
      ({ formData }) =>
        `${formatPossessiveString(
          formatFullName(formData.fullName),
        )} disability information`,
      undefined,
      false,
    ),
    disabled: yesNoUI({
      title: 'Is your child seriously disabled?',
    }),
    'view:disabilityDocs': {
      'ui:description': DisabilityDocsAlert,
      'ui:options': {
        expandUnder: 'disabled',
      },
    },
    'view:disabilityInformation': {
      'ui:description': DependentSeriouslyDisabledDescription,
    },
  },
  schema: {
    type: 'object',
    properties: {
      disabled: yesNoSchema,
      'view:disabilityDocs': { type: 'object', properties: {} },
      'view:disabilityInformation': { type: 'object', properties: {} },
    },
    required: ['disabled'],
  },
};

/** @returns {PageSchema} */
const previouslyMarriedPage = {
  uiSchema: {
    ...arrayBuilderItemSubsequentPageTitleUI(
      ({ formData }) =>
        `${formatPossessiveString(
          formatFullName(formData.fullName),
        )} marriage information`,
      undefined,
      false,
    ),
    previouslyMarried: yesNoUI({
      title: 'Has your child ever been married?',
    }),
    married: yesNoUI({
      title: 'Are they currently married?',
      expandUnder: 'previouslyMarried',
      required: (formData, index) =>
        get(['dependents', index, 'previouslyMarried'], formData),
    }),
  },
  schema: {
    type: 'object',
    properties: {
      previouslyMarried: yesNoSchema,
      married: yesNoSchema,
    },
    required: ['previouslyMarried'],
  },
};

/** @returns {PageSchema} */
const inHouseholdPage = {
  uiSchema: {
    ...arrayBuilderItemSubsequentPageTitleUI(
      ({ formData }) =>
        `${formatPossessiveString(
          formatFullName(formData.fullName),
        )} household information`,
      undefined,
      false,
    ),
    childInHousehold: yesNoUI({
      title: 'Does your child live with you?',
    }),
  },
  schema: {
    type: 'object',
    properties: {
      childInHousehold: yesNoSchema,
    },
    required: ['childInHousehold'],
  },
};

/** @returns {PageSchema} */
const addressPage = {
  uiSchema: {
    ...arrayBuilderItemSubsequentPageTitleUI(
      ({ formData }) =>
        `${formatPossessiveString(
          formatFullName(formData.fullName),
        )} address information`,
      undefined,
      false,
    ),
    childAddress: addressUI({
      omit: ['isMilitary', 'street3'],
    }),
    personWhoLivesWithChild: merge(
      {},
      {
        'ui:title': 'Who do they live with?',
      },
      fullNameNoSuffixUI(),
    ),
    monthlyPayment: merge(
      {},
      currencyUI(
        "How much do you contribute per month to your child's support?",
      ),
      {
        'ui:required': (formData, index) => {
          return (
            formData?.childInHousehold === false ||
            formData.dependents?.[index]?.childInHousehold === false
          );
        },
      },
    ),
  },
  schema: {
    type: 'object',
    properties: {
      childAddress: addressSchema({ omit: ['isMilitary', 'street3'] }),
      personWhoLivesWithChild: fullNameNoSuffixSchema,
      monthlyPayment: currencySchema,
    },
  },
};

export const dependentChildrenPages = arrayBuilderPages(
  options,
  pageBuilder => ({
    dependentChildrenSummary: pageBuilder.summaryPage({
      title: 'Dependent children',
      path: 'household/dependents/summary',
      depends: () => showMultiplePageResponse(),
      uiSchema: summaryPage.uiSchema,
      schema: summaryPage.schema,
    }),
    dependentChildFullNamePage: pageBuilder.itemPage({
      title: 'Dependent children',
      path: 'household/dependents/:index/name',
      depends: () => showMultiplePageResponse(),
      uiSchema: fullNamePage.uiSchema,
      schema: fullNamePage.schema,
    }),
    dependentChildBirthInformationPage: pageBuilder.itemPage({
      title: 'Dependent children',
      path: 'household/dependents/:index/birth',
      depends: () => showMultiplePageResponse(),
      uiSchema: birthInformationPage.uiSchema,
      schema: birthInformationPage.schema,
    }),
    dependentChildSocialSecurityNumberPage: pageBuilder.itemPage({
      title: 'Dependent children',
      path: 'household/dependents/:index/social-security-number',
      depends: () => showMultiplePageResponse(),
      uiSchema: socialSecurityNumberPage.uiSchema,
      schema: socialSecurityNumberPage.schema,
    }),
    dependentChildRelationshipPage: pageBuilder.itemPage({
      title: 'Dependent children',
      path: 'household/dependents/:index/relationship',
      depends: () => showMultiplePageResponse(),
      uiSchema: relationshipPage.uiSchema,
      schema: relationshipPage.schema,
    }),
    dependentChildAttendingSchoolPage: pageBuilder.itemPage({
      title: 'Dependent children',
      path: 'household/dependents/:index/school',
      depends: (formData, index) =>
        showMultiplePageResponse() &&
        isBetween18And23(formData.dependents?.[index]?.childDateOfBirth),
      uiSchema: attendingSchoolPage.uiSchema,
      schema: attendingSchoolPage.schema,
    }),
    dependentChildDisabledPage: pageBuilder.itemPage({
      title: 'Dependent children',
      path: 'household/dependents/:index/disabled',
      depends: () => showMultiplePageResponse(),
      uiSchema: disabledPage.uiSchema,
      schema: disabledPage.schema,
    }),
    dependentChildPreviouslyMarriedPage: pageBuilder.itemPage({
      title: 'Dependent children',
      path: 'household/dependents/:index/married',
      depends: () => showMultiplePageResponse(),
      uiSchema: previouslyMarriedPage.uiSchema,
      schema: previouslyMarriedPage.schema,
    }),
    dependentChildInHouseholdPage: pageBuilder.itemPage({
      title: 'Dependent children',
      path: 'household/dependents/:index/in-household',
      depends: () => showMultiplePageResponse(),
      uiSchema: inHouseholdPage.uiSchema,
      schema: inHouseholdPage.schema,
    }),
    dependentChildAddressPage: pageBuilder.itemPage({
      title: 'Dependent children',
      path: 'household/dependents/:index/address',
      depends: (formData, index) =>
        showMultiplePageResponse() &&
        !formData.dependents?.[index]?.childInHousehold,
      uiSchema: addressPage.uiSchema,
      schema: addressPage.schema,
    }),
  }),
);
