import { arrayBuilderPages } from 'platform/forms-system/src/js/patterns/array-builder';
import {
  arrayBuilderYesNoUI,
  arrayBuilderYesNoSchema,
  arrayBuilderItemFirstPageTitleUI,
  textUI,
  textSchema,
  addressUI,
  addressSchema,
} from 'platform/forms-system/src/js/web-component-patterns';

const witnessSignaturesOptions = {
  arrayPath: 'signatureWitnesses',
  nounSingular: 'witness',
  nounPlural: 'witnesses',
  required: true,
  minItems: 2,
  maxItems: 2,
  isItemIncomplete: item =>
    !item?.signature ||
    !item?.address?.street ||
    !item?.address?.city ||
    !item?.address?.state ||
    !item?.address?.postalCode,
  text: {
    getItemName: item => item?.signature || 'Unknown witness',
    cardDescription: item => {
      const address = item?.address;
      if (!address) return 'No address provided';
      const city = address.city || '';
      const state = address.state || '';
      return city && state
        ? `${city}, ${state}`
        : city || state || 'No address';
    },
  },
};

export const witnessSignaturesPages = arrayBuilderPages(
  witnessSignaturesOptions,
  pageBuilder => ({
    witnessSignaturesSummary: pageBuilder.summaryPage({
      title: 'Witness signatures',
      path: 'witnesses-summary',
      uiSchema: {
        'view:hasWitnesses': arrayBuilderYesNoUI(witnessSignaturesOptions, {
          title: 'Have you added both required witnesses?',
          labels: {
            Y: 'Yes, I have added both witnesses',
            N: 'No, I need to add witnesses',
          },
        }),
      },
      schema: {
        type: 'object',
        properties: {
          'view:hasWitnesses': arrayBuilderYesNoSchema,
        },
        required: ['view:hasWitnesses'],
      },
    }),
    witnessSignatureName: pageBuilder.itemPage({
      title: 'Witness - Signature',
      path: 'witnesses/:index/signature',
      uiSchema: {
        ...arrayBuilderItemFirstPageTitleUI({
          title: 'Witness - Signature',
          nounSingular: witnessSignaturesOptions.nounSingular,
        }),
        signature: textUI('Signature of witness'),
      },
      schema: {
        type: 'object',
        properties: {
          signature: textSchema,
        },
        required: ['signature'],
      },
    }),
    witnessSignatureAddress: pageBuilder.itemPage({
      title: 'Witness - Address',
      path: 'witnesses/:index/address',
      uiSchema: {
        address: addressUI({ title: 'Address of witness' }),
      },
      schema: {
        type: 'object',
        properties: {
          address: addressSchema(),
        },
        required: ['address'],
      },
    }),
  }),
);
