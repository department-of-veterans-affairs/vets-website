import React from 'react';

import { getIssueName, getIssueDate } from '../utils/issues';
import {
  DISAGREEMENT_TYPES,
  FORMAT_YMD_DATE_FNS,
  FORMAT_READABLE_DATE_FNS,
} from '../constants';

import { parseDate } from '../utils/dates';

export const errorMessages = {
  maxOtherEntry: max => `This field should be less than ${max} characters`,
  missingDisagreement: 'You must select or enter a reason for disagreement',
};

export const content = {
  disagreementLegend:
    'Tell us what you disagree with. You can choose more than one.',
  disagreementHint: 'I disagree with this:',
  otherEntryHint: 'Explain in a few words',
  edit: 'Edit',
  update: 'Update page',
};

/**
 * Title for review & submit page, text string returned
 * @param {*} data - item data (contestable issue or added issue)
 * @param {object} formContext - overloaded formContext
 * @returns {String} - ObjectField error if not a string
 */
export const getIssueTitle = (data = {}, { plainText } = {}) => {
  const prefix = 'Disagreement with ';
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
      <span
        className="dd-privacy-hidden word-break-all"
        data-dd-action-name="issue name"
      >
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
  const Header = props.onReviewPage ? 'h4' : 'h3';
  const index = props.data?.index || '0';
  return (
    <Header
      id={`disagreement-title-${index}`}
      className="vads-u-margin-top--0 schemaform-title-underline"
    >
      {getIssueTitle(props.data)}
    </Header>
  );
};

// Only show set values (ignore false & undefined)
export const AreaOfDisagreementReviewField = ({ children }) => {
  const { formData, name } = children?.props || {};
  const hidden = name === 'otherEntry';
  return formData ? (
    <div className="review-row">
      <dt>{DISAGREEMENT_TYPES[name]}</dt>
      <dd
        className={hidden ? 'dd-privacy-hidden' : ''}
        data-dd-action-name={hidden ? 'something else' : ''}
      >
        {children}
      </dd>
    </div>
  ) : null;
};
