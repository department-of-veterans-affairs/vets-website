import React from 'react';
import { arrayBuilderPages } from '~/platform/forms-system/src/js/patterns/array-builder';
import {
  arrayBuilderItemFirstPageTitleUI,
  arrayBuilderItemSubsequentPageTitleUI,
  arrayBuilderYesNoUI,
  arrayBuilderYesNoSchema,
  fullNameUI,
  fullNameSchema,
  textUI,
  textSchema,
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
  addressUI,
  addressSchema,
  titleUI,
} from 'platform/forms-system/src/js/web-component-patterns';
import {
  STATE_NAMES,
  STATE_VALUES,
  COUNTRY_NAMES,
  COUNTRY_VALUES,
} from '../../../utils/labels';
import {
  DependentChildDescription,
  seriouslyDisabledDescription,
} from '../../../utils/helpers';
import { VaForm214138Alert } from '../../../components/FormAlerts';

/**
 * Dependent children (array builder)
 */
/** @type {ArrayBuilderOptions} */
export const options = {
  arrayPath: 'dependents',
  nounSingular: 'dependent child',
  nounPlural: 'dependent children',
  required: false,
  maxItems: 3,
  isItemIncomplete: item => !item?.dependentFullName || !item?.dateOfBirth,
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
      if (
        item &&
        item.dependentFullName?.first &&
        item.dependentFullName?.last
      ) {
        return `${item.dependentFullName.first} ${item.dependentFullName.last}`;
      }
      return 'Dependent';
    },
    cardDescription: () => '',
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
          Next we’ll ask you about your dependent children. You may add up to 3
          dependents.
        </p>
        {DependentChildDescription}
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
    'ui:description': () => null,
    'view:isAddingDependent': arrayBuilderYesNoUI(
      options,
      { hint: '' },
      { hint: '' },
      {
        title: 'Do you have a dependent child to add?',
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
    dependentFullName: fullNameUI(),
    dependentSocialSecurityNumber: {
      ...ssnUI(),
      'ui:required': (formData, index) => {
        const item = formData?.dependents?.[index];
        const currentPageData = formData;
        return !(item?.noSsn || currentPageData?.noSsn);
      },

      'ui:options': {
        hideIf: (formData, index) => {
          const item = formData?.dependents?.[index];
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
      dependentFullName: fullNameSchema,
      dependentSocialSecurityNumber: ssnSchema,
      noSsn: checkboxSchema,
    },
    required: ['dependentFullName'],
  },
};

/** @returns {PageSchema} */
const dobPlacePage = {
  uiSchema: {
    ...arrayBuilderItemSubsequentPageTitleUI(
      "Dependent's date and place of birth",
    ),
    dateOfBirth: currentOrPastDateUI({
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
          const item = formData?.dependents?.[index];
          const currentPageData = formData;
          return !(item?.bornOutsideUS || currentPageData?.bornOutsideUS);
        },
        'ui:options': {
          hideIf: (formData, index) => {
            const item = formData?.dependents?.[index];
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
          const item = formData?.dependents?.[index];
          const currentPageData = formData;
          return item?.bornOutsideUS || currentPageData?.bornOutsideUS;
        },
        'ui:options': {
          hideIf: (formData, index) => {
            const item = formData?.dependents?.[index];
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
    required: ['birthPlace', 'dateOfBirth'],
    properties: {
      dateOfBirth: currentOrPastDateSchema,
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
      title: "What's your relationship to the child?",
      labels: {
        BIOLOGICAL: "They're my biological child",
        ADOPTED: "They're my adopted child",
        STEPCHILD: "They're my stepchild",
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
      title: 'Is your child 18-23 years old and still in school?',
    }),
    seriouslyDisabled: yesNoUI({ title: 'Is your child seriously disabled?' }),
    seriouslyDisabledInfo: {
      'ui:description': () => <div>{seriouslyDisabledDescription}</div>,
    },
    hasBeenMarried: yesNoUI({ title: 'Has your child been married?' }),
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
    livesWithYou: yesNoUI({
      title: 'Does your child live with you?',
      'ui:required': true,
    }),
    vaForm214138Alert: {
      'ui:description': VaForm214138Alert,
      'ui:options': {
        hideIf: (formData, index) => {
          const item = formData?.dependents?.[index];
          const value = item?.livesWithYou ?? formData?.livesWithYou;
          return value !== false;
        },
        displayEmptyObjectOnReview: true,
      },
    },
  },
  schema: {
    type: 'object',
    required: ['livesWithYou'],
    properties: {
      livesWithYou: yesNoSchema,
      vaForm214138Alert: {
        type: 'object',
        properties: {},
      },
    },
  },
};

const mailingAddressPage = {
  uiSchema: {
    ...arrayBuilderItemSubsequentPageTitleUI("Dependent's mailing address"),
    mailingAddress: {
      ...addressUI({
        omit: ['isMilitary', 'street3'],
      }),
    },
  },
  schema: {
    type: 'object',
    properties: {
      mailingAddress: {
        type: 'object',
        properties: {
          ...addressSchema({ omit: ['isMilitary', 'street3'] }).properties,
        },
      },
    },
  },
};

const custodianPage = {
  uiSchema: {
    ...arrayBuilderItemSubsequentPageTitleUI("Dependent's custodian"),
    custodianFullName: fullNameUI(),
  },
  schema: {
    type: 'object',
    properties: {
      custodianFullName: fullNameSchema,
    },
    required: ['custodianFullName'],
  },
};

const childSupportPage = {
  uiSchema: {
    ...arrayBuilderItemSubsequentPageTitleUI('Child support payment'),
    monthlySupport: textUI(
      "How much do you contribute per month to your child's support?",
    ),
  },
  schema: {
    type: 'object',
    properties: {
      monthlySupport: textSchema,
    },
    required: ['monthlySupport'],
  },
};

/** @returns {PageSchema} */
export const dependentsPages = arrayBuilderPages(options, pageBuilder => ({
  dependentsIntro: pageBuilder.introPage({
    title: 'Dependents',
    path: 'household/dependents',
    uiSchema: introPage.uiSchema,
    schema: introPage.schema,
  }),
  dependentsSummary: pageBuilder.summaryPage({
    title: 'Do you have a dependent child to add?',
    path: 'household/dependents/add',
    uiSchema: summaryPage.uiSchema,
    schema: summaryPage.schema,
  }),
  dependentName: pageBuilder.itemPage({
    title: "Dependent's name and information",
    path: 'household/dependents/:index/name-and-information',
    uiSchema: namePage.uiSchema,
    schema: namePage.schema,
  }),
  dependentDobPlace: pageBuilder.itemPage({
    title: "Dependent's date and place of birth",
    path: 'household/dependents/:index/date-and-place-of-birth',
    uiSchema: dobPlacePage.uiSchema,
    schema: dobPlacePage.schema,
  }),
  dependentRelationship: pageBuilder.itemPage({
    title: 'Relationship to dependent',
    path: 'household/dependents/:index/relationship-to-dependent',
    uiSchema: relationshipPage.uiSchema,
    schema: relationshipPage.schema,
  }),
  dependentInfo: pageBuilder.itemPage({
    title: "Dependent's information",
    path: 'household/dependents/:index/information',
    uiSchema: dependentInfoPage.uiSchema,
    schema: dependentInfoPage.schema,
  }),
  dependentHousehold: pageBuilder.itemPage({
    title: "Dependent's household",
    path: 'household/dependents/:index/household',
    uiSchema: householdPage.uiSchema,
    schema: householdPage.schema,
  }),
  dependentMailingAddress: pageBuilder.itemPage({
    title: "Dependent's mailing address",
    path: 'household/dependents/:index/mailing-address',
    uiSchema: mailingAddressPage.uiSchema,
    schema: mailingAddressPage.schema,
    depends: (formData, index) =>
      formData?.dependents?.[index]?.livesWithYou === false,
  }),
  dependentCustodian: pageBuilder.itemPage({
    title: "Dependent's custodian",
    path: 'household/dependents/:index/custodian',
    uiSchema: custodianPage.uiSchema,
    schema: custodianPage.schema,
    depends: (formData, index) =>
      formData?.dependents?.[index]?.livesWithYou === false,
  }),
  dependentChildSupport: pageBuilder.itemPage({
    title: 'Child support payment',
    path: 'household/dependents/:index/child-support',
    uiSchema: childSupportPage.uiSchema,
    schema: childSupportPage.schema,
    depends: (formData, index) =>
      formData?.dependents?.[index]?.livesWithYou === false,
  }),
}));

export default dependentsPages;
