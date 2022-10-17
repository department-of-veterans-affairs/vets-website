import {
  addIncludedIssues,
  getAddress,
  getPhone,
  getTimeZone,
  getEvidence,
} from '../utils/submit';

export function transform(formConfig, form) {
  // https://developer.va.gov/explore/appeals/docs/decision_reviews?version=current
  // match supplemental claims schema here
  const mainTransform = formData => {
    const {
      veteran,
      benefitType,
      claimantType,
      claimantTypeOtherValue,
      socOptIn,
    } = formData;

    const attributes = {
      benefitType,
      claimantType,

      veteran: {
        timezone: getTimeZone(),
        address: getAddress(formData),
        // homeless: formData.homeless,
        phone: getPhone(formData),
        email: veteran?.email || '',
      },
      evidenceSubmission: getEvidence(formData),
      socOptIn,
    };

    if (claimantType === 'other' && claimantTypeOtherValue) {
      attributes.claimantTypeOtherValue = claimantTypeOtherValue;
    }

    const included = addIncludedIssues(formData);

    return {
      data: {
        type: 'supplementalClaim',
        attributes,
      },
      included,
    };
  };

  // Not using _.cloneDeep on form data - it appears to replace `null` values
  // with an empty object; and causes submission errors due to type mismatch
  const transformedData = mainTransform(form.data);
  return JSON.stringify(transformedData);
}
