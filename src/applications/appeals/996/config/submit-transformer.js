import { DEFAULT_BENEFIT_TYPE } from '../constants';

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

import { showNewHlrContent } from '../utils/helpers';

export function transform(formConfig, form) {
  // https://dev-developer.va.gov/explore/appeals/docs/decision_reviews?version=current
  const mainTransform = formData => {
    const informalConference = showNewHlrContent(formData)
      ? formData.informalConferenceChoice === 'yes'
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
      // HLR v2.5 gives no choice; default to true (when feature toggle enabled)
      // Lighthouse v2 & v2.5 has this value as required
      socOptIn: showNewHlrContent(formData) || formData.socOptIn,
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
