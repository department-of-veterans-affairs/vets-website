import React from 'react';
import { Link } from 'react-router';
import PropTypes from 'prop-types';

import { getDate } from '../../shared/utils/dates';
import { FORMAT_READABLE } from '../../shared/constants';
import { disagreeWith } from '../utils/areaOfDisagreement';

const ShowIssuesList = ({ issues }) => (
  <ul className="issue-summary-list vads-u-padding--0">
    {issues.map((issue, index) => (
      <li key={index} className="vads-u-border-bottom--1px vads-u-padding-y--1">
        <h2
          className="capitalize dd-privacy-hidden vads-u-margin--0"
          data-dd-action-name="issue name"
        >
          {issue.attributes?.ratingIssueSubjectText || issue.issue || ''}
        </h2>
        <div className="vads-u-margin-y--1">
          Decision date:{' '}
          <span
            className="dd-privacy-hidden"
            data-dd-action-name="issue decision date"
          >
            {getDate({
              date:
                issue.attributes?.approxDecisionDate ||
                issue.decisionDate ||
                '',
              pattern: FORMAT_READABLE,
            })}
          </span>
        </div>
        <div>{disagreeWith(issue)}</div>
        <div className="vads-u-margin-y--1">
          <Link to={`/area-of-disagreement/${index}`}>Edit</Link>
        </div>
      </li>
    ))}
  </ul>
);

ShowIssuesList.propTypes = {
  issues: PropTypes.arrayOf({
    // additional issue
    issue: PropTypes.string,
    decisionDate: PropTypes.string,
    // API loaded eligible issues
    attributes: PropTypes.shape({
      ratingIssueSubjectText: PropTypes.string,
      approxDecisionDate: PropTypes.string,
    }),
  }),
};

export { ShowIssuesList };
