import React from 'react';
import { arrayBuilderPages } from '~/platform/forms-system/src/js/patterns/array-builder';
import {
  arrayBuilderItemFirstPageTitleUI,
  arrayBuilderItemSubsequentPageTitleUI,
  arrayBuilderYesNoUI,
  arrayBuilderYesNoSchema,
  textUI,
  textSchema,
  radioUI,
  radioSchema,
  currentOrPastDateUI,
  currentOrPastDateSchema,
  addressUI,
  addressSchema,
} from 'platform/forms-system/src/js/web-component-patterns';

/**
 * Dependent children (array builder)
 */

const options = {
  arrayPath: 'dependents',
  nounSingular: 'dependent child',
  nounPlural: 'dependent children',
  required: false,
  maxItems: 3,
  isItemIncomplete: item =>
    !item?.firstName || !item?.lastName || !item?.dateOfBirth,
  text: {
    getItemName: item => {
      if (item && item.firstName && item.lastName) {
        return `${item.firstName} ${item.lastName}`;
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
    'view:isAddingDependent': arrayBuilderYesNoUI(
      options,
      {
        title: 'Do you have a dependent child to add?',
      },
      {
        title: 'Is there another dependent child to add?',
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
    firstName: textUI('First name'),
    middleName: textUI('Middle name'),
    lastName: textUI('Last name'),
    suffix: textUI('Suffix'),
    ssn: textUI('Social Security number'),
    'view:noSsn': {
      'ui:widget': 'checkbox',
      'ui:title': "Doesn't have a Social Security number",
    },
  },
  schema: {
    type: 'object',
    properties: {
      firstName: textSchema,
      middleName: textSchema,
      lastName: textSchema,
      suffix: textSchema,
      ssn: textSchema,
      'view:noSsn': { type: 'boolean' },
    },
    required: ['firstName', 'lastName'],
  },
};

const dobPlacePage = {
  uiSchema: {
    ...arrayBuilderItemSubsequentPageTitleUI(
      "Dependent's date and place of birth",
    ),
    dateOfBirth: currentOrPastDateUI('Date of birth'),
    'view:bornOutsideUS': {
      'ui:widget': 'checkbox',
      'ui:title': 'They were born outside the U.S.',
    },
    birthPlace: {
      ...addressUI({
        labels: {
          militaryCheckbox: 'They were born outside the U.S.',
        },
      }),
      city: {
        'ui:title': 'City',
        'ui:required': formData => !formData['view:bornOutsideUS'],
      },
    },
  },
  schema: {
    type: 'object',
    properties: {
      dateOfBirth: currentOrPastDateSchema,
      birthPlace: {
        type: 'object',
        properties: {
          ...addressSchema({}).properties,
        },
      },
    },
    required: ['dateOfBirth'],
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
    inSchool: radioUI({
      title: 'Is your child 18-23 years old and still in school?',
    }),
    seriouslyDisabled: radioUI({ title: 'Is your child seriously disabled?' }),
    hasBeenMarried: radioUI({ title: 'Has your child been married?' }),
    currentlyMarried: radioUI({ title: 'Are they currently married?' }),
  },
  schema: {
    type: 'object',
    properties: {
      inSchool: radioSchema(['YES', 'NO']),
      seriouslyDisabled: radioSchema(['YES', 'NO']),
      hasBeenMarried: radioSchema(['YES', 'NO']),
      currentlyMarried: radioSchema(['YES', 'NO']),
    },
    required: [
      'inSchool',
      'seriouslyDisabled',
      'hasBeenMarried',
      'currentlyMarried',
    ],
  },
};

const householdPage = {
  uiSchema: {
    ...arrayBuilderItemSubsequentPageTitleUI("Dependent's household"),
    livesWithYou: radioUI({ title: 'Does your child live with you?' }),
  },
  schema: {
    type: 'object',
    properties: {
      livesWithYou: radioSchema(['YES', 'NO']),
    },
    required: ['livesWithYou'],
  },
};

const mailingAddressPage = {
  uiSchema: {
    ...arrayBuilderItemSubsequentPageTitleUI("Dependent's mailing address"),
    mailingAddress: {
      ...addressUI({}),
    },
  },
  schema: {
    type: 'object',
    properties: {
      mailingAddress: {
        type: 'object',
        properties: {
          ...addressSchema({}).properties,
        },
      },
    },
  },
};

const custodianPage = {
  uiSchema: {
    ...arrayBuilderItemSubsequentPageTitleUI("Dependent's custodian"),
    custodianFirstName: textUI('First name'),
    custodianMiddleName: textUI('Middle name'),
    custodianLastName: textUI('Last name'),
  },
  schema: {
    type: 'object',
    properties: {
      custodianFirstName: textSchema,
      custodianMiddleName: textSchema,
      custodianLastName: textSchema,
    },
    required: ['custodianFirstName', 'custodianLastName'],
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
  }),
  dependentCustodian: pageBuilder.itemPage({
    title: "Dependent's custodian",
    path: 'household/dependents/:index/custodian',
    uiSchema: custodianPage.uiSchema,
    schema: custodianPage.schema,
  }),
  dependentChildSupport: pageBuilder.itemPage({
    title: 'Child support payment',
    path: 'household/dependents/:index/child-support',
    uiSchema: childSupportPage.uiSchema,
    schema: childSupportPage.schema,
  }),
}));

export default dependentsPages;
