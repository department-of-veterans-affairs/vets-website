import { EVIDENCE_OTHER, SUPPORTED_BENEFIT_TYPES_LIST } from '../constants';
import {
  getAddress,
  getClaimantData,
  getEmail,
  getEvidence,
  getForm4142,
  getPhone,
} from '../utils/submit';

import { addIncludedIssues, getTimeZone } from '../../shared/utils/submit';

export function transform(formConfig, form) {
  // https://developer.va.gov/explore/appeals/docs/decision_reviews?version=current
  // match supplemental claims schema here
  const mainTransform = formData => {
    const { benefitType, additionalDocuments } = formData;

    const attributes = {
      // fall back to compensation; this will fix a few existing submission
      // with "other" benefit type set that are being rejected
      benefitType: SUPPORTED_BENEFIT_TYPES_LIST.includes(benefitType)
        ? benefitType
        : 'compensation',
      ...getClaimantData(formData),

      veteran: {
        timezone: getTimeZone(),
        address: getAddress(formData),
        phone: getPhone(formData),
        email: getEmail(formData),
      },
      ...getEvidence(formData),
      socOptIn: true, // OAR requested no checkbox
    };

    return {
      data: {
        type: 'supplementalClaim',
        attributes,
      },
      included: addIncludedIssues(formData),
      form4142: getForm4142(formData),
      additionalDocuments: formData[EVIDENCE_OTHER]
        ? additionalDocuments
        : null,
    };
  };

  // Not using _.cloneDeep on form data - it appears to replace `null` values
  // with an empty object; and causes submission errors due to type mismatch
  const transformedData = mainTransform(form.data);
  return JSON.stringify(transformedData);
}
