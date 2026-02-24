import { transformForSubmit } from 'platform/forms-system/src/js/helpers';
import { format } from 'date-fns-tz';
import {
  calculateSeparationDuration,
  splitVaSsnField,
  switchToInternationalPhone,
  updateBankValues,
  transformCareExpenses,
  combineTreatmentFacility,
  updateFullNames,
  combineUnitNameAddress,
  buildUnitAddress,
  chapter4Transform,
  checkForHowMarriageEnded,
  transformClaim,
  autoPopulateMarriageEndDate,
} from '../utils/transformers';

export const transform = (formConfig, form) => {
  // Check if feature flag for combining unit name and address is enabled
  const use2025Version = form?.data?.survivorsBenefitsForm2025VersionEnabled;

  let transformedData = transformForSubmit(formConfig, form);
  transformedData = calculateSeparationDuration(transformedData);
  transformedData = splitVaSsnField(transformedData);
  transformedData = switchToInternationalPhone(transformedData);
  transformedData = updateBankValues(transformedData);
  transformedData = transformCareExpenses(transformedData);
  transformedData = combineTreatmentFacility(transformedData);
  transformedData = updateFullNames(transformedData);

  // Use feature flag to determine which transformer to apply
  transformedData = use2025Version
    ? buildUnitAddress(transformedData)
    : combineUnitNameAddress(transformedData);

  transformedData = chapter4Transform(transformedData);
  transformedData = autoPopulateMarriageEndDate(transformedData);
  transformedData = checkForHowMarriageEnded(transformedData);
  transformedData = transformClaim(transformedData);
  return JSON.stringify({
    survivorsBenefitsClaim: {
      form: transformedData,
    },
    localTime: format(new Date(), "yyyy-MM-dd'T'HH:mm:ssXXX"),
  });
};
