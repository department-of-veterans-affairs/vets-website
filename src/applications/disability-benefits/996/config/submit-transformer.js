import { DEFAULT_BENEFIT_TYPE } from '../constants';

import {
  getRep,
  getConferenceTimes,
  getContestedIssues,
  getContact,
  getAddress,
  getPhone,
  getTimeZone,
} from '../utils/submit';

export function transform(formConfig, form) {
  // https://dev-developer.va.gov/explore/appeals/docs/decision_reviews?version=current
  const mainTransform = formData => {
    const version = formData.hlrV2 ? 2 : 1;
    const informalConference = formData.informalConference !== 'no';
    const attributes = {
      // This value may empty if the user restarts the form; see
      // va.gov-team/issues/13814
      benefitType: formData.benefitType || DEFAULT_BENEFIT_TYPE,
      informalConference,
      // informalConferenceRep & informalConferenceTimes are added below

      veteran: {
        timezone: getTimeZone(),
        address: getAddress(formData, version),
      },
    };

    if (version === 1) {
      attributes.sameOffice = formData.sameOffice || false;
    }
    if (version > 1) {
      attributes.veteran.homeless = formData.homeless;
      attributes.veteran.phone = getPhone(formData);
      attributes.veteran.email = formData?.veteran.email;
    }

    // Add informal conference data
    if (informalConference) {
      attributes.informalConferenceTimes = getConferenceTimes(
        formData,
        version,
      );
      if (formData.informalConference === 'rep') {
        attributes.informalConferenceRep = getRep(formData, version);
      }
      if (version > 1) {
        attributes.informalConferenceContact = getContact(formData);
      }
    }

    return {
      data: {
        type: 'higherLevelReview',
        attributes,
      },
      included: getContestedIssues(formData),
    };
  };

  // Not using _.cloneDeep on form data - it appears to replace `null` values
  // with an empty object; and causes submission errors due to type mismatch
  const transformedData = mainTransform(form.data);
  return JSON.stringify(transformedData);
}
