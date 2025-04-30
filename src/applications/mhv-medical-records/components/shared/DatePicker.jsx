import React from 'react';
import PropTypes from 'prop-types';
import { VaDate } from '@department-of-veterans-affairs/component-library/dist/react-bindings';

const DatePicker = ({
  dateValue,
  updateDate,
  triggerApiUpdate,
  isLoadingAcceleratedData,
}) => {
  return (
    <div className="vads-u-display--flex vads-u-flex-direction--column">
      <div style={{ flex: 'inherit' }}>
        <VaDate
          label="Choose a month and year"
          name="vitals-date-picker"
          monthYearOnly
          onDateChange={updateDate}
          value={dateValue}
          data-testid="date-picker"
        />
      </div>
      <div className="vads-u-margin-top--2">
        <va-button
          text="Update time frame"
          onClick={triggerApiUpdate}
          disabled={isLoadingAcceleratedData}
          data-testid="update-time-frame-button"
        />
      </div>
    </div>
  );
};
DatePicker.propTypes = {
  dateValue: PropTypes.string.isRequired,
  isLoadingAcceleratedData: PropTypes.bool.isRequired,
  triggerApiUpdate: PropTypes.func.isRequired,
  updateDate: PropTypes.func.isRequired,
};

export default DatePicker;
