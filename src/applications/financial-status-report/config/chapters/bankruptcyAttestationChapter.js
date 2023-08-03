import {
  bankruptcyHistory,
  bankruptcyHistoryRecords,
  enhancedBankruptcyHistoryRecords,
} from '../../pages';

export default {
  bankruptcyAttestationChapter: {
    title: 'Bankruptcy history',
    pages: {
      bankruptcyHistory: {
        path: 'bankruptcy-history',
        title: 'Bankruptcy history',
        uiSchema: bankruptcyHistory.uiSchema,
        schema: bankruptcyHistory.schema,
      },
      bankruptcyHistoryRecords: {
        path: 'bankruptcy-history-records',
        title: 'Bankruptcy history',
        uiSchema: bankruptcyHistoryRecords.uiSchema,
        schema: bankruptcyHistoryRecords.schema,
        depends: formData =>
          formData.questions.hasBeenAdjudicatedBankrupt &&
          !formData['view:enhancedFinancialStatusReport'],
      },
      enhancedBankruptcyHistoryRecords: {
        path: 'enhanced-bankruptcy-history-records',
        title: 'Bankruptcy history',
        uiSchema: enhancedBankruptcyHistoryRecords.uiSchema,
        schema: enhancedBankruptcyHistoryRecords.schema,
        depends: formData =>
          formData.questions.hasBeenAdjudicatedBankrupt &&
          formData['view:enhancedFinancialStatusReport'],
      },
    },
  },
};
