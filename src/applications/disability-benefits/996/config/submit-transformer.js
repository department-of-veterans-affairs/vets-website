import {
  DEFAULT_BENEFIT_TYPE,
  SELECTED,
  CONFERENCE_TIMES_V1,
  CONFERENCE_TIMES_V2,
} from '../constants';

export function transform(formConfig, form) {
  // We require the user to input a 10-digit number; assuming we get a 3-digit
  // area code + 7 digit number. We're not yet supporting international numbers
  const getPhoneNumber = (phone = '') => ({
    country: '1',
    areaCode: phone.substring(0, 3),
    phoneNumber: phone.substring(3),
    // Empty string/null are not permitted values
    // phoneNumberExt: '',
  });

  const getRep = (formData, version) => {
    if (version === 1) {
      return formData.informalConference === 'rep'
        ? {
            name: formData?.informalConferenceRep?.name,
            phone: getPhoneNumber(formData?.informalConferenceRep?.phone),
          }
        : null;
    }
    return formData.informalConference === 'rep'
      ? {
          firstName: formData?.informalConferenceRep?.firstName,
          lastName: formData?.informalConferenceRep?.lastName,
          phone: getPhoneNumber(formData?.informalConferenceRep?.phone),
        }
      : null;
  };

  const getConferenceTimes = ({ informalConferenceTimes = [] }, version) => {
    const times = version === 1 ? CONFERENCE_TIMES_V1 : CONFERENCE_TIMES_V2;
    const xRef = Object.keys(times).reduce(
      (timesAndApi, time) => ({
        ...timesAndApi,
        [time]: times[time].submit,
      }),
      {},
    );

    return ['time1', 'time2'].reduce((setTimes, key) => {
      const value = informalConferenceTimes[key] || '';
      if (value) {
        setTimes.push(xRef[value]);
      }
      return setTimes;
    }, []);
  };

  const getTimeZone = () =>
    // supports IE11
    // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/DateTimeFormat/resolvedOptions
    Intl.DateTimeFormat().resolvedOptions().timeZone;

  const getIssueName = ({ attributes } = {}) => {
    const {
      ratingIssueSubjectText,
      ratingIssuePercentNumber,
      description,
    } = attributes;
    return [
      ratingIssueSubjectText,
      `${ratingIssuePercentNumber || '0'}%`,
      description,
    ]
      .filter(part => part)
      .join(' - ')
      .substring(0, 140);
  };

  /* submitted contested issue format
  [{
    "type": "contestableIssue",
    "attributes": {
      "issue": "tinnitus - 10% - some longer description",
      "decisionDate": "1900-01-01",
      "decisionIssueId": 1,
      "ratingIssueReferenceId": "2",
      "ratingDecisionReferenceId": "3"
    }
  }]
  */
  const getContestedIssues = ({ contestedIssues = [] }) =>
    contestedIssues.filter(issue => issue[SELECTED]).map(issue => {
      const attr = issue.attributes;
      const attributes = [
        'decisionIssueId',
        'ratingIssueReferenceId',
        'ratingDecisionReferenceId',
      ].reduce(
        (acc, key) => {
          // Don't submit null or empty strings
          if (attr[key]) {
            acc[key] = attr[key];
          }
          return acc;
        },
        {
          issue: getIssueName(issue),
          decisionDate: attr.approxDecisionDate,
        },
      );

      return {
        // type: "contestableIssues"
        type: issue.type,
        attributes,
      };
    });

  const getContact = ({ informalConference }) => {
    if (informalConference === 'rep') {
      return 'representative';
    }
    if (informalConference === 'me') {
      return 'veteran';
    }
    return '';
  };

  // https://dev-developer.va.gov/explore/appeals/docs/decision_reviews?version=current
  const mainTransform = formData => {
    const version = formData.hlrV2 ? 2 : 1;
    const informalConference = formData.informalConference !== 'no';
    const zipCode5 = formData.zipCode5 || formData.veteran?.zipCode5 || '00000';
    const result = {
      data: {
        type: 'higherLevelReview',
        attributes: {
          // This value may empty if the user restarts the form
          // See va.gov-team/issues/13814
          benefitType: formData.benefitType || DEFAULT_BENEFIT_TYPE,
          informalConference,

          veteran: {
            timezone: getTimeZone(),
            address: {
              // EVSS has very restrictive address rules; so Lighthouse API will
              // submit something like "use address on file"
              // TODO: postalCode vs zipCode?
              zipCode5,
            },
            // ** phone & email are optional **
            // phone: getPhoneNumber(formData?.primaryPhone),
            // emailAddressText: formData?.emailAddress,
          },

          // informalConferenceRep & informalConferenceTimes are added below
        },
      },
      included: getContestedIssues(formData),
    };

    if (version === 1) {
      result.data.attributes.sameOffice = formData.sameOffice || false;
    }
    if (version > 1) {
      result.data.attributes.veteran.homeless = formData.homeless;
    }

    // Add informal conference data
    if (informalConference) {
      result.data.attributes.informalConferenceTimes = getConferenceTimes(
        formData,
        version,
      );
      if (formData.informalConference === 'rep') {
        result.data.attributes.informalConferenceRep = getRep(
          formData,
          version,
        );
      }
      if (version > 1) {
        result.data.attributes.informalConferenceContact = getContact(formData);
      }
    }

    return result;
  };

  // Not using _.cloneDeep on form data - it appears to replace `null` values
  // with an empty object; and causes submission errors due to type mismatch
  const transformedData = mainTransform(form.data);
  return JSON.stringify(transformedData);
}
