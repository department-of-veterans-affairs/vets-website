import React from 'react';
import { arrayBuilderPages } from '~/platform/forms-system/src/js/patterns/array-builder';
import {
  currencyUI,
  currencySchema,
  arrayBuilderItemFirstPageTitleUI,
  arrayBuilderItemSubsequentPageTitleUI,
  arrayBuilderYesNoUI,
  arrayBuilderYesNoSchema,
  fullNameUI,
  fullNameSchema,
  textUI,
  yesNoUI,
  yesNoSchema,
  radioUI,
  radioSchema,
  ssnUI,
  ssnSchema,
  checkboxUI,
  checkboxSchema,
  currentOrPastDateUI,
  currentOrPastDateSchema,
  selectUI,
  titleUI,
} from 'platform/forms-system/src/js/web-component-patterns';
import {
  STATE_NAMES,
  STATE_VALUES,
  COUNTRY_NAMES,
  COUNTRY_VALUES,
} from '../../../utils/labels';
import { seriouslyDisabledDescription } from '../../../utils/helpers';
import { VaForm214138Alert } from '../../../components/FormAlerts';

/**
 * Dependent children (array builder)
 */
/** @type {ArrayBuilderOptions} */
export const options = {
  arrayPath: 'veteransChildren',
  nounSingular: 'dependent child',
  nounPlural: 'dependent children',
  required: true,
  maxItems: 3,
  isItemIncomplete: item => !item?.childFullName || !item?.childDateOfBirth,
  text: {
    cancelAddTitle: 'Cancel adding this dependent child?',
    cancelEditTitle: 'Cancel editing this dependent child?',
    cancelAddDescription:
      'If you cancel, we won’t add this dependent to your list of dependent children. You’ll return to a page where you can add a new dependent child.',
    cancelEditDescription:
      'If you cancel, you’ll lose any changes you made to this dependent child and you will be returned to the dependent children review page.',
    cancelAddYes: 'Yes, cancel adding',
    cancelAddNo: 'No, continue adding',
    cancelEditYes: 'Yes, cancel editing',
    cancelEditNo: 'No, continue editing',
    deleteDescription:
      'This will delete the information from your list of dependent children. You’ll return to a page where you can add a new dependent child.',
    deleteNo: 'No, keep',
    deleteTitle: 'Delete this dependent child?',
    deleteYes: 'Yes, delete',
    alertMaxItems: (
      <div>
        <p className="vads-u-margin-top--0">
          You have added the maximum number of allowed dependent children for
          this application. Additional dependents can be added using VA Form
          686c and uploaded at the end of this application.
        </p>
        <va-link
          href="https://www.va.gov/find-forms/about-form-21-686c/"
          external
          text="Get VA Form 21P-686c to download"
        />
      </div>
    ),
    getItemName: item => {
      if (item && item.childFullName?.first && item.childFullName?.last) {
        return `${item.childFullName.first} ${item.childFullName.last}`;
      }
      return 'Dependent';
    },
    summaryTitle: "Review the Veteran's dependent children",
  },
};

/** @returns {PageSchema} */
const introPage = {
  uiSchema: {
    ...arrayBuilderItemFirstPageTitleUI({
      title: 'Dependents',
      nounSingular: options.nounSingular,
      nounPlural: options.nounPlural,
    }),
    'ui:description': () => (
      <div>
        <p className="vads-u-margin-top--0">
          Next we’ll ask you about the Veteran’s dependent children. You may add
          up to 3 dependents.
        </p>
      </div>
    ),
  },
  schema: {
    type: 'object',
    properties: {},
  },
};

/** @returns {PageSchema} */
const summaryPage = {
  uiSchema: {
    'view:isAddingDependent': arrayBuilderYesNoUI(
      options,
      {
        title: 'Do you have a dependent child of the Veteran to add?',
        hint: '',
      },
      {
        title: 'Do you have another dependent child of the Veteran to add?',
        hint: '',
        labelHeaderLevel: 3,
      },
    ),
  },
  schema: {
    type: 'object',
    properties: {
      'view:isAddingDependent': arrayBuilderYesNoSchema,
    },
    required: ['view:isAddingDependent'],
  },
};

