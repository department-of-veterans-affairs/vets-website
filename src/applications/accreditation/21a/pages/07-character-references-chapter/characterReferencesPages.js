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
  selectSchema,
  selectUI,
  internationalPhoneSchema,
  internationalPhoneUI,
} from '~/platform/forms-system/src/js/web-component-patterns';

import CharacterReferencesIntro from '../../components/07-character-references-chapter/CharacterReferencesIntro';
import { createName } from '../helpers/createName';
import { characterReferencesRelationship } from '../../constants/options';
import { getCardDescription } from '../helpers/getCardDescription';
import { CHAPTER_TYPE } from '../../config/enums';

/** @type {ArrayBuilderOptions} */
export const arrayBuilderOptions = {
  arrayPath: 'characterReferences',
  nounSingular: 'character reference',
  nounPlural: 'character references',
  required: true,
  isItemIncomplete: item =>
    !item?.fullName ||
    !item?.address ||
    !item?.phone?.contact ||
    !item?.email ||
    !item?.relationship,
  minItems: 3, // TODO: [Fix arrayBuilder minItems validation](https://app.zenhub.com/workspaces/accredited-representative-facing-team-65453a97a9cc36069a2ad1d6/issues/gh/department-of-veterans-affairs/va.gov-team/87155)
  maxItems: 4,
  text: {
    getItemName: item =>
      `${item?.fullName?.first} ${item?.fullName?.last}${
        item?.fullName?.suffix ? `, ${item?.fullName?.suffix}` : ''
      }`,
    cardDescription: item => getCardDescription(item, CHAPTER_TYPE.CHARACTER),
    summaryDescription:
      'You must add at least 3 and no more than 4 character references.',
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
        `${createName({
          firstName: formData?.fullName?.first,
          lastName: formData?.fullName?.last,
          suffix: formData?.fullName?.suffix,
          fallback: 'Reference',
        })} address`,
      null,
      false,
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
        `${createName({
          firstName: formData?.fullName?.first,
          lastName: formData?.fullName?.last,
          suffix: formData?.fullName?.suffix,
          fallback: 'Reference',
        })} contact information`,
      null,
      false,
    ),
    phone: internationalPhoneUI(),
    email: emailUI(),
  },
  schema: {
    type: 'object',
    properties: {
      phone: internationalPhoneSchema(),
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
        `Relationship to ${createName({
          firstName: formData?.fullName?.first,
          lastName: formData?.fullName?.last,
          suffix: formData?.fullName?.suffix,
          fallback: 'reference',
          isPossessive: false,
        })}`,
    ),
    relationship: selectUI('What is your relationship to this reference?'),
  },
  schema: {
    type: 'object',
    properties: {
      relationship: selectSchema(characterReferencesRelationship),
    },
    required: ['relationship'],
  },
};

const validateCharacterReferencesCount = (_errors, _fieldData, formData) => {
  const count = (formData?.characterReferences || []).length;
  if (!_fieldData && count < 3) {
    _errors.addError(
      `You must add at least 3 character references. You currently have ${count ||
        0}.`,
    );
  }
  if (!_fieldData && count > 4) {
    _errors.addError(
      `You can add no more than 4 character references. You currently have ${count}.`,
    );
  }
};

/**
 * This page is skipped on the first loop for required flow
 * Cards are populated on this page above the uiSchema if items are present
 *
 * @returns {PageSchema}
 */
const summaryPage = {
  uiSchema: {
    'view:hasCharacterReferences': {
      ...arrayBuilderYesNoUI(
        arrayBuilderOptions,
        {},
        {
          labelHeaderLevel: 'p',
        },
      ),
      'ui:validations': [validateCharacterReferencesCount],
      'ui:errorMessages': {
        required: 'Select yes to confirm your character references.',
      },
    },
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
