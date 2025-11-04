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

const options = {
  arrayPath: 'dependents',
  nounSingular: 'dependent child',
  nounPlural: 'dependent children',
  required: false,
  maxItems: 3,
  isItemIncomplete: item => !item?.dependentFullName || !item?.dateOfBirth,
  text: {
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

const namePage = {
  uiSchema: {
    ...arrayBuilderItemSubsequentPageTitleUI(
      "Dependent's name and information",
    ),
    dependentFullName: fullNameUI(),
    dependentSocialSecurityNumber: ssnUI(),
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
    required: ['dependentFullName', 'dependentSocialSecurityNumber'],
  },
};

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
    ...arrayBuilderItemSubsequentPageTitleUI("Dependent's household"),
    livesWithYou: yesNoUI({ title: 'Does your child live with you?' }),
    form21Alert: {
      // show this alert when the dependent does NOT live with the veteran
      'ui:options': {
        // when used inside the array-builder item page the hideIf callback
        // receives (formData, index) — check the item at dependents[index]
        hideIf: (formData, index) => {
          const item = formData?.dependents?.[index];
          const currentPageData = formData;
          const value = item?.livesWithYou ?? currentPageData?.livesWithYou;
          // hide the alert unless livesWithYou is explicitly false
          return value !== false;
        },
        displayEmptyObjectOnReview: true,
      },
      'ui:description': VaForm214138Alert,
    },
  },
  schema: {
    type: 'object',
    properties: {
      livesWithYou: yesNoSchema,
      form21Alert: {
        type: 'object',
        properties: {},
      },
    },
    required: ['livesWithYou'],
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

export const dependentsPages = arrayBuilderPages(
  options,
  (pageBuilder, helpers) => ({
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
      onNavForward: props => {
        // If the dependent lives with the veteran, finish the item and
        // return to the summary (review) page. Otherwise continue to the
        // mailing address and subsequent pages.
        const index = props.match?.params?.index
          ? Number(props.match.params.index)
          : undefined;
        const item = props.formData?.dependents?.[index];
        const livesWithYou = item?.livesWithYou ?? props.formData?.livesWithYou;
        return livesWithYou === true
          ? helpers.navForwardFinishedItem(props)
          : helpers.navForwardKeepUrlParams(props);
      },
    }),
    dependentMailingAddress: pageBuilder.itemPage({
      title: "Dependent's mailing address",
      path: 'household/dependents/:index/mailing-address',
      uiSchema: mailingAddressPage.uiSchema,
      schema: mailingAddressPage.schema,
      depends: (formData, index) => {
        const item = formData?.dependents?.[index];
        const value = item?.livesWithYou ?? formData?.livesWithYou;
        return value === false;
      },
    }),
    dependentCustodian: pageBuilder.itemPage({
      title: "Dependent's custodian",
      path: 'household/dependents/:index/custodian',
      uiSchema: custodianPage.uiSchema,
      schema: custodianPage.schema,
      depends: (formData, index) => {
        const item = formData?.dependents?.[index];
        const value = item?.livesWithYou ?? formData?.livesWithYou;
        return value === false;
      },
    }),
    dependentChildSupport: pageBuilder.itemPage({
      title: 'Child support payment',
      path: 'household/dependents/:index/child-support',
      uiSchema: childSupportPage.uiSchema,
      schema: childSupportPage.schema,
      depends: (formData, index) => {
        const item = formData?.dependents?.[index];
        const value = item?.livesWithYou ?? formData?.livesWithYou;
        return value === false;
      },
    }),
  }),
);

export default dependentsPages;
