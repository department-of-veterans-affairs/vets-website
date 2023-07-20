import veteranInformationChapter from './veteranInformationChapter';
import householdIncomeChapter from './householdIncomeChapter';
import householdAssetsChapter from './householdAssetsChapter';
import householdExpensesChapter from './householdExpensesChapter';
import resolutionOptionsChapter from './resolutionOptionsChapter';
import bankruptcyAttestationChapter from './bankruptcyAttestationChapter';
import {
  streamlinedWaiverFeatureToggle,
  enhancedFSRFeatureToggle,
} from '../../utils/helpers';

export const formFlows = {
  'Below GMT': [
    veteranInformationChapter,
    householdIncomeChapter,
    householdAssetsChapter,
  ],
  'Above GMT,   Below 150% of GMT': [
    veteranInformationChapter,
    householdIncomeChapter,
    householdAssetsChapter,
    householdExpensesChapter,
  ],
  'Above 150% of GMT': [
    veteranInformationChapter,
    householdIncomeChapter,
    householdAssetsChapter,
    householdExpensesChapter,
    resolutionOptionsChapter,
    bankruptcyAttestationChapter,
  ],
};

export const buildForm = () => {
  let chaptersConfig = {};
  if (streamlinedWaiverFeatureToggle) {
    chaptersConfig = {
      ...veteranInformationChapter,
      ...householdIncomeChapter,
      ...householdAssetsChapter,
    };
  } else if (enhancedFSRFeatureToggle) {
    chaptersConfig = {
      ...veteranInformationChapter,
      ...householdIncomeChapter,
      ...householdAssetsChapter,
      ...householdExpensesChapter,
      ...resolutionOptionsChapter,
      ...bankruptcyAttestationChapter,
    };
  } else {
    // return an empty object instead of null
    chaptersConfig = {};
  }

  return chaptersConfig;
};
