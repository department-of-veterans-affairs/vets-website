import { arrayBuilderPages } from '~/platform/forms-system/src/js/patterns/array-builder';
import {
  addressSchema,
  addressUI,
  arrayBuilderItemFirstPageTitleUI,
  arrayBuilderItemSubsequentPageTitleUI,
  arrayBuilderYesNoSchema,
  arrayBuilderYesNoUI,
  emailSchema,
  emailUI,
  fullNameSchema,
  fullNameUI,
  phoneSchema,
  phoneUI,
  titleUI,
} from '~/platform/forms-system/src/js/web-component-patterns';

import YourCharacterReferencesDescription from '../../components/07-character-references-chapter/YourCharacterReferencesDescription';

/** @type {ArrayBuilderOptions} */
const arrayBuilderOptions = {
  arrayPath: 'characterReferences',
  nounSingular: 'character reference',
  nounPlural: 'character references',
  required: true,
  isItemIncomplete: item =>
    !item?.fullName || !item?.address || !item?.phone || !item?.email,
  minItems: 3, // TODO: [Fix arrayBuilder minItems validation](https://app.zenhub.com/workspaces/accredited-representative-facing-team-65453a97a9cc36069a2ad1d6/issues/gh/department-of-veterans-affairs/va.gov-team/87155)
  maxItems: 4,
  text: {
    getItemName: item => `${item?.fullName?.first} ${item?.fullName?.last}`,
    cardDescription: item =>
      `${item?.address?.street}, ${item?.address?.city}, ${
        item?.address?.state
      } ${item?.address?.postalCode}`,
  },
};

/** @returns {PageSchema} */
const introPage = {
  uiSchema: {
    ...titleUI('Your character references', YourCharacterReferencesDescription),
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
          'This address is on a United States military base outside of the U.S.',
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
    phone: phoneUI('Primary number'),
    email: emailUI(),
  },
  schema: {
    type: 'object',
    properties: {
      phone: phoneSchema,
      email: emailSchema,
    },
    required: ['phone', 'email'],
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
  }),
);

export default characterReferencesPages;
