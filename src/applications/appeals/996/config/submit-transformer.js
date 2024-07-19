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
    const informalConference = formData.informalConference !== 'no';
    const attributes = {
      // This value may empty if the user restarts the form; see
      // va.gov-team/issues/13814
      benefitType: formData.benefitType || DEFAULT_BENEFIT_TYPE,
      informalConference,
      // informalConferenceRep & informalConferenceTimes are added below

      veteran: {
        timezone: getTimeZone(),
        address: getAddress(formData),
        homeless: formData.homeless,
        phone: getPhone(formData),
        email: formData.veteran?.email || '',
      },
      // Newer HLR gives no choice; defaulting to true until new Lighthouse API
      // is ready
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
