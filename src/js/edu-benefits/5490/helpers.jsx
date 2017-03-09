import _ from 'lodash/fp';
import { transformForSubmit } from '../../common/schemaform/helpers';

export function transform(formConfig, form) {
  // Flatten claimedSponsorService; it was grouped like this to get expandUnder
  //  working properly, but now we need to flatten and remove it before sending
  //  to the api.
  const modifiedForm = _.set('benefitSelection.data.previousBenefits', {
    ...form.benefitSelection.data.previousBenefits.claimedSponsorService
  }, form);
  delete modifiedForm.benefitSelection.data.previousBenefits.claimedSponsorService;

  const formData = transformForSubmit(formConfig, form);
  return JSON.stringify({
    educationBenefitsClaim: {
      form: formData
    }
  });
}

export const benefitsLabels = {
  chapter35: 'DEA (Chapter 35)',
  chapter33: 'Fry scholarship (Chapter 33)'
};

export const relationshipLabels = {
  child: 'Child, stepchild, adopted child',
  spouse: 'Spouse or Surviving Spouse',
};
