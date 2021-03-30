import { SELECTED } from '../constants';

export function transform(formConfig, form) {
  // We require the user to input a 10-digit number; assuming we get a 3-digit
  // area code + 7 digit number. We're not yet supporting international numbers
  const getPhoneNumber = (phone = '') => ({
    countryCode: '1',
    areaCode: phone.substring(0, 3),
    phoneNumber: phone.substring(3),
    // Empty string/null are not permitted values
    // phoneNumberExt: '',
  });

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

  // https://dev-developer.va.gov/explore/appeals/docs/decision_reviews?version=current
  const mainTransform = formData => ({
    data: {
      type: 'noticeOfDisagreement',
      attributes: {
        veteran: {
          timezone: getTimeZone(),
          address: formData.veteran.address,
          phone: getPhoneNumber(formData.veteran.phone),
          emailAddressText: formData.veteran.email,
          homeless: formData.homeless,
        },

        boardReviewOption: formData.boardReviewOption,
        hearingTypePreference: formData.hearingTypePreference,
        timezone: getTimeZone(),
        socOptIn: true,
      },
    },
    included: getContestedIssues(formData),
  });

  // Not using _.cloneDeep on form data - it appears to replace `null` values
  // with an empty object; and causes submission errors due to type mismatch
  const transformedData = mainTransform(form.data);
  return JSON.stringify(transformedData);
}
