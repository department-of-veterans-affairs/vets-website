// Node modules.
import React, { useState } from 'react';
import PropTypes from 'prop-types';
// Relative imports.
import {
  dayOptions,
  defaultSelectedOption,
  filterByOptions,
  monthOptions,
} from '../../helpers';

const Search = ({ onSearch }) => {
  // Derive the state.
  const [selectedOption, setSelectedOption] = useState(defaultSelectedOption);
  const [startDateMonth, setStartDateMonth] = useState('');
  const [startDateDay, setStartDateDay] = useState('');

  return (
    <form
      className="vads-u-display--flex vads-u-flex-direction--column vads-u-background-color--gray-lightest vads-u-padding-x--1 vads-u-padding-y--1p5"
      onSubmit={onSearch}
    >
      {/* Filter by */}
      <div className="vads-u-display--flex vads-u-flex-direction--column vads-u-margin-bottom--1">
        <label
          className="vads-u-margin--0 vads-u-margin-bottom--1"
          htmlFor="filterBy"
          style={{ flexShrink: 0 }}
        >
          Filter by
        </label>
        <select
          id="filterBy"
          name="filterBy"
          onChange={event => setSelectedOption(event.target.value)}
          value={selectedOption}
        >
          {filterByOptions?.map(option => (
            <option key={option?.value} value={option?.value}>
              {option?.label}
            </option>
          ))}
        </select>
      </div>

      {/* Specific date fields */}
      {selectedOption === 'specific-date' && (
        <div className="vads-u-display--flex vads-u-flex-direction--row vads-u-margin-bottom--1">
          {/* Month */}
          <div className="vads-u-display--flex vads-u-flex-direction--column vads-u-margin-right--1p5">
            <label className="vads-u-margin--0" htmlFor="startDateMonth">
              {/* The asterisk is superscript u+002A */}
              *Month
            </label>
            <select
              id="startDateMonth"
              name="startDateMonth"
              onChange={event => setStartDateMonth(event.target.value)}
              value={startDateMonth}
            >
              {monthOptions?.map(option => (
                <option key={option?.value} value={option?.value}>
                  {option?.label}
                </option>
              ))}
            </select>
          </div>

          {/* Day */}
          <div className="vads-u-display--flex vads-u-flex-direction--column">
            <label className="vads-u-margin--0" htmlFor="startDateDay">
              {/* The asterisk is superscript u+002A */}
              *Day
            </label>
            <select
              id="startDateDay"
              name="startDateDay"
              onChange={event => setStartDateDay(event.target.value)}
              value={startDateDay}
            >
              {dayOptions?.map(option => (
                <option key={option?.value} value={option?.value}>
                  {option?.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      )}

      {/* Custom date range fields */}
      {/* {selectedOption === 'custom-date-range' && (

      )} */}

      {/* Submit */}
      <button className="usa-button-primary" type="submit">
        Filter events
      </button>
    </form>
  );
};

Search.propTypes = {
  onSearch: PropTypes.func.isRequired,
};

export default Search;