/** @returns {PageSchema} */
const namePage = {
  uiSchema: {
    ...arrayBuilderItemSubsequentPageTitleUI(
      "Dependent's name and information",
    ),
    childFullName: fullNameUI(),
    childSocialSecurityNumber: {
      ...ssnUI(),
      'ui:required': (formData, index) => {
        const item = formData?.veteransChildren?.[index];
        const currentPageData = formData;
        return !(item?.noSsn || currentPageData?.noSsn);
      },

      'ui:options': {
        hideIf: (formData, index) => {
          const item = formData?.veteransChildren?.[index];
          const currentPageData = formData;
          return item?.noSsn || currentPageData?.noSsn;
        },
      },
    },
    noSsn: checkboxUI({
      title: "Doesn't have a Social Security number",
    }),
  },
  schema: {
    type: 'object',
    properties: {
      childFullName: fullNameSchema,
      childSocialSecurityNumber: ssnSchema,
      noSsn: checkboxSchema,
    },
    required: ['childFullName'],
  },
};

/** @returns {PageSchema} */
const dobPlacePage = {
  uiSchema: {
    ...arrayBuilderItemSubsequentPageTitleUI(
      "Dependent's date and place of birth",
    ),
    childDateOfBirth: currentOrPastDateUI({
      title: 'Date of birth',
      monthSelect: false,
      'ui:description':
        'Enter 1 or 2 digits for the month and day and 4 digits for the year.',
      required: formData => !formData['view:dateOfBirth'],
    }),
    bornOutsideUS: checkboxUI({
      title: 'They were born outside the U.S.',
    }),
    birthPlace: {
      city: {
        ...textUI('City'),
        'ui:errorMessages': {
          required: 'Please enter a city',
        },
      },
      state: {
        ...selectUI('State', STATE_VALUES, STATE_NAMES),
        'ui:required': (formData, index) => {
          const item = formData?.veteransChildren?.[index];
          const currentPageData = formData;
          return !(item?.bornOutsideUS || currentPageData?.bornOutsideUS);
        },
        'ui:options': {
          hideIf: (formData, index) => {
            const item = formData?.veteransChildren?.[index];
            const currentPageData = formData;
            return item?.bornOutsideUS || currentPageData?.bornOutsideUS;
          },
        },
        'ui:errorMessages': {
          required: 'Please select a state',
        },
      },
      country: {
        ...selectUI('Country', COUNTRY_VALUES, COUNTRY_NAMES),
        'ui:required': (formData, index) => {
          const item = formData?.veteransChildren?.[index];
          const currentPageData = formData;
          return item?.bornOutsideUS || currentPageData?.bornOutsideUS;
        },
        'ui:options': {
          hideIf: (formData, index) => {
            const item = formData?.veteransChildren?.[index];
            const currentPageData = formData;
            return !(item?.bornOutsideUS || currentPageData?.bornOutsideUS);
          },
          labels: COUNTRY_VALUES.reduce((acc, value, idx) => {
            acc[value] = COUNTRY_NAMES[idx];
            return acc;
          }, {}),
        },
        'ui:errorMessages': {
          required: 'Please select a country',
        },
      },
    },
  },
  schema: {
    type: 'object',
    required: ['birthPlace', 'childDateOfBirth'],
    properties: {
      childDateOfBirth: currentOrPastDateSchema,
      bornOutsideUS: checkboxSchema,
      birthPlace: {
        type: 'object',
        required: ['city'],
        properties: {
          city: { type: 'string' },
          state: {
            type: 'string',
            enum: STATE_VALUES,
            enumNames: STATE_NAMES,
          },
          country: {
            type: 'string',
            enum: COUNTRY_VALUES,
            enumNames: COUNTRY_NAMES,
          },
        },
      },
    },
  },
};

/** @returns {PageSchema} */
const relationshipPage = {
  uiSchema: {
    ...arrayBuilderItemSubsequentPageTitleUI('Relationship to dependent'),
    relationship: radioUI({
      title: "What's the Veteran's relationship to the child?",
      labels: {
        BIOLOGICAL: "They're the Veteran's biological child",
        ADOPTED: "They're the Veteran's adopted child",
        STEPCHILD: "They're the Veteran's stepchild",
      },
    }),
  },
  schema: {
    type: 'object',
    properties: {
      relationship: radioSchema(['BIOLOGICAL', 'ADOPTED', 'STEPCHILD']),
    },
    required: ['relationship'],
  },
};

