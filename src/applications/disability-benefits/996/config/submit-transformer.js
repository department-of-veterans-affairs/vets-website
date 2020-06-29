import _ from 'platform/utilities/data';

export function transform(formConfig, form) {
  // We require the user to input a 10-digit number; assuming we get a 3-digit
  // area code + 7 digit number. We're not yet supporting international numbers
  const getPhoneNumber = phone => ({
    countryCode: '1',
    areaCode: phone.substring(0, 3),
    phoneNumber: phone.substring(3),
    phoneNumberExt: '',
  });

  const getRep = formData =>
    formData.informalConference === 'rep'
      ? {
          name: formData.informalConferenceRep.name,
          phone: getPhoneNumber(formData.informalConferenceRep.phone),
        }
      : null;

  const getConferenceTimes = ({ informalConferenceTimes }) => {
    const xRef = {
      // formData name: api value
      time0800to1000: '800-1000 ET',
      time1000to1200: '1000-1200 ET',
      time1230to1400: '1230-1400 ET',
      time1400to1630: '1400-1630 ET',
    };
    return Object.keys(informalConferenceTimes).reduce((times, key) => {
      if (informalConferenceTimes[key]) {
        times.push(xRef[key]);
      }
      return times;
    }, []);
  };

  const getTimeZone = () =>
    // supports IE11
    // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/DateTimeFormat/resolvedOptions
    Intl.DateTimeFormat().resolvedOptions().timeZone;

  const getToday = () => new Date().toISOString().split('T')[0];

  const capitalize = text => `${text[0].toUpperCase()}${text.slice(1)}`;

  /* submitted contested issue format
  [{
    "type": "ContestableIssue",
    "attributes": {
      "issue": "tinnitus - 10",
      "decisionDate": "1900-01-01",
      "decisionIssueId": 1,
      "ratingIssueId": "2",
      "ratingDecisionIssueId": "3"
    }
  }]
  */
  const getContestedIssues = ({ contestedIssues }) => {
    const issueTransform = {
      issue: issue => {
        const hasPercentage = issue?.ratingIssuePercentNumber
          ? ` - ${issue.ratingIssuePercentNumber}%`
          : '';
        return `${issue.ratingIssueSubjectText}${hasPercentage}`;
      },
      decisionDate: issue => issue.approxDecisionDate,
      decisionIssueId: issue => issue.decisionIssueId,
      ratingIssueId: issue => issue.ratingIssueReferenceId,
      ratingDecisionIssueId: issue => issue.ratingDecisionReferenceId,
    };
    const getAttributes = (issue = {}) =>
      Object.keys(issueTransform).reduce((acc, key) => {
        const value = issueTransform[key](issue);
        if (value) {
          acc[key] = value;
        }
        return acc;
      }, {});

    return contestedIssues
      .filter(issue => issue['view:selected'])
      .map(issue => ({
        // type: "ContestableIssues" needs a capital "C"
        type: capitalize(issue.type),
        attributes: getAttributes(issue.attributes),
      }));
  };

  // https://dev-developer.va.gov/explore/appeals/docs/decision_reviews?version=current
  const mainTransform = formData => {
    const informalConference = formData.informalConference !== 'no';
    const result = {
      data: {
        type: 'HigherLevelReview',
        attributes: {
          // Only supporting "compensation" in this MVP
          benefitType: 'compensation',
          receiptDate: getToday(),
          timezone: getTimeZone(),
          informalConference,
          sameOffice: formData.sameOffice,

          veteran: {
            address: {
              // EVSS has very restrictive address rules; so Lighthouse API will
              // submit something like "use address on file"
              // TODO: postalCode vs zipCode?
              zipCode5: formData.veteran?.zipPostalCode,
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

    // Add informal conference data
    if (informalConference) {
      result.data.attributes.informalConferenceTimes = getConferenceTimes(
        formData,
      );
      if (formData.informalConference === 'rep') {
        result.data.attributes.informalConferenceRep = getRep(formData);
      }
    }

    return result;
  };
  // console.log(form);
  const transformedData = mainTransform(_.cloneDeep(form.data));
  // console.log('transformed data', JSON.stringify(transformedData));
  return JSON.stringify(transformedData);
}
