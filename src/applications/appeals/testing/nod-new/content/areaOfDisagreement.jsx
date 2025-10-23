import React from 'react';

import { getIssueName, getIssueDate } from '../../../shared/utils/issues';
import {
  FORMAT_YMD_DATE_FNS,
  FORMAT_READABLE_DATE_FNS,
} from '../../../shared/constants';

import { parseDate } from '../../../shared/utils/dates';

export const errorMessages = {
  maxOtherEntry: max => `This field should be less than ${max} characters`,
  missingDisagreement: 'Choose or enter a reason for disagreement',
};

export const content = {
  disagreementLegend:
    'Tell us what you disagree with. You can choose more than one.',
  otherEntry:
    'If you disagree with something other than the list above, tell us in a few words.',
  edit: 'Edit',
  update: 'Update page',
  additionalInfo: (
    <div className="vads-u-margin-top--4">
      <va-additional-info
        trigger="How can I add more information about my disagreement?"
        uswds
      >
        If you want to provide any additional information to VA, including why
        you believe that VA previously decided one or more issues incorrectly,
        you can do so on a following step.
      </va-additional-info>
    </div>
  ),
};

/**
 * Title for review & submit page, text string returned
 * @param {*} data - item data (contestable issue or added issue)
 * @param {object} formContext - overloaded formContext
 * @returns {String} - ObjectField error if not a string
 */
export const getIssueTitle = (data = {}, { plainText } = {}) => {
  const prefix = 'What is your disagreement with ';
  const joiner = ' decision on ';
  const name = getIssueName(data);
  const formattedDate = parseDate(
    getIssueDate(data),
    FORMAT_READABLE_DATE_FNS,
    FORMAT_YMD_DATE_FNS,
  );
  return plainText === true ? (
    [prefix, name, joiner, formattedDate].join('')
  ) : (
    <>
      {prefix}
      <span className="dd-privacy-hidden" data-dd-action-name="issue name">
        {name}
      </span>
      {joiner}
      <span
        className="dd-privacy-hidden"
        data-dd-action-name="issue decision date"
      >
        {formattedDate}
      </span>
    </>
  );
};

// This is used in the `ui:title`, but doesn't get called because we're using a
// CustomPage
export const issueTitle = (props = {}) => {
  // https://github.com/department-of-veterans-affairs/va.gov-team/issues/27096
  const Header = 'h1';
  const index = props.data?.index || '0';
  return (
    <Header id={`disagreement-title-${index}`} className="vads-u-margin-top--0">
      {getIssueTitle(props.data)}
    </Header>
  );
};
