import React from 'react';
import PropTypes from 'prop-types';
import { VaDate } from '@department-of-veterans-affairs/component-library/dist/react-bindings';

const DatePicker = ({
  dateValue,
  updateDate,
  triggerApiUpdate,
  isLoadingAcceleratedData,
  yearOnly,
}) => {
  // When yearOnly is true we expect dateValue to be a yyyy string. We still emit a synthetic
  // event with target.value = yyyy-01 so existing updateDate handlers parsing year-month continue
  // to work. This preserves backward compatibility with the accelerated vitals implementation
  // which expects a YYYY-MM format for now.
  if (yearOnly) {
    return (
      <div className="vads-u-display--flex vads-u-flex-direction--column">
        <div style={{ flex: 'inherit' }}>
          <label htmlFor="vitals-year-picker" className="vads-u-font-weight--bold">
            Choose a year
          </label>
          <va-text-input
            id="vitals-year-picker"
            name="vitals-year-picker"
            data-testid="year-only-input"
            width="md"
            value={dateValue}
            inputmode="numeric"
            maxlength="4"
            onInput={e => {
              const val = e.target.value.replace(/[^0-9]/g, '').slice(0, 4);
              // fabricate target.value formatted as YYYY-01 for existing logic
              const syntheticEvent = { target: { value: `${val || ''}-01` } };
              updateDate(syntheticEvent);
            }}
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
  }
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
  yearOnly: PropTypes.bool,
};

export default DatePicker;
