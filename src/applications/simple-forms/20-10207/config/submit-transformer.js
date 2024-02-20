import sharedTransformForSubmit from '../../shared/config/submit-transformer';
import livingSituation from '../pages/livingSituation';

import { PREPARER_TYPES } from './constants';

export default function transformForSubmit(formConfig, form) {
  const transformedData = JSON.parse(
    sharedTransformForSubmit(formConfig, form),
  );
  const { preparerType, otherReasons } = transformedData;
  const otherReasonsEvidenceData = {
    // hash-mapping of otherReasons-keys to evidence form-data
    // otherReasons-keys not listed here don't have any related data
    FINANCIAL_HARDSHIP: 'financialHardshipDocuments',
    ALS: 'alsDocuments',
    TERMINAL_ILLNESS: 'terminalIllnessDocuments',
    VSI_SI: 'vsiDocuments',
    FORMER_POW: [
      'powConfinementStartDate',
      'powConfinementEndDate',
      'powMultipleConfinements',
      'powConfinement2StartDate',
      'powConfinement2EndDate',
      'powDocuments',
    ],
    MEDAL_AWARD: 'medalAwardDocuments',
  };

  // delete third-party form-data based on preparerType
  if (
    preparerType === PREPARER_TYPES.VETERAN ||
    preparerType === PREPARER_TYPES.NON_VETERAN
  ) {
    delete transformedData.thirdPartyFullName;
    delete transformedData.thirdPartyType;
  }

  // delete any unneeded personal, identification, & contact form-data based on preparerType
  if (
    preparerType === PREPARER_TYPES.VETERAN ||
    preparerType === PREPARER_TYPES.THIRD_PARTY_VETERAN
  ) {
    delete transformedData.nonVeteranFullName;
    delete transformedData.nonVeteranDateOfBirth;
    delete transformedData.nonVeteranId;
    delete transformedData.nonVeteranMailingAddress;
    delete transformedData.nonVeteranPhone;
    delete transformedData.nonVeteranEmailAddress;
  } else {
    delete transformedData.veteranFullName;
    delete transformedData.veteranDateOfBirth;
    delete transformedData.veteranId;
    delete transformedData.veteranMailingAddress;
    delete transformedData.veteranPhone;
    delete transformedData.veteranEmailAddress;
  }

  // delete unneeded otherHousingRisks data based on livingSituation
  if (!livingSituation.OTHER_RISK) {
    delete transformedData.otherHousingRisks;
  }

  // delete any unneeded evidence form-data based on otherReasons
  Object.keys(otherReasonsEvidenceData).forEach(key => {
    // if otherReasons[key] is not selected, delete corresponding evidence form-data
    if (!otherReasons[key]) {
      if (otherReasonsEvidenceData[key] instanceof Array) {
        otherReasonsEvidenceData[key].forEach(dataKey => {
          delete transformedData[dataKey];
        });
      } else {
        delete transformedData[otherReasonsEvidenceData[key]];
      }
    }
  });

  return sharedTransformForSubmit(formConfig, form);
}
