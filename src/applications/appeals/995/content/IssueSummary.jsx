import React from 'react';
import PropTypes from 'prop-types';

import { getDate } from '../../shared/utils/dates';
import { NO_ISSUES_SELECTED } from '../constants';

import { FORMAT_READABLE, SELECTED } from '../../shared/constants';
import { getSelected } from '../../shared/utils/issues';

const legendClassNames = [
  'vads-u-margin-top--0',
  'vads-u-font-size--base',
  'vads-u-font-weight--normal',
].join(' ');

const listClassNames = [
  'vads-u-border-top--1px',
  'vads-u-border-color--gray-light',
  'vads-u-padding-y--2',
  'vads-u-padding-x--0',
].join(' ');

const IssueSummary = ({ formData }) => {
  const issues = getSelected(formData);

  return (
    <fieldset>
      <legend className={legendClassNames}>
        <h3 className="vads-u-margin-y--0">
          You’ve selected these issues for review
        </h3>
      </legend>
      <ul className="issues-summary vads-u-margin-bottom--0">
        {issues.length ? (
          issues.map((issue, index) => (
            <li key={index} className={listClassNames}>
              <h4
                className="capitalize vads-u-margin-top--0 vads-u-padding-right--2 dd-privacy-hidden"
                data-dd-action-name="rated issue name"
              >
                {issue.attributes?.ratingIssueSubjectText || issue.issue || ''}
              </h4>
              <div>
                Decision date:{' '}
                <span
                  className="dd-privacy-hidden"
                  data-dd-action-name="rated issue decision date"
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
          ))
        ) : (
          <li>
            <strong>{NO_ISSUES_SELECTED}</strong>
          </li>
        )}
      </ul>
    </fieldset>
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
