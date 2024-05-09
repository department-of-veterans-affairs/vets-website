import sharedTransformForSubmit from '../../shared/config/submit-transformer';
import { PREPARER_TYPES } from './constants';

export default function transformForSubmit(formConfig, form) {
  const hasReceivedMedicalTreatment =
    form?.data?.['view:hasReceivedMedicalTreatment'];

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

  if (!hasReceivedMedicalTreatment && transformedData.medicalTreatments) {
    delete transformedData.medicalTreatments;
  }

  // TODO: Once PDF has been updated to remove OCR-boxes,
  // remove this name-values truncation-block below.
  if (
    preparerType === PREPARER_TYPES.VETERAN ||
    preparerType === PREPARER_TYPES.THIRD_PARTY_VETERAN
  ) {
    const { first, middle, last } = transformedData.veteranFullName;
    if (middle) {
      transformedData.veteranFullName = {
        first: first.slice(0, 12),
        middle: middle.charAt(0),
        last: last.slice(0, 18),
      };
    } else {
      transformedData.veteranFullName = {
        first: first.slice(0, 12),
        last: last.slice(0, 18),
      };
    }
  } else {
    const { first, middle, last } = transformedData.nonVeteranFullName;
    if (middle) {
      transformedData.nonVeteranFullName = {
        first: first.slice(0, 12),
        middle: middle.charAt(0),
        last: last.slice(0, 18),
      };
    } else {
      transformedData.nonVeteranFullName = {
        first: first.slice(0, 12),
        last: last.slice(0, 18),
      };
    }
  }

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
    // veteran personal- & identification data still required
    delete transformedData.veteranMailingAddress;
    delete transformedData.veteranPhone;
    delete transformedData.veteranEmailAddress;
  }

  // TODO: Once PDF has been updated to remove OCR-boxes,
  // remove this address-values truncation-block below.
  if (
    preparerType === PREPARER_TYPES.VETERAN &&
    transformedData.veteranMailingAddress
  ) {
    const { street, street2, city } = transformedData.veteranMailingAddress;
    transformedData.veteranMailingAddress.street = street.slice(0, 30);
    if (street2) {
      transformedData.veteranMailingAddress.street2 = street2.slice(0, 5);
    }
    transformedData.veteranMailingAddress.city = city.slice(0, 20);
  }
  if (
    preparerType === PREPARER_TYPES.NON_VETERAN &&
    transformedData.nonVeteranMailingAddress
  ) {
    const { street, street2, city } = transformedData.nonVeteranMailingAddress;
    transformedData.nonVeteranMailingAddress.street = street.slice(0, 30);
    if (street2) {
      transformedData.nonVeteranMailingAddress.street2 = street2.slice(0, 5);
    }
    transformedData.nonVeteranMailingAddress.city = city.slice(0, 20);
  }

  // delete unneeded otherHousingRisks data based on livingSituation
  if (!transformedData.livingSituation.OTHER_RISK) {
    delete transformedData.otherHousingRisks;
  }

  // delete any unneeded evidence form-data based on otherReasons
  Object.keys(otherReasonsEvidenceData).forEach(key => {
    // if otherReasons[key] is not selected, delete corresponding evidence form-data
    if (!otherReasons?.[key]) {
      if (otherReasonsEvidenceData[key] instanceof Array) {
        otherReasonsEvidenceData[key].forEach(dataKey => {
          delete transformedData[dataKey];
        });
      } else {
        delete transformedData[otherReasonsEvidenceData[key]];
      }
    }
  });

  return JSON.stringify(transformedData);
}
