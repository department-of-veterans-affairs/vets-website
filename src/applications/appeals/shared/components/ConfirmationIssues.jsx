/* eslint-disable jsx-a11y/no-redundant-roles */
// Adding a `role="list"` to `ul`s with `list-style: none` to work around
// a problem with Safari not treating the `ul` as a list.
import React from 'react';
import PropTypes from 'prop-types';

import { getReadableDate } from '../utils/dates';
import { getSelected, getIssueName, getIssueDate } from '../utils/issues';
import { disagreeWith } from '../utils/areaOfDisagreement';

import { chapterHeaderClass } from './ConfirmationCommon';

const ConfirmationIssues = ({
  data,
  text = 'You’ve selected these issues for review',
  children = null,
}) => {
  const hasAod = data.areaOfDisagreement?.length > 0;
  const issues = hasAod ? data.areaOfDisagreement : getSelected(data);

  const issuesBlock = (
    <>
      <div className="issue-block vads-u-margin-bottom--0p5 vads-u-color--gray vads-u-font-size--sm vads-u-margin-top--2 vads-u-font-weight--normal">
        {`${text}:`}
      </div>
      <ul className="remove-bullets issues" role="list">
        {issues?.map((issue, index) => (
          <li
            key={index}
            className="vads-u-margin-bottom--2 dd-privacy-hidden"
            data-dd-action-name="issue name"
          >
            <strong className="capitalize overflow-wrap-word">
              {getIssueName(issue)}
            </strong>
            <div>Decision date: {getReadableDate(getIssueDate(issue))}</div>
            {hasAod && <div>{disagreeWith(issue)}</div>}
          </li>
        ))}
      </ul>
    </>
  );

  return (
    <>
      <h3 className={chapterHeaderClass}>Issues for review</h3>
      {children ? (
        <ul className="remove-bullets" role="list">
          {children}
          <li>{issuesBlock}</li>
        </ul>
      ) : (
        issuesBlock
      )}
    </>
  );
};

ConfirmationIssues.propTypes = {
  children: PropTypes.element,
  data: PropTypes.shape({
    additionalIssues: PropTypes.arrayOf(PropTypes.shape({})),
    appealingVHADenial: PropTypes.bool,
    areaOfDisagreement: PropTypes.arrayOf(PropTypes.shape({})),
    contestedIssues: PropTypes.arrayOf(PropTypes.shape({})),
    extensionReason: PropTypes.string,
    requestingExtension: PropTypes.bool,
  }),
  text: PropTypes.string,
};

/* eslint-enable jsx-a11y/no-redundant-roles */
export default ConfirmationIssues;
