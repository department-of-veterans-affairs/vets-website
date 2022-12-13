import React from 'react';
import { Link } from 'react-router';
import PropTypes from 'prop-types';

import { getSelected } from '../utils/helpers';
import { getDate } from '../utils/dates';
import {
  SELECTED,
  CONTESTABLE_ISSUES_PATH,
  FORMAT_READABLE,
} from '../constants';

const listClassNames = [
  'vads-u-border-top--1px',
  'vads-u-border-color--gray-light',
  'vads-u-padding-y--2',
  'vads-u-padding-x--0',
].join(' ');

const IssueSummary = ({ formData }) => {
  const issues = getSelected(formData);

  return (
    <>
      <p className="vads-u-margin-top--0">
        These are the issues you’re asking to recieve a Supplemental Claim.
      </p>
      <ul className="issues-summary">
        {issues.map((issue, index) => (
          <li key={index} className={listClassNames}>
            <h3 className="capitalize vads-u-margin-top--0">
              {issue.attributes?.ratingIssueSubjectText || issue.issue || ''}
            </h3>
            <div>
              Decision date:{' '}
              {getDate({
                date:
                  issue.attributes?.approxDecisionDate ||
                  issue.decisionDate ||
                  '',
                pattern: FORMAT_READABLE,
              })}
            </div>
            <Link to={CONTESTABLE_ISSUES_PATH}>Edit</Link>
          </li>
        ))}
      </ul>
    </>
  );
};

IssueSummary.propTypes = {
  formData: PropTypes.shape({
    contestedIssues: PropTypes.arrayOf(
      PropTypes.shape({
        attributes: PropTypes.shape({
          ratingIssueSubjectText: PropTypes.string,
        }),
        [SELECTED]: PropTypes.bool,
      }),
    ),
    additionalIssues: PropTypes.arrayOf(
      PropTypes.shape({
        issue: PropTypes.string,
        decisionDate: PropTypes.string,
        [SELECTED]: PropTypes.bool,
      }),
    ),
  }),
};

export default IssueSummary;
