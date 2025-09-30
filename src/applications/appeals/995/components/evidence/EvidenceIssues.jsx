import React from 'react';
import PropTypes from 'prop-types';
import { VaCheckboxGroup } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import { NO_ISSUES_SELECTED } from '../../constants';

const EvidenceIssues = ({
  availableIssues,
  content,
  currentData,
  handlers,
  showError,
}) => (
  <VaCheckboxGroup
    label={content.issuesLabel}
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
);

export default EvidenceIssues;

EvidenceIssues.propTypes = {
  availableIssues: PropTypes.array,
  content: PropTypes.shape({
    issuesLabel: PropTypes.string,
  }),
  currentData: PropTypes.shape({
    issues: PropTypes.array,
  }),
  handlers: PropTypes.shape({
    onBlur: PropTypes.func,
    onIssueChange: PropTypes.func,
  }),
  showError: PropTypes.func,
};
