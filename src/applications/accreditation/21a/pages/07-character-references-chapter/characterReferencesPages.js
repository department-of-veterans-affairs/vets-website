import { arrayBuilderPages } from '~/platform/forms-system/src/js/patterns/array-builder';
import {
  addressSchema,
  addressUI,
  arrayBuilderItemFirstPageTitleUI,
  arrayBuilderItemSubsequentPageTitleUI,
  arrayBuilderYesNoSchema,
  arrayBuilderYesNoUI,
  descriptionUI,
  emailSchema,
  emailUI,
  fullNameSchema,
  fullNameUI,
  textareaSchema,
  textareaUI,
} from '~/platform/forms-system/src/js/web-component-patterns';

import CharacterReferencesIntro from '../../components/07-character-references-chapter/CharacterReferencesIntro';
import {
  internationalPhoneSchema,
  internationalPhoneUI,
} from '../helpers/internationalPhonePatterns';

/** @type {ArrayBuilderOptions} */
const arrayBuilderOptions = {
  arrayPath: 'characterReferences',
  nounSingular: 'character reference',
  nounPlural: 'character references',
  required: true,
  isItemIncomplete: item =>
    !item?.fullName ||
    !item?.address ||
    !item?.phone ||
    !item?.email ||
    !item?.relationship,
  minItems: 3, // TODO: [Fix arrayBuilder minItems validation](https://app.zenhub.com/workspaces/accredited-representative-facing-team-65453a97a9cc36069a2ad1d6/issues/gh/department-of-veterans-affairs/va.gov-team/87155)
  maxItems: 4,
  text: {
    getItemName: item =>
      `${item?.fullName?.first} ${item?.fullName?.last}${
        item?.fullName?.suffix ? `, ${item?.fullName?.suffix}` : ''
      }`,
    cardDescription: item => `${item?.phone}, ${item?.email}`,
  },
};

/** @returns {PageSchema} */
const introPage = {
  uiSchema: {
    ...descriptionUI(CharacterReferencesIntro),
  },
  schema: {
    type: 'object',
    properties: {},
  },
};

/** @returns {PageSchema} */
const namePage = {
  uiSchema: {
    ...arrayBuilderItemFirstPageTitleUI({
      title: 'Name of character reference',
      nounSingular: arrayBuilderOptions.nounSingular,
    }),
    fullName: fullNameUI(),
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
const addressPage = {
  uiSchema: {
    ...arrayBuilderItemSubsequentPageTitleUI(
      ({ formData }) =>
        formData?.fullName?.first && formData?.fullName?.last
          ? `${formData.fullName.first} ${formData.fullName.last}'s address`
          : "Reference's address",
    ),
    address: addressUI({
      labels: {
        militaryCheckbox:
          'Reference lives on a United States military base outside of the U.S.',
      },
      omit: ['street3'],
    }),
  },
  schema: {
    type: 'object',
    properties: {
      address: addressSchema({
        omit: ['street3'],
      }),
    },
  },
};

/** @returns {PageSchema} */
const contactInformationPage = {
  uiSchema: {
    ...arrayBuilderItemSubsequentPageTitleUI(
      ({ formData }) =>
        formData?.fullName?.first && formData?.fullName?.last
          ? `${formData.fullName.first} ${
              formData.fullName.last
            }'s contact information`
          : "Reference's contact information",
    ),
    phone: internationalPhoneUI('Primary number'),
    email: emailUI(),
  },
  schema: {
    type: 'object',
    properties: {
      phone: internationalPhoneSchema,
      email: emailSchema,
    },
    required: ['phone', 'email'],
  },
};

/** @returns {PageSchema} */
const relationshipPage = {
  uiSchema: {
    ...arrayBuilderItemSubsequentPageTitleUI(
      ({ formData }) =>
        formData?.fullName?.first && formData?.fullName?.last
          ? `Relationship to ${formData.fullName.first} ${
              formData.fullName.last
            }`
          : 'Relationship to reference',
    ),
    relationship: textareaUI('What is your relationship to this reference?'),
  },
  schema: {
    type: 'object',
    properties: {
      relationship: textareaSchema,
    },
    required: ['relationship'],
  },
};

/**
 * This page is skipped on the first loop for required flow
 * Cards are populated on this page above the uiSchema if items are present
 *
 * @returns {PageSchema}
 */
const summaryPage = {
  uiSchema: {
    'view:hasCharacterReferences': arrayBuilderYesNoUI(
      arrayBuilderOptions,
      {},
      {
        labelHeaderLevel: 'p',
      },
    ),
  },
  schema: {
    type: 'object',
    properties: {
      'view:hasCharacterReferences': arrayBuilderYesNoSchema,
    },
    required: ['view:hasCharacterReferences'],
  },
};

const characterReferencesPages = arrayBuilderPages(
  arrayBuilderOptions,
  pageBuilder => ({
    characterReferences: pageBuilder.introPage({
      title: 'Character references',
      path: 'character-references',
      uiSchema: introPage.uiSchema,
      schema: introPage.schema,
    }),
    characterReferencesSummary: pageBuilder.summaryPage({
      title: 'Review your character references',
      path: 'character-references-summary',
      uiSchema: summaryPage.uiSchema,
      schema: summaryPage.schema,
    }),
    characterReferenceNamePage: pageBuilder.itemPage({
      title: 'Character reference name',
      path: 'character-references/:index/name',
      uiSchema: namePage.uiSchema,
      schema: namePage.schema,
    }),
    characterReferenceAddressPage: pageBuilder.itemPage({
      title: 'Character reference address',
      path: 'character-references/:index/address',
      uiSchema: addressPage.uiSchema,
      schema: addressPage.schema,
    }),
    characterReferenceContactInformationPage: pageBuilder.itemPage({
      title: 'Character reference contact information',
      path: 'character-references/:index/contact-information',
      uiSchema: contactInformationPage.uiSchema,
      schema: contactInformationPage.schema,
    }),
    characterReferenceRelationshipPage: pageBuilder.itemPage({
      title: 'Character reference relationship',
      path: 'character-references/:index/relationship',
      uiSchema: relationshipPage.uiSchema,
      schema: relationshipPage.schema,
    }),
  }),
);

export default characterReferencesPages;
