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
      uswds
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
            uswds
          />
        ))
      ) : (
        <strong>{NO_ISSUES_SELECTED}</strong>
      )}
    </VaCheckboxGroup>

    {dateRangeKey === 'treatmentDate' ? (
      <>
        <VaDate
          id="txdate"
          name="txdate"
          monthYearOnly
          error={showError('treatmentDate')}
          label={content.treatmentDate}
          onDateChange={handlers.onChange}
          onDateBlur={handlers.onBlur}
          value={currentData.treatmentDate}
        />
        <VaCheckbox
          id="nodate"
          name="nodate"
          class="vads-u-margin-bottom--4"
          label={content.noDate}
          onVaChange={handlers.onChange}
          checked={currentData.noDate}
        />
      </>
    ) : (
      <>
        <VaMemorableDate
          id="from-date"
          name="from"
          label={content.dateStart}
          required
          onDateChange={handlers.onChange}
          onDateBlur={handlers.onBlur}
          value={currentData[dateRangeKey]?.from}
          error={showError('from')}
          invalidMonth={isInvalid('from', 'month')}
          invalidDay={isInvalid('from', 'day')}
          invalidYear={isInvalid('from', 'year')}
          month-select={false}
          uswds
        />
        <VaMemorableDate
          id="to-date"
          name="to"
          label={content.dateEnd}
          required
          onDateChange={handlers.onChange}
          onDateBlur={handlers.onBlur}
          value={currentData[dateRangeKey]?.to}
          error={showError('to')}
          invalidMonth={isInvalid('to', 'month')}
          invalidDay={isInvalid('to', 'day')}
          invalidYear={isInvalid('to', 'year')}
          month-select={false}
          uswds
        />
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
