import {
  bankruptcyHistory,
  enhancedBankruptcyHistoryRecords,
} from '../../pages';

import BankruptcyDetails from '../../components/bankruptcy/BankruptcyDetails';
import BankruptcyDetailsReview from '../../components/bankruptcy/BankruptcyDetailsReview';
import BankruptcyQuestion from '../../components/bankruptcy/BankruptcyQuestion';
import BankruptcyQuestionReview from '../../components/bankruptcy/BankruptcyQuestionReview';

import {
  isStreamlinedShortForm,
  isStreamlinedLongForm,
} from '../../utils/streamlinedDepends';

export default {
  bankruptcyAttestationChapter: {
    title: 'Bankruptcy history',
    depends: formData =>
      !isStreamlinedShortForm(formData) && !isStreamlinedLongForm(formData),
    pages: {
      bankruptcyHistory: {
        path: 'bankruptcy-history',
        title: 'Bankruptcy history',
        uiSchema: bankruptcyHistory.uiSchema,
        schema: bankruptcyHistory.schema,
        CustomPage: BankruptcyQuestion,
        CustomPageReview: BankruptcyQuestionReview,
        depends: formData =>
          !isStreamlinedShortForm(formData) && !isStreamlinedLongForm(formData),
      },
      enhancedBankruptcyHistoryRecords: {
        path: 'enhanced-bankruptcy-history-records',
        title: 'Bankruptcy history',
        uiSchema: enhancedBankruptcyHistoryRecords.uiSchema,
        schema: enhancedBankruptcyHistoryRecords.schema,
        CustomPage: BankruptcyDetails,
        CustomPageReview: BankruptcyDetailsReview,
        depends: formData =>
          formData.questions.hasBeenAdjudicatedBankrupt &&
          !isStreamlinedShortForm(formData) &&
          !isStreamlinedLongForm(formData),
      },
    },
  },
};
