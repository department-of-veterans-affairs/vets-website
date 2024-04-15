import React from 'react';
import PropTypes from 'prop-types';
import { VaDate } from '@department-of-veterans-affairs/component-library/dist/react-bindings';

const CustomDateFields = ({
  anyDateErrorsExist,
  endDateFull,
  fullDateError,
  setEndDateFull,
  setStartDateFull,
  startDateFull,
}) => {
  return (
    <div className="vads-u-display--flex vads-u-flex-direction--column vads-u-margin-top--0 vads-u-position--relative">
      {anyDateErrorsExist && (
        <div
          className="form-left-error-bar"
          data-testid="form-left-error-bar"
        />
      )}
      {fullDateError && (
        <p
          className="va-c-range-error-message"
          data-testid="va-c-range-error-message"
        >
          Please select an end date that comes after the start date.
        </p>
      )}
      <VaDate
        data-testid="events-start-date"
        label="Please tell us a start date"
        id="startDate"
        name="startDate"
        value={startDateFull}
        required
        onDateChange={e => setStartDateFull(e.target.value)}
      />
      <VaDate
        data-testid="events-end-date"
        label="Please tell us an end date"
        id="endDate"
        name="endDate"
        value={endDateFull}
        required
        onDateBlur={function noRefCheck() {}}
        onDateChange={e => setEndDateFull(e.target.value)}
      />
    </div>
  );
};

CustomDateFields.propTypes = {
  anyDateErrorsExist: PropTypes.bool.isRequired,
  endDateFull: PropTypes.any.isRequired,
  fullDateError: PropTypes.bool.isRequired,
  setEndDateFull: PropTypes.func.isRequired,
  setStartDateFull: PropTypes.func.isRequired,
  startDateFull: PropTypes.any.isRequired,
};

export default CustomDateFields;
