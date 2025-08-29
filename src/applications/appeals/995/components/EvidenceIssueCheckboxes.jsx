import React from 'react';
import PropTypes from 'prop-types';
import { VaCheckboxGroup } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import { NO_ISSUES_SELECTED } from '../constants';

export const EvidenceIssueCheckboxes = ({
  availableIssues,
  currentData,
  handlers,
  issuesLabel,
  showError,
}) => (
  <>
    <VaCheckboxGroup
      label={issuesLabel}
      name="issues"
      onVaChange={handlers.onIssueChange}
      onBlur={handlers.onBlur}
      error={showError('issues')}
      required
    >
      {availableIssues.length ? (
        availableIssues.map((issue, index) => (
          <va-checkbox
            key={index}
            name="issues"
            class="dd-privacy-hidden"
            data-dd-action-name="issue name"
            label={issue}
            value={issue}
            checked={(currentData?.issues || []).includes(issue)}
          />
        ))
      ) : (
        <strong>{NO_ISSUES_SELECTED}</strong>
      )}
    </VaCheckboxGroup>
  </>
);

EvidenceIssueCheckboxes.propTypes = {
  availableIssues: PropTypes.array,
  currentData: PropTypes.shape({
    issues: PropTypes.array,
  }),
  handlers: PropTypes.shape({
    onBlur: PropTypes.func,
    onChange: PropTypes.func,
    onIssueChange: PropTypes.func,
  }),
  issuesLabel: PropTypes.string,
  showError: PropTypes.func,
};
