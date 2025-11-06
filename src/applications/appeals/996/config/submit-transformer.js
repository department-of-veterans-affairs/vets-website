import { DEFAULT_BENEFIT_TYPE } from '../../shared/constants';

import {
  getAddress,
  getConferenceTime, // v2
  getContact,
  getRep,
} from '../utils/submit';

import {
  addAreaOfDisagreement,
  addIncludedIssues,
  getPhone,
  getTimeZone,
} from '../../shared/utils/submit';

export function transform(formConfig, form) {
  // https://dev-developer.va.gov/explore/appeals/docs/decision_reviews?version=current
  const mainTransform = formData => {
    const { informalConferenceChoice } = formData;
    // v2 value may still be in the save-in-progress form data (informalConference)
    const informalConference = ['yes', 'no'].includes(informalConferenceChoice)
      ? informalConferenceChoice === 'yes'
      : ['me', 'rep'].includes(formData.informalConference);
    const attributes = {
      // This value may empty if the user restarts the form; see
      // va.gov-team/issues/13814
      benefitType: formData.benefitType || DEFAULT_BENEFIT_TYPE,
      informalConference,
      // informalConferenceRep & informalConferenceTimes are added below

      veteran: {
        timezone: getTimeZone(),
        address: getAddress(formData),
        homeless: formData.homeless || false,
        phone: getPhone(formData),
        email: formData.veteran?.email || '',
      },
      // HLR v2.5 gives no opt-in choice; default to true
      // Lighthouse v2 & v2.5 has this value as required
      socOptIn: true,
    };

    const included = addAreaOfDisagreement(
      addIncludedIssues(formData),
      formData,
    );

    // Add informal conference data
    if (informalConference) {
      attributes.informalConferenceTime = getConferenceTime(formData);
      if (formData.informalConference === 'rep') {
        attributes.informalConferenceRep = getRep(formData);
      }
      attributes.informalConferenceContact = getContact(formData);
    }

    return {
      data: {
        type: 'higherLevelReview',
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
