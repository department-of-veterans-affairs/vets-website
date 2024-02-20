import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import classNames from 'classnames';
import Select from '../../../components/Select';
import { selectFeatureStatusImprovement } from '../../../redux/selectors';

function handleClick(currentRange, dateRangeIndex, callback) {
  return () => {
    if (currentRange !== dateRangeIndex) {
      callback(dateRangeIndex);
    }
  };
}

function handleChange({
  updateDateRangeIndex,
  callback,
  featureStatusImprovement,
}) {
  return e => {
    const dateRange = Number(e.detail.value);

    updateDateRangeIndex(dateRange);
    if (featureStatusImprovement) {
      callback(dateRange);
    }
  };
}

export default function PastAppointmentsDateDropdown({
  currentRange,
  onChange,
  options,
}) {
  const [dateRangeIndex, updateDateRangeIndex] = useState(currentRange);
  const featureStatusImprovement = useSelector(state =>
    selectFeatureStatusImprovement(state),
  );

  return (
    <>
      <Select
        options={options}
        onChange={handleChange({
          currentRange,
          dateRangeIndex,
          updateDateRangeIndex,
          callback: onChange,
          featureStatusImprovement,
        })}
        id="date-dropdown"
        value={dateRangeIndex.toString()}
        label="Select a date range"
        className={classNames(
          'xsmall-screen:vads-u-margin-bottom--3 small-screen:vads-u-margin-bottom--4 vaos-hide-for-print',
        )}
      />
      {!featureStatusImprovement && (
        <button
          type="button"
          aria-label="Update my appointments list"
          className="usa-button vaos-hide-for-print"
          onClick={handleClick(currentRange, dateRangeIndex, onChange)}
        >
          Update
        </button>
      )}
    </>
  );
}

PastAppointmentsDateDropdown.propTypes = {
  currentRange: PropTypes.number.isRequired,
  options: PropTypes.array.isRequired,
  onChange: PropTypes.func.isRequired,
};
