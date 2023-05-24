import veteranInformationChapter from './chapters/veteranInformationChapter';
import householdIncomeChapter from './chapters/householdIncomeChapter';
import householdAssetsChapter from './chapters/householdAssetsChapter';
import householdExpensesChapter from './chapters/householdExpensesChapter';
import resolutionOptionsChapter from './chapters/resolutionOptionsChapter';
import bankruptcyAttestationChapter from './chapters/bankruptcyAttestationChapter';
import {
  enhancedFSRFeatureToggle,
  combinedFSRFeatureToggle,
} from '../utils/helpers';

export const buildFormConfig = () => {
  const APPLICATION_NAME = 'Your application for financial hardship assistance';
  const messagesConfig = {
    savedFormMessages: {
      notFound: `Please start over to submit an application for ${APPLICATION_NAME}.`,
      noAuth: `Please sign in again to continue ${APPLICATION_NAME}.`,
    },
    saveInProgress: {
      messages: {
        inProgress: `${APPLICATION_NAME} is in progress.`,
        expired: `${APPLICATION_NAME} has expired. If you want to submit a application for ${APPLICATION_NAME}, please start a new application.`,
        saved: `${APPLICATION_NAME} has been saved.`,
      },
    },
  };

  let chaptersConfig;

  if (enhancedFSRFeatureToggle) {
    chaptersConfig = {
      chapters: {
        bankruptcyAttestationChapter,
        resolutionOptionsChapter,
        householdExpensesChapter,
        householdAssetsChapter,
        householdIncomeChapter,
        veteranInformationChapter,
      },
    };
  } else if (combinedFSRFeatureToggle) {
    chaptersConfig = {
      chapters: {
        veteranInformationChapter,
        resolutionOptionsChapter,
        bankruptcyAttestationChapter,
      },
    };
  } else {
    chaptersConfig = {
      chapters: {
        veteranInformationChapter,
        householdIncomeChapter,
        householdAssetsChapter,
        householdExpensesChapter,
        resolutionOptionsChapter,
        bankruptcyAttestationChapter,
      },
    };
  }

  return {
    // All your other formConfig properties...
    ...messagesConfig,
    ...chaptersConfig,
  };
};
