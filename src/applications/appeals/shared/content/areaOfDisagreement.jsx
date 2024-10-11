import React from 'react';
import PropTypes from 'prop-types';

import { getIssueName, getIssueDate } from '../utils/issues';
import { FORMAT_YMD_DATE_FNS, FORMAT_READABLE_DATE_FNS } from '../constants';

import { parseDate } from '../utils/dates';
import { disagreeWith } from '../utils/areaOfDisagreement';

export const errorMessages = {
  maxOtherEntry: max => `This field should be less than ${max} characters`,
  missingDisagreement: 'You must select or enter a reason for disagreement',
};

export const content = {
  disagreementLegend:
    'Tell us which part of the decision you disagree with. Select all that you disagree with.',
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
export const AreaOfDisagreementReviewField = props => {
  const { defaultEditButton, formData } = props;

  if (!getIssueName(formData)) {
    return null;
  }

  // Not using props.title since it's a React component and can't be used in the
  // edit button label
  const plainTitle = getIssueTitle(formData, { plainText: true });
  const list = disagreeWith(formData, { prefix: '' });
  return (
    <>
      <div className="form-review-panel-page-header-row">
        <h4 className="form-review-panel-page-header vads-u-font-size--h5">
          {plainTitle}
        </h4>
        <div className="vads-u-justify-content--flex-end">
          {defaultEditButton({ label: `Edit ${plainTitle}` })}
        </div>
      </div>
      <dl className="review">
        <div className="review-row">
          <dt>What you disagree with</dt>
          <dd
            className="dd-privacy-hidden"
            data-dd-action-name="Areas of disagreement"
          >
            {list}
          </dd>
        </div>
      </dl>
    </>
  );
};

AreaOfDisagreementReviewField.propTypes = {
  defaultEditButton: PropTypes.any,
  formData: PropTypes.shape({}),
};
