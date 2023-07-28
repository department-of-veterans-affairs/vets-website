import {
  bankruptcyHistory,
  bankruptcyHistoryRecords,
  enhancedBankruptcyHistoryRecords,
} from '../../pages';

import { isStreamlinedShortForm } from '../../utils/streamlinedDepends';

export default {
  bankruptcyAttestationChapter: {
    title: 'Bankruptcy history',
    pages: {
      bankruptcyHistory: {
        path: 'bankruptcy-history',
        title: 'Bankruptcy history',
        uiSchema: bankruptcyHistory.uiSchema,
        schema: bankruptcyHistory.schema,
        depends: formData => !isStreamlinedShortForm(formData),
      },
      bankruptcyHistoryRecords: {
        path: 'bankruptcy-history-records',
        title: 'Bankruptcy history',
        uiSchema: bankruptcyHistoryRecords.uiSchema,
        schema: bankruptcyHistoryRecords.schema,
        depends: formData =>
          formData.questions.hasBeenAdjudicatedBankrupt &&
          !formData['view:enhancedFinancialStatusReport'] &&
          !isStreamlinedShortForm(formData),
      },
      enhancedBankruptcyHistoryRecords: {
        path: 'enhanced-bankruptcy-history-records',
        title: 'Bankruptcy history',
        uiSchema: enhancedBankruptcyHistoryRecords.uiSchema,
        schema: enhancedBankruptcyHistoryRecords.schema,
        depends: formData =>
          formData.questions.hasBeenAdjudicatedBankrupt &&
          formData['view:enhancedFinancialStatusReport'] &&
          !isStreamlinedShortForm(formData),
      },
    },
  },
};
