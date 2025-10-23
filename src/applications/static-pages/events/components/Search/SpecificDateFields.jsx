import React from 'react';
import PropTypes from 'prop-types';
import { VaDate } from '@department-of-veterans-affairs/component-library/dist/react-bindings';

const SpecificDateFields = ({
  setStartDateFull,
  startDateDayError,
  startDateFull,
  startDateMonthError,
  startDateYearError,
}) => {
  return (
    <div className="vads-u-display--flex vads-u-flex-direction--column vads-u-position--relative">
      {(startDateMonthError || startDateDayError || startDateYearError) && (
        <div className="form-left-error-bar" />
      )}
      <VaDate
        label="Please tell us a date"
        data-testid="events-start-date-specific"
        id="startDate"
        name="startDate"
        value={startDateFull}
        required
        onDateChange={e => setStartDateFull(e.target.value)}
      />
    </div>
  );
};

SpecificDateFields.propTypes = {
  setStartDateFull: PropTypes.func.isRequired,
  startDateDayError: PropTypes.bool.isRequired,
  startDateFull: PropTypes.any.isRequired,
  startDateMonthError: PropTypes.bool.isRequired,
  startDateYearError: PropTypes.bool.isRequired,
};

export default SpecificDateFields;
