import React from 'react';
import PropTypes from 'prop-types';
import { VaMemorableDate } from '@department-of-veterans-affairs/component-library/dist/react-bindings';

export const EvidencePrivateDates = ({
  content,
  currentData,
  handlers,
  isInvalid,
  showError,
}) => (
  <>
    <VaMemorableDate
      id="from-date"
      name="from"
      label={content.dateStart}
      required
      onDateChange={handlers.onChange}
      onDateBlur={handlers.onBlur}
      value={currentData?.treatmentDateRange?.from}
      error={showError('from')}
      invalidMonth={isInvalid('from', 'month')}
      invalidDay={isInvalid('from', 'day')}
      invalidYear={isInvalid('from', 'year')}
      month-select={false}
    />
    <VaMemorableDate
      id="to-date"
      name="to"
      label={content.dateEnd}
      required
      onDateChange={handlers.onChange}
      onDateBlur={handlers.onBlur}
      value={currentData?.treatmentDateRange?.to}
      error={showError('to')}
      invalidMonth={isInvalid('to', 'month')}
      invalidDay={isInvalid('to', 'day')}
      invalidYear={isInvalid('to', 'year')}
      month-select={false}
    />
  </>
);

EvidencePrivateDates.propTypes = {
  content: PropTypes.shape({
    dateStart: PropTypes.string,
    dateEnd: PropTypes.string,
  }),
  currentData: PropTypes.shape({
    treatmentDateRange: PropTypes.shape({
      from: PropTypes.string,
      to: PropTypes.string,
    }),
  }),
  handlers: PropTypes.shape({
    onBlur: PropTypes.func,
    onChange: PropTypes.func,
  }),
  isInvalid: PropTypes.func,
  showError: PropTypes.func,
};
