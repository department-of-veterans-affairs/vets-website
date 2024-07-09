import merge from 'lodash/merge';
import get from 'platform/utilities/data/get';

import {
  arrayBuilderItemFirstPageTitleUI,
  arrayBuilderItemSubsequentPageTitleUI,
  arrayBuilderYesNoSchema,
  arrayBuilderYesNoUI,
  addressUI,
  addressSchema,
  dateOfBirthUI,
  dateOfBirthSchema,
  fullNameUI,
  fullNameSchema,
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
import currencyUI from 'platform/forms-system/src/js/definitions/currency';
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
  showDependentsMultiplePage,
} from '../../../helpers';

/** @type {ArrayBuilderOptions} */
const options = {
  arrayPath: 'dependents',
  nounSingular: 'dependent child',
  nounPlural: 'dependent children',
  required: false,
  isItemIncomplete: item =>
    !item?.fullName ||
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
        `${formatFullName(formData.fullName)} birth information`,
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
        `${formatFullName(formData.fullName)} Social Security information`,
    ),
    childSocialSecurityNumber: merge({}, ssnUI(), {
      'ui:required': (formData, index) =>
        !get(['dependents', index, 'view:noSsn'], formData),
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
        `${formatFullName(formData.fullName)} relationship information`,
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
        `${formatFullName(formData.fullName)} school information`,
    ),
    attendingCollege: yesNoUI({
      title: 'Is your child in school?',
    }),
    'view:schoolWarning': {
      'ui:description': SchoolAttendanceAlert,
      'ui:options': {
        expandUnder: 'attendingCollege',
      },
    },
  },
  schema: {
    type: 'object',
    properties: {
      attendingCollege: yesNoSchema,
      'view:schoolWarning': { type: 'object', properties: {} },
    },
    required: ['attendingCollege'],
  },
};

/** @returns {PageSchema} */
const disabledPage = {
  uiSchema: {
    ...arrayBuilderItemSubsequentPageTitleUI(
      ({ formData }) =>
        `${formatFullName(formData.fullName)} disabled information`,
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
        `${formatFullName(formData.fullName)} marriage information`,
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
        `${formatFullName(formData.fullName)} household information`,
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
        `${formatFullName(formData.fullName)} address information`,
    ),
    childAddress: addressUI({
      omit: ['isMilitary', 'street3'],
    }),
    personWhoLivesWithChild: merge(
      {},
      {
        'ui:title': 'Who do they live with?',
      },
      fullNameUI(),
    ),
    monthlyPayment: merge(
      {},
      currencyUI(
        "How much do you contribute per month to your child's support?",
      ),
      {
        'ui:options': {
          classNames: 'schemaform-currency-input-v3',
        },
      },
    ),
  },
  schema: {
    type: 'object',
    properties: {
      childAddress: addressSchema({ omit: ['isMilitary', 'street3'] }),
      personWhoLivesWithChild: fullNameSchema,
      monthlyPayment: { type: 'number' },
    },
    required: ['childAddress', 'monthlyPayment'],
  },
};

export const dependentChildrenPages = arrayBuilderPages(
  options,
  (pageBuilder, helpers) => ({
    dependentChildrenSummary: pageBuilder.summaryPage({
      title: 'Dependent children',
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
    dependentChildRelationshipPage: pageBuilder.itemPage({
      title: 'Dependent children',
      path: 'household/dependents/:index/relationship',
      depends: () => showDependentsMultiplePage(),
      uiSchema: relationshipPage.uiSchema,
      schema: relationshipPage.schema,
    }),
    dependentChildAttendingSchoolPage: pageBuilder.itemPage({
      title: 'Dependent children',
      path: 'household/dependents/:index/school',
      depends: (formData, index) =>
        showDependentsMultiplePage() &&
        isBetween18And23(
          get(['dependents', index, 'childDateOfBirth'], formData),
        ),
      uiSchema: attendingSchoolPage.uiSchema,
      schema: attendingSchoolPage.schema,
    }),
    dependentChildDisabledPage: pageBuilder.itemPage({
      title: 'Dependent children',
      path: 'household/dependents/:index/disabled',
      depends: () => showDependentsMultiplePage(),
      uiSchema: disabledPage.uiSchema,
      schema: disabledPage.schema,
    }),
    dependentChildPreviouslyMarriedPage: pageBuilder.itemPage({
      title: 'Dependent children',
      path: 'household/dependents/:index/married',
      depends: () => showDependentsMultiplePage(),
      uiSchema: previouslyMarriedPage.uiSchema,
      schema: previouslyMarriedPage.schema,
    }),
    dependentChildInHouseholdPage: pageBuilder.itemPage({
      title: 'Dependent children',
      path: 'household/dependents/:index/in-household',
      depends: () => showDependentsMultiplePage(),
      onNavForward: props => {
        return props.formData.childInHousehold
          ? helpers.navForwardFinishedItem(props) // go to next page
          : helpers.navForwardKeepUrlParams(props); // return to summary
      },
      uiSchema: inHouseholdPage.uiSchema,
      schema: inHouseholdPage.schema,
    }),
    dependentChildAddressPage: pageBuilder.itemPage({
      title: 'Dependent children',
      path: 'household/dependents/:index/address',
      depends: () => showDependentsMultiplePage(),
      uiSchema: addressPage.uiSchema,
      schema: addressPage.schema,
    }),
  }),
);
