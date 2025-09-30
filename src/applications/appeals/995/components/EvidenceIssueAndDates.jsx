import React from 'react';
import PropTypes from 'prop-types';
import {
  VaCheckboxGroup,
  VaCheckbox,
  VaDate,
  VaMemorableDate,
} from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import { NO_ISSUES_SELECTED } from '../constants';

export const EvidenceIssueAndDates = ({
  currentData,
  availableIssues,
  content,
  handlers,
  showError,
  isInvalid,
  dateRangeKey,
}) => (
  <>
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

    {dateRangeKey === 'treatmentDate' ? (
      <>
        
      </>
    ) : (
      <>
        
      </>
    )}
  </>
);

EvidenceIssueAndDates.propTypes = {
  availableIssues: PropTypes.array,
  content: PropTypes.shape({
    dateStart: PropTypes.string,
    dateEnd: PropTypes.string,
    issuesLabel: PropTypes.string,
    noDate: PropTypes.bool,
    treatmentDate: PropTypes.string,
  }),
  currentData: PropTypes.shape({
    issues: PropTypes.array,
    noDate: PropTypes.bool,
    treatmentDate: PropTypes.string,
  }),
  dateRangeKey: PropTypes.string,
  handlers: PropTypes.shape({
    onBlur: PropTypes.func,
    onChange: PropTypes.func,
    onIssueChange: PropTypes.func,
  }),
  isInvalid: PropTypes.func,
  showError: PropTypes.func,
};
