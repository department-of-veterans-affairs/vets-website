import React from 'react';
import PropTypes from 'prop-types';

import { getReadableDate } from '../utils/dates';
import { getIssueName, getIssueDate } from '../utils/issues';
import { disagreeWith } from '../utils/areaOfDisagreement';

const ConfirmationIssues = ({ data, children = null }) => {
  return (
    <>
      <h3 className="vads-u-margin-top--2">Issues for review</h3>
      {/* Adding a `role="list"` to `ul` with `list-style: none` to work around
          a problem with Safari not treating the `ul` as a list. */}
      {/* eslint-disable-next-line jsx-a11y/no-redundant-roles */}
      <ul className="remove-bullets" role="list">
        {children}
        {/* List item that is common for all Decision Review forms */}
        <li>
          <div className="vads-u-margin-bottom--0p5 vads-u-color--gray vads-u-font-size--sm vads-u-margin-top--2">
            The issues you’re asking the board to review:
          </div>
          {/* Adding a `role="list"` to `ul` with `list-style: none` to work around
              a problem with Safari not treating the `ul` as a list. */}
          {/* eslint-disable-next-line jsx-a11y/no-redundant-roles */}
          <ul className="remove-bullets" role="list">
            {data.areaOfDisagreement?.map((issue, index) => (
              <li
                key={index}
                className="vads-u-margin-bottom--2 dd-privacy-hidden"
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
};

ConfirmationIssues.propTypes = {
  children: PropTypes.element,
  data: PropTypes.shape({
    appealingVHADenial: PropTypes.bool,
    areaOfDisagreement: PropTypes.arrayOf(PropTypes.shape({})),
    extensionReason: PropTypes.string,
    requestingExtension: PropTypes.bool,
  }),
};

export default ConfirmationIssues;
