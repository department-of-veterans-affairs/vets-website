import React from 'react';
import PropTypes from 'prop-types';

import { getReadableDate } from '../utils/dates';
import { getIssueName, getIssueDate } from '../utils/issues';
import { showValueOrNotSelected } from '../utils/confirmation';
import { disagreeWith } from '../utils/areaOfDisagreement';

const ConfirmationIssues = ({ data }) => (
  <>
    <h3 className="vads-u-margin-top--2">Issues for review</h3>
    {/* Adding a `role="list"` to `ul` with `list-style: none` to work around
        a problem with Safari not treating the `ul` as a list. */}
    {/* eslint-disable-next-line jsx-a11y/no-redundant-roles */}
    <ul className="remove-bullets" role="list">
      {/* Specific items for NOD; will generalize for other forms in the future */}
      <li>
        <div className="page-title vads-u-color--gray">
          Are you requesting an extension?
        </div>
        <div
          className="page-value dd-privacy-hidden"
          data-dd-action-name="requesting an extension"
        >
          {showValueOrNotSelected(data.requestingExtension)}
        </div>
      </li>
      {data.requestingExtension && (
        <li>
          <div className="page-title vads-u-color--gray">
            Reason for extension
          </div>
          <div
            className="page-value dd-privacy-hidden"
            data-dd-action-name="reason for extension"
          >
            {data.extensionReason}
          </div>
        </li>
      )}
      <li>
        <div className="page-title vads-u-color--gray">
          Are you appealing denial of VA health care benefits?
        </div>
        <div
          className="page-value dd-privacy-hidden"
          data-dd-action-name="is appealing VHA benefits"
        >
          {showValueOrNotSelected(data.appealingVHADenial)}
        </div>
      </li>
      {/* List item that is common for all Decision Review forms */}
      <li>
        <div className="page-title vads-u-color--gray vads-u-margin-top--2">
          The issues you’re asking the board to review:
        </div>
        {/* Adding a `role="list"` to `ul` with `list-style: none` to work around
            a problem with Safari not treating the `ul` as a list. */}
        {/* eslint-disable-next-line jsx-a11y/no-redundant-roles */}
        <ul className="remove-bullets" role="list">
          {data.areaOfDisagreement?.map((issue, index) => (
            <li
              key={index}
              className="page-value dd-privacy-hidden"
              data-dd-action-name="issue name"
            >
              <strong className="capitalize overflow-wrap-word">
                {getIssueName(issue)}
              </strong>
              <div>Decision date: {getReadableDate(getIssueDate(issue))}</div>
              <div>{disagreeWith(issue)}</div>
            </li>
          ))}
        </ul>
      </li>
    </ul>
  </>
);

ConfirmationIssues.propTypes = {
  data: PropTypes.shape({
    appealingVHADenial: PropTypes.bool,
    areaOfDisagreement: PropTypes.arrayOf(PropTypes.shape({})),
    extensionReason: PropTypes.string,
    requestingExtension: PropTypes.bool,
  }),
};

export default ConfirmationIssues;
