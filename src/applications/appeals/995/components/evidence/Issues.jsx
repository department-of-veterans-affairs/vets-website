import React from 'react';
import PropTypes from 'prop-types';
import { VaCheckboxGroup } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import { NO_ISSUES_SELECTED } from '../../constants';

const Issues = ({ availableIssues, currentData, handlers, showError }) => {
  if (!availableIssues.length) {
    return (
      <p>
        <strong>{NO_ISSUES_SELECTED}</strong>
      </p>
    );
  }

  return (
    <VaCheckboxGroup
      hint="Select all the service-connected conditions you were treated for"
      label="What conditions were you treated for?"
      name="issues"
      onVaChange={handlers.onIssueChange}
      onBlur={handlers.onBlur}
      error={showError('issues')}
      required
    >
      {availableIssues.map((issue, index) => (
        <va-checkbox
          key={index}
          name="issues"
          class="dd-privacy-hidden"
          data-dd-action-name="issue name"
          label={issue}
          value={issue}
          checked={(currentData?.issues || []).includes(issue)}
        />
      ))}
    </VaCheckboxGroup>
  );
};

export default Issues;

Issues.propTypes = {
  availableIssues: PropTypes.array,
  currentData: PropTypes.shape({
    issues: PropTypes.array,
  }),
  handlers: PropTypes.shape({
    onBlur: PropTypes.func,
    onIssueChange: PropTypes.func,
  }),
  showError: PropTypes.func,
};
