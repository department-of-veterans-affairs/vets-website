import React from 'react';
import PropTypes from 'prop-types';

import { getDate } from '../utils/dates';
import { FORMAT_READABLE } from '../constants';

const ShowIssuesList = ({ issues }) => (
  <ul>
    {issues.map((issue, index) => (
      <li key={index}>
        <strong
          className="capitalize dd-privacy-hidden"
          data-dd-action-name="issue name"
        >
          {issue.attributes?.ratingIssueSubjectText || issue.issue || ''}
        </strong>
        <div>
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

export default ShowIssuesList;