const dependentInfoPage = {
  uiSchema: {
    ...arrayBuilderItemSubsequentPageTitleUI("Dependent's information"),
    inSchool: yesNoUI({
      title: 'Is the child 18-23 years old and still in school?',
    }),
    seriouslyDisabled: yesNoUI({ title: 'Is the child seriously disabled?' }),
    seriouslyDisabledInfo: {
      'ui:description': () => <div>{seriouslyDisabledDescription}</div>,
    },
    hasBeenMarried: yesNoUI({ title: 'Has the child been married?' }),
    currentlyMarried: {
      ...yesNoUI({ title: 'Are they currently married?' }),
      'ui:options': {
        expandUnder: 'hasBeenMarried',
        expandUnderCondition: true,
      },
    },
  },
  schema: {
    type: 'object',
    properties: {
      inSchool: yesNoSchema,
      seriouslyDisabled: yesNoSchema,
      seriouslyDisabledInfo: {
        type: 'object',
        properties: {},
      },
      hasBeenMarried: yesNoSchema,
      currentlyMarried: yesNoSchema,
    },
    required: ['inSchool', 'seriouslyDisabled', 'hasBeenMarried'],
  },
};

const householdPage = {
  uiSchema: {
    ...titleUI("Dependent's household"),
    livesWith: yesNoUI({
      title: 'Does the child live with you?',
      'ui:required': true,
    }),
    vaForm214138Alert: {
      'ui:description': VaForm214138Alert,
      'ui:options': {
        hideIf: (formData, index) => {
          const item = formData?.veteransChildren?.[index];
          const value = item?.livesWith ?? formData?.livesWith;
          return value !== false;
        },
        displayEmptyObjectOnReview: true,
      },
    },
  },
  schema: {
    type: 'object',
    required: ['livesWith'],
    properties: {
      livesWith: yesNoSchema,
      vaForm214138Alert: {
        type: 'object',
        properties: {},
      },
    },
  },
};

const childSupportPage = {
  uiSchema: {
    ...arrayBuilderItemSubsequentPageTitleUI('Child support payment'),
    childSupport: currencyUI(
      "How much did the Veteran contribute per month to their child's support?",
    ),
  },
  schema: {
    type: 'object',
    properties: {
      childSupport: currencySchema,
    },
    required: ['childSupport'],
  },
};

/** @returns {PageSchema} */
export const dependentsPages = arrayBuilderPages(options, pageBuilder => ({
  dependentsIntro: pageBuilder.introPage({
    title: 'Dependents',
    path: 'household/dependents',
    depends: formData => formData.veteranChildrenCount > 0,
    uiSchema: introPage.uiSchema,
    schema: introPage.schema,
  }),
  dependentsSummary: pageBuilder.summaryPage({
    title: 'Do you have a dependent child of the Veteran to add?',
    path: 'household/dependents/add',
    depends: formData => formData.veteranChildrenCount > 0,
    uiSchema: summaryPage.uiSchema,
    schema: summaryPage.schema,
  }),
  dependentName: pageBuilder.itemPage({
    title: "Dependent's name and information",
    path: 'household/dependents/:index/name-and-information',
    depends: formData => formData.veteranChildrenCount > 0,
    uiSchema: namePage.uiSchema,
    schema: namePage.schema,
  }),
  dependentDobPlace: pageBuilder.itemPage({
    title: "Dependent's date and place of birth",
    path: 'household/dependents/:index/date-and-place-of-birth',
    depends: formData => formData.veteranChildrenCount > 0,
    uiSchema: dobPlacePage.uiSchema,
    schema: dobPlacePage.schema,
  }),
  dependentRelationship: pageBuilder.itemPage({
    title: 'Relationship to dependent',
    path: 'household/dependents/:index/relationship-to-dependent',
    depends: formData => formData.veteranChildrenCount > 0,
    uiSchema: relationshipPage.uiSchema,
    schema: relationshipPage.schema,
  }),
  dependentInfo: pageBuilder.itemPage({
    title: "Dependent's information",
    path: 'household/dependents/:index/information',
    depends: formData => formData.veteranChildrenCount > 0,
    uiSchema: dependentInfoPage.uiSchema,
    schema: dependentInfoPage.schema,
  }),
  dependentHousehold: pageBuilder.itemPage({
    title: "Dependent's household",
    path: 'household/dependents/:index/household',
    depends: formData => formData.veteranChildrenCount > 0,
    uiSchema: householdPage.uiSchema,
    schema: householdPage.schema,
  }),
  dependentChildSupport: pageBuilder.itemPage({
    title: 'Child support payment',
    path: 'household/dependents/:index/child-support',
    uiSchema: childSupportPage.uiSchema,
    schema: childSupportPage.schema,
    depends: (formData, index) =>
      formData?.veteransChildren?.[index]?.livesWith === false &&
      formData.veteranChildrenCount > 0,
  }),
}));

export default dependentsPages;
