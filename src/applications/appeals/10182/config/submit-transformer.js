import {
  addIncludedIssues,
  addUploads,
  getAddress,
  getEmail,
  getPart3Data,
} from '../utils/submit';

import {
  addAreaOfDisagreement,
  getPhone,
  getTimeZone,
} from '../../shared/utils/submit';

export function transform(formConfig, form) {
  // https://dev-developer.va.gov/explore/appeals/docs/decision_reviews?version=current
  // https://github.com/department-of-veterans-affairs/vets-api/blob/master/modules/appeals_api/config/schemas/10182.json
  const mainTransform = formData => {
    const result = {
      data: {
        type: 'noticeOfDisagreement',
        attributes: {
          veteran: {
            homeless: formData.homeless || false,
            address: getAddress(formData),
            phone: getPhone(formData),
            ...getEmail(formData),
          },
          boardReviewOption: formData.boardReviewOption || '',
          hearingTypePreference: formData.hearingTypePreference || '',
          timezone: getTimeZone(),
          socOptIn: false,
          ...getPart3Data(formData),
        },
      },
      included: addAreaOfDisagreement(addIncludedIssues(formData), formData),
      nodUploads: addUploads(formData),
    };
    if (formData.boardReviewOption !== 'hearing') {
      delete result.data.attributes.hearingTypePreference;
    }
    return result;
  };

  // Not using _.cloneDeep on form data - it appears to replace `null` values
  // with an empty object; and causes submission errors due to type mismatch
  const transformedData = mainTransform(form.data || {});
  return JSON.stringify(transformedData);
}
