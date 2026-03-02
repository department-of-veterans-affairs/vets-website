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
  chapter4Transform,
  checkForHowMarriageEnded,
  transformClaim,
} from '../utils/transformers';

export const transform = (formConfig, form) => {
  let transformedData = transformForSubmit(formConfig, form);
  transformedData = calculateSeparationDuration(transformedData);
  transformedData = splitVaSsnField(transformedData);
  transformedData = switchToInternationalPhone(transformedData);
  transformedData = updateBankValues(transformedData);
  transformedData = transformCareExpenses(transformedData);
  transformedData = combineTreatmentFacility(transformedData);
  transformedData = updateFullNames(transformedData);
  transformedData = combineUnitNameAddress(transformedData);
  transformedData = chapter4Transform(transformedData);
  transformedData = checkForHowMarriageEnded(transformedData);
  transformedData = transformClaim(transformedData);
  return JSON.stringify({
    survivorsBenefitsClaim: {
      form: transformedData,
    },
    localTime: format(new Date(), "yyyy-MM-dd'T'HH:mm:ssXXX"),
  });
};
