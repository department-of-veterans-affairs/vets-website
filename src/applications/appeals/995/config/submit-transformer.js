import {
  addIncludedIssues,
  getAddress,
  getClaimantData,
  getPhone,
  getTimeZone,
  getEvidence,
  getForm4142,
} from '../utils/submit';

import { EVIDENCE_OTHER } from '../constants';

export function transform(formConfig, form) {
  // https://developer.va.gov/explore/appeals/docs/decision_reviews?version=current
  // match supplemental claims schema here
  const mainTransform = formData => {
    const { veteran, benefitType, socOptIn, additionalDocuments } = formData;

    const attributes = {
      benefitType,
      ...getClaimantData(formData),

      veteran: {
        timezone: getTimeZone(),
        address: getAddress(formData),
        phone: getPhone(formData),
        email: veteran?.email || '',
      },
      ...getEvidence(formData),
      socOptIn,
    };

    return {
      data: {
        type: 'supplementalClaim',
        attributes,
      },
      included: addIncludedIssues(formData),
      form4142: getForm4142(formData),
      additionalDocuments: formData[EVIDENCE_OTHER] ? additionalDocuments : [],
    };
  };

  // Not using _.cloneDeep on form data - it appears to replace `null` values
  // with an empty object; and causes submission errors due to type mismatch
  const transformedData = mainTransform(form.data);
  return JSON.stringify(transformedData);
}
