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
  const [endDateMonth, setEndDateMonth] = useState('');
  const [endDateDay, setEndDateDay] = useState('');

  const onFilterByChange = event => {
    const filterByOption = event?.target?.value;

    // Escape early if they selected the same field.
    if (filterByOption === selectedOption) {
      return;
    }

    // Reset fields.
    setStartDateMonth('');
    setStartDateDay('');
    setEndDateMonth('');
    setEndDateDay('');

    // Update the selected option.
    setSelectedOption(filterByOption);
  };

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
          onChange={onFilterByChange}
          value={selectedOption}
        >
          {filterByOptions?.map(option => (
            <option key={option?.value} value={option?.value}>
              {option?.label}
            </option>
          ))}
        </select>
      </div>

      {/* ==================== */}
      {/* Specific date fields */}
      {/* ==================== */}
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

      {/* ======================== */}
      {/* Custom date range fields */}
      {/* ======================== */}
      {selectedOption === 'custom-date-range' && (
        <>
          {/* Start date */}
          <label className="vads-u-margin--0">Start date</label>
          <div className="vads-u-display--flex vads-u-flex-direction--row vads-u-margin-bottom--1">
            {/* Start date | Month */}
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

            {/* Start date | Day */}
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

          {/* End date */}
          <label className="vads-u-margin--0">End date</label>
          <div className="vads-u-display--flex vads-u-flex-direction--row vads-u-margin-bottom--1">
            {/* End date | Month */}
            <div className="vads-u-display--flex vads-u-flex-direction--column vads-u-margin-right--1p5">
              <label className="vads-u-margin--0" htmlFor="endDateMonth">
                {/* The asterisk is superscript u+002A */}
                *Month
              </label>
              <select
                id="endDateMonth"
                name="endDateMonth"
                onChange={event => setEndDateMonth(event.target.value)}
                value={endDateMonth}
              >
                {monthOptions?.map(option => (
                  <option key={option?.value} value={option?.value}>
                    {option?.label}
                  </option>
                ))}
              </select>
            </div>

            {/* End date | Day */}
            <div className="vads-u-display--flex vads-u-flex-direction--column">
              <label className="vads-u-margin--0" htmlFor="endDateDay">
                {/* The asterisk is superscript u+002A */}
                *Day
              </label>
              <select
                id="endDateDay"
                name="endDateDay"
                onChange={event => setEndDateDay(event.target.value)}
                value={endDateDay}
              >
                {dayOptions?.map(option => (
                  <option key={option?.value} value={option?.value}>
                    {option?.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </>
      )}

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
