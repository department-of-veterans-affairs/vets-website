import { transformForSubmit } from 'platform/forms-system/src/js/helpers';
import { format } from 'date-fns-tz';
import {
  calculateSeparationDuration,
  splitVaSsnField,
  switchToInternationalPhone,
  updateBankValues,
  transformCareExpenses,
  combineTreatmentFacility,
  truncateMiddleInitials,
  unnestOtherServiceNames,
  combineUnitNameAddress,
  chapter4Transform,
} from '../utils/transformers';

export const transform = (formConfig, form) => {
  let transformedData = transformForSubmit(formConfig, form);
  transformedData = calculateSeparationDuration(transformedData);
  transformedData = splitVaSsnField(transformedData);
  transformedData = switchToInternationalPhone(transformedData);
  transformedData = updateBankValues(transformedData);
  transformedData = transformCareExpenses(transformedData);
  transformedData = combineTreatmentFacility(transformedData);
  transformedData = truncateMiddleInitials(transformedData);
  transformedData = unnestOtherServiceNames(transformedData);
  transformedData = combineUnitNameAddress(transformedData);
  transformedData = chapter4Transform(transformedData);
  return JSON.stringify({
    survivorsBenefitsClaim: {
      form: transformedData,
    },
    localTime: format(new Date(), "yyyy-MM-dd'T'HH:mm:ssXXX"),
  });
};
