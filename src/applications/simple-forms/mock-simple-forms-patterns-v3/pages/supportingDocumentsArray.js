import {
  arrayBuilderItemFirstPageTitleUI,
  arrayBuilderYesNoSchema,
  arrayBuilderYesNoUI,
  fileInputUI,
  fileInputSchema,
  selectUI,
  selectSchema,
  titleUI,
} from '~/platform/forms-system/src/js/web-component-patterns';
import { arrayBuilderPages } from '~/platform/forms-system/src/js/patterns/array-builder';
import BackToIntroLink from '../components/BackToIntroLink';

const DOCUMENT_TYPE_LABELS = {
  dd214: 'DD214',
  medical: 'Medical record',
  financial: 'Financial document',
  legal: 'Legal document',
  correspondence: 'Correspondence',
  other: 'Other',
};

/**
 * Builds summary and document page schemas for a file upload array pattern.
 *
 * @param {ArrayBuilderOptions} options
 * @returns {{ summaryPage: PageSchema, documentPage: PageSchema }}
 */
const buildPages = options => {
  /** Cards are populated on this page above the uiSchema if items are present */
  const summaryPage = {
    uiSchema: {
      'view:hasSupportingDocuments': arrayBuilderYesNoUI(
        options,
        {
          title: 'Do you have any supporting documents to upload?',
          labels: {
            Y: 'Yes, I have a document to upload',
            N: 'No, I don’t have any documents to upload',
          },
        },
        {
          title: 'Do you have another document to upload?',
          labels: {
            Y: 'Yes, I have another document to upload',
            N: 'No, I don’t have another document to upload',
          },
        },
      ),
    },
    schema: {
      type: 'object',
      properties: {
        'view:hasSupportingDocuments': arrayBuilderYesNoSchema,
      },
      required: ['view:hasSupportingDocuments'],
    },
  };

  const documentPage = {
    uiSchema: {
      ...arrayBuilderItemFirstPageTitleUI({
        title: 'Upload your document',
        nounSingular: options.nounSingular,
      }),
      documentUpload: fileInputUI({
        title: 'Upload a document',
        required: true,
        accept: '.png,.pdf,.jpg,.jpeg',
        hint: 'Upload a PNG, PDF, or JPG file',
        formNumber: '31-4159',
        skipUpload: true,
      }),
      documentType: selectUI({
        title: 'Document type',
        labels: DOCUMENT_TYPE_LABELS,
      }),
    },
    schema: {
      type: 'object',
      properties: {
        documentUpload: fileInputSchema(),
        documentType: selectSchema(Object.keys(DOCUMENT_TYPE_LABELS)),
      },
      required: ['documentUpload', 'documentType'],
    },
  };

  return { summaryPage, documentPage };
};

/** @type {ArrayBuilderOptions} */
const requiredOptions = {
  arrayPath: 'supportingDocumentsArrayRequired',
  nounSingular: 'document',
  nounPlural: 'documents',
  required: true,
  isItemIncomplete: item => !item?.documentUpload || !item?.documentType,
  maxItems: 5,
  text: {
    getItemName: item => item?.documentUpload?.name || 'document',
    cardDescription: item =>
      DOCUMENT_TYPE_LABELS[(item?.documentType)] || item?.documentType,
  },
};

/** @type {ArrayBuilderOptions} */
const optionalOptions = {
  arrayPath: 'supportingDocumentsArrayOptional',
  nounSingular: 'document',
  nounPlural: 'documents',
  required: false,
  isItemIncomplete: item => !item?.documentUpload || !item?.documentType,
  maxItems: 5,
  text: {
    getItemName: item => item?.documentUpload?.name || 'document',
    cardDescription: item =>
      DOCUMENT_TYPE_LABELS[(item?.documentType)] || item?.documentType,
  },
};

const {
  summaryPage: requiredSummaryPage,
  documentPage: requiredDocumentPage,
} = buildPages(requiredOptions);

const {
  summaryPage: optionalSummaryPage,
  documentPage: optionalDocumentPage,
} = buildPages(optionalOptions);

const requiredIntroPage = {
  uiSchema: {
    ...titleUI(
      'Your supporting documents',
      'Upload your supporting documents. At least one document is required, up to 5 total.',
    ),
  },
  schema: {
    type: 'object',
    properties: {},
  },
};

export const supportingDocumentsArrayRequiredPages = arrayBuilderPages(
  requiredOptions,
  pageBuilder => ({
    supportingDocumentsArrayRequiredIntro: pageBuilder.introPage({
      title: 'Your supporting documents',
      path: 'supporting-documents-array-required-intro',
      ContentBeforeButtons: BackToIntroLink,
      uiSchema: requiredIntroPage.uiSchema,
      schema: requiredIntroPage.schema,
    }),
    supportingDocumentsArrayRequiredSummary: pageBuilder.summaryPage({
      title: 'Your supporting documents',
      path: 'supporting-documents-array-required',
      ContentBeforeButtons: BackToIntroLink,
      uiSchema: requiredSummaryPage.uiSchema,
      schema: requiredSummaryPage.schema,
    }),
    supportingDocumentsArrayRequiredDocumentPage: pageBuilder.itemPage({
      title: 'Upload your document',
      path: 'supporting-documents-array-required/:index/upload',
      ContentBeforeButtons: BackToIntroLink,
      uiSchema: requiredDocumentPage.uiSchema,
      schema: requiredDocumentPage.schema,
    }),
  }),
);

export const supportingDocumentsArrayOptionalPages = arrayBuilderPages(
  optionalOptions,
  pageBuilder => ({
    supportingDocumentsArrayOptionalSummary: pageBuilder.summaryPage({
      title: 'Your supporting documents',
      path: 'supporting-documents-array-optional',
      ContentBeforeButtons: BackToIntroLink,
      uiSchema: optionalSummaryPage.uiSchema,
      schema: optionalSummaryPage.schema,
    }),
    supportingDocumentsArrayOptionalDocumentPage: pageBuilder.itemPage({
      title: 'Upload your document',
      path: 'supporting-documents-array-optional/:index/upload',
      ContentBeforeButtons: BackToIntroLink,
      uiSchema: optionalDocumentPage.uiSchema,
      schema: optionalDocumentPage.schema,
    }),
  }),
);
