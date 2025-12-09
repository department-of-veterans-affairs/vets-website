import {
  titleUI,
  fullNameUI,
  fullNameSchema,
  radioUI,
  radioSchema,
  currentOrPastDateUI,
  currentOrPastDateSchema,
  addressUI,
  addressSchema,
  arrayBuilderItemFirstPageTitleUI,
  arrayBuilderItemSubsequentPageTitleUI,
  arrayBuilderYesNoSchema,
  arrayBuilderYesNoUI,
} from 'platform/forms-system/src/js/web-component-patterns';
import { arrayBuilderPages } from 'platform/forms-system/src/js/patterns/array-builder';

const relationshipOptions = {
  spouse: 'Spouse',
  child: 'Child',
  parent: 'Parent',
};

/** @type {ArrayBuilderOptions} */
const options = {
  arrayPath: 'survivingRelatives',
  nounSingular: 'relative',
  nounPlural: 'relatives',
  required: false,
  isItemIncomplete: item => !item?.fullName || !item?.relationship,
  maxItems: 4,
  text: {
    getItemName: item => {
      const name = item?.fullName;
      if (!name) return 'Unknown relative';
      return `${name.first || ''} ${name.middle || ''} ${name.last || ''}`
        .trim()
        .replace(/\s+/g, ' ');
    },
    cardDescription: item => {
      const relationship =
        relationshipOptions[(item?.relationship)] || item?.relationship || '';
      const dob = item?.dateOfBirth ? ` • Born: ${item.dateOfBirth}` : '';
      return `${relationship}${dob}`;
    },
  },
};

/** @returns {PageSchema} */
const summaryPage = {
  uiSchema: {
    ...titleUI('Surviving relatives'),
    'view:hasRelatives': arrayBuilderYesNoUI(options),
  },
  schema: {
    type: 'object',
    properties: {
      'view:hasRelatives': arrayBuilderYesNoSchema,
    },
    required: ['view:hasRelatives'],
  },
};

/** @returns {PageSchema} */
const relativeNamePage = {
  uiSchema: {
    ...arrayBuilderItemFirstPageTitleUI({
      title: 'Surviving relative information',
      nounSingular: options.nounSingular,
    }),
    fullName: fullNameUI(),
    relationship: radioUI({
      title: 'Relationship to deceased',
      labels: relationshipOptions,
    }),
    dateOfBirth: currentOrPastDateUI('Date of birth'),
  },
  schema: {
    type: 'object',
    properties: {
      fullName: fullNameSchema,
      relationship: radioSchema(Object.keys(relationshipOptions)),
      dateOfBirth: currentOrPastDateSchema,
    },
    required: ['fullName', 'relationship'],
  },
};

/** @returns {PageSchema} */
const relativeAddressPage = {
  uiSchema: {
    ...arrayBuilderItemSubsequentPageTitleUI(({ formData }) => {
      const name = formData?.fullName;
      if (!name) return "Relative's address";
      const fullName = `${name.first || ''} ${name.last || ''}`.trim();
      return fullName ? `${fullName}'s address` : `Relative's address`;
    }),
    address: addressUI(),
  },
  schema: {
    type: 'object',
    properties: {
      address: addressSchema(),
    },
  },
};

export const relativesPages = arrayBuilderPages(options, pageBuilder => ({
  relativesSummary: pageBuilder.summaryPage({
    title: 'Surviving relatives',
    path: 'relatives-information',
    uiSchema: summaryPage.uiSchema,
    schema: summaryPage.schema,
  }),
  relativeNamePage: pageBuilder.itemPage({
    title: 'Surviving relative information',
    path: 'relatives-information/:index/details',
    uiSchema: relativeNamePage.uiSchema,
    schema: relativeNamePage.schema,
  }),
  relativeAddressPage: pageBuilder.itemPage({
    title: "Relative's address",
    path: 'relatives-information/:index/address',
    uiSchema: relativeAddressPage.uiSchema,
    schema: relativeAddressPage.schema,
  }),
}));

// Export for testing
export const relativesOptions = options;
