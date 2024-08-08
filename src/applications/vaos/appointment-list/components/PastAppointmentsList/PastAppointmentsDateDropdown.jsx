import React, { useState } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import Select from '../../../components/Select';

function handleChange({ updateDateRangeIndex, callback }) {
  return e => {
    const dateRange = Number(e.detail.value);

    updateDateRangeIndex(dateRange);
    callback(dateRange);
  };
}

export default function PastAppointmentsDateDropdown({
  currentRange,
  onChange,
  options,
}) {
  const [dateRangeIndex, updateDateRangeIndex] = useState(currentRange);

  return (
    <>
      <Select
        options={options}
        onChange={handleChange({
          currentRange,
          dateRangeIndex,
          updateDateRangeIndex,
          callback: onChange,
        })}
        id="date-dropdown"
        value={dateRangeIndex.toString()}
        label="Select a date range"
        className={classNames(
          'xsmall-screen:vads-u-margin-bottom--3 small-screen:vads-u-margin-bottom--4 vaos-hide-for-print',
        )}
      />
    </>
  );
}

PastAppointmentsDateDropdown.propTypes = {
  currentRange: PropTypes.number.isRequired,
  options: PropTypes.array.isRequired,
  onChange: PropTypes.func.isRequired,
};
