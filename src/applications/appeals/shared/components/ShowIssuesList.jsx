import React from 'react';
import PropTypes from 'prop-types';

import { getDecisionDate } from '../utils/issues';

const ShowIssuesList = ({ issues }) => (
  <ul>
    {issues.map((issue, index) => (
      <li key={index}>
        <strong
          className="capitalize dd-privacy-hidden overflow-wrap-word"
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
            {getDecisionDate(issue)}
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
