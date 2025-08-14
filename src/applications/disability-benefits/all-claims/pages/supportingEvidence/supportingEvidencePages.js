import { arrayBuilderPages } from 'platform/forms-system/src/js/patterns/array-builder';
import evidenceType from './evidenceType';
import evidenceUploads from './evidenceUploads';

/** @type {ArrayBuilderOptions} */
export const options = {
  arrayPath: 'evidence',
  nounSingular: 'evidence',
  nounPlural: 'evidence',
  useButtonInsteadOfYesNo: true,
  required: false,
  maxItems: 20,
  text: {
    summaryTitle: 'Supporting documents about your mental health condition',
    summaryTitleWithoutItems:
      'Supporting documents about your mental health condition',
    summaryDescription:
      'You can also submit other kinds of evidence as a part of your claim.',
    summaryDescriptionWithoutItems:
      'You can also submit other kinds of evidence as a part of your claim.',
    getItemName: item => {
      return item?.evidenceType || 'Unknown evidence type';
    },
    summaryAddButtonText: 'Add evidence',
    reviewAddButtonText: 'Add evidence',
    alertMaxItems: 'maxEvidenceAlert',
    cancelAddTitle: 'Are you sure you want to cancel adding this evidence?',
    cancelAddYes: 'Yes, cancel adding',
    cancelAddNo: 'No, continue adding this evidence',
    cancelEditButtonText: 'Cancel editing this evidence',
    cancelEditDescription:
      'If you cancel, you’ll lose any changes you made on this screen.',
    cancelEditNo: 'No, continue editing',
    cancelEditTitle: 'Are you sure you want to cancel editing this evidence?',
    deleteTitle: 'Are you sure you want to delete this evidence?',
    deleteDescription:
      'If you delete this evidence, you’ll lose the information you entered about this evidence.',
    deleteYes: 'Yes, delete',
    deleteNo: 'No, keep this evidence',
  },
};

export const supportingEvidencePages = arrayBuilderPages(
  options,
  pageBuilder => ({
    evidenceList: pageBuilder.summaryPage({
      title: 'summaryPageTitleWithTag',
      path: 'supporting-evidence/evidence-summary',
    }),
    evidenceType: pageBuilder.itemPage({
      title: 'Add Document - Document Type',
      path: 'supporting-evidence/:index/evidence-type',
      uiSchema: evidenceType.uiSchema,
      schema: evidenceType.schema,
    }),
    evidenceUpload: pageBuilder.itemPage({
      title: 'Add Document',
      path: 'supporting-evidence/:index/evidence-uploads',
      uiSchema: evidenceUploads.uiSchema,
      schema: evidenceUploads.schema,
    }),
  }),
);
