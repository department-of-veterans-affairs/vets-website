// Node modules.
import React, { useState } from 'react';
import PropTypes from 'prop-types';
// Relative imports.
import {
  dayOptions,
  deriveDefaultSelectedOption,
  filterByOptions,
  monthOptions,
} from '../../helpers';

export const Search = ({ onSearch }) => {
  // Derive the query params on the URL.
  const queryParams = new URLSearchParams(window.location.search);

  // Derive the default selected option.
  const defaultSelectedOption = deriveDefaultSelectedOption();

  // Derive the state.
  const [selectedOption, setSelectedOption] = useState(defaultSelectedOption);
  const [startDateMonth, setStartDateMonth] = useState(
    queryParams.get('startDateMonth') || '',
  );
  const [startDateDay, setStartDateDay] = useState(
    queryParams.get('startDateDay') || '',
  );
  const [endDateMonth, setEndDateMonth] = useState(
    queryParams.get('endDateMonth') || '',
  );
  const [endDateDay, setEndDateDay] = useState(
    queryParams.get('endDateDay') || '',
  );

  // Derive errors state.
  const [startDateMonthError, setStartDateMonthError] = useState(false);
  const [startDateDayError, setStartDateDayError] = useState(false);
  const [endDateMonthError, setEndDateMonthError] = useState(false);
  const [endDateDayError, setEndDateDayError] = useState(false);

  const onFilterByChange = event => {
    const filterByOption = filterByOptions?.find(
      option => option?.value === event?.target?.value,
    );

    // Escape early if they selected the same field.
    if (filterByOption?.value === selectedOption?.value) {
      return;
    }

    // Reset fields.
    setStartDateMonth('');
    setStartDateDay('');
    setEndDateMonth('');
    setEndDateDay('');
    setStartDateMonthError(false);
    setStartDateDayError(false);
    setEndDateMonthError(false);
    setEndDateDayError(false);

    // Update the selected option.
    setSelectedOption(filterByOption);
  };

  const onSubmitHandler = event => {
    event.preventDefault();

    // Escape early with error if we are missing a required field.
    if (
      selectedOption?.value === 'specific-date' &&
      (!startDateMonth || !startDateDay)
    ) {
      setStartDateMonthError(!startDateMonth);
      setStartDateDayError(!startDateDay);
      return;
    }

    // Escape early with error if we are missing a required field.
    if (
      selectedOption?.value === 'custom-date-range' &&
      (!startDateMonth || !startDateDay || !endDateMonth || !endDateDay)
    ) {
      setStartDateMonthError(!startDateMonth);
      setStartDateDayError(!startDateDay);
      setEndDateMonthError(!endDateMonth);
      setEndDateDayError(!endDateDay);
      return;
    }

    // Allow the event to be submitted and clear errors.
    onSearch(event);
    setStartDateMonthError(false);
    setStartDateDayError(false);
    setEndDateMonthError(false);
    setEndDateDayError(false);
  };

  return (
    <form
      className="vads-u-display--flex vads-u-flex-direction--column vads-u-background-color--gray-lightest vads-u-padding-x--1 vads-u-padding-y--1p5 medium-screen:vads-u-padding-y--3 medium-screen:vads-u-padding-x--3"
      onSubmit={onSubmitHandler}
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
          className="filter-by"
          id="filterBy"
          name="filterBy"
          onChange={onFilterByChange}
          value={selectedOption?.value}
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
      {selectedOption?.value === 'specific-date' && (
        <div className="vads-u-display--flex vads-u-flex-direction--row vads-u-margin-bottom--1 vads-u-margin-top--0 vads-u-position--relative">
          {/* Left error bar */}
          {(startDateMonthError || startDateDayError) && (
            <div className="form-left-error-bar" />
          )}

          {/* Month */}
          <div className="vads-u-display--flex vads-u-flex-direction--column">
            <label className="vads-u-margin--0" htmlFor="startDateMonth">
              {/* The asterisk is superscript u+002A */}
              *Month
            </label>
            {startDateMonthError && (
              <p
                className="vads-u-color--secondary vads-u-margin--0 vads-u-font-size--bold"
                role="alert"
              >
                <span className="sr-only">Error</span> Missing month
              </p>
            )}
            <select
              className={
                startDateMonthError
                  ? 'vads-u-border-color--secondary vads-u-border--3px'
                  : ''
              }
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
          <div className="vads-u-display--flex vads-u-flex-direction--column vads-u-margin-left--1">
            <label className="vads-u-margin--0" htmlFor="startDateDay">
              {/* The asterisk is superscript u+002A */}
              *Day
            </label>
            {startDateDayError && (
              <p
                className="vads-u-color--secondary vads-u-margin--0 vads-u-font-size--bold"
                role="alert"
              >
                <span className="sr-only">Error</span> Missing day
              </p>
            )}
            <select
              className={
                startDateDayError
                  ? 'vads-u-border-color--secondary vads-u-border--3px'
                  : ''
              }
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
      {selectedOption?.value === 'custom-date-range' && (
        <div className="vads-u-display--flex vads-u-flex-direction--column vads-u-margin-top--0 vads-u-position--relative">
          {/* Left error bar */}
          {(startDateMonthError ||
            startDateDayError ||
            endDateMonthError ||
            endDateDayError) && <div className="form-left-error-bar" />}

          {/* Start date */}
          <label className="vads-u-margin--0">Start date</label>
          <div className="vads-u-display--flex vads-u-flex-direction--row vads-u-margin-bottom--1">
            {/* Start date | Month */}
            <div className="vads-u-display--flex vads-u-flex-direction--column">
              <label className="vads-u-margin--0" htmlFor="startDateMonth">
                {/* The asterisk is superscript u+002A */}
                *Month
              </label>
              {startDateMonthError && (
                <p
                  className="vads-u-color--secondary vads-u-margin--0 vads-u-font-size--bold"
                  role="alert"
                >
                  <span className="sr-only">Error</span> Missing month
                </p>
              )}
              <select
                className={
                  startDateMonthError
                    ? 'vads-u-border-color--secondary vads-u-border--3px'
                    : ''
                }
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
            <div className="vads-u-display--flex vads-u-flex-direction--column vads-u-margin-left--1">
              <label className="vads-u-margin--0" htmlFor="startDateDay">
                {/* The asterisk is superscript u+002A */}
                *Day
              </label>
              {startDateDayError && (
                <p
                  className="vads-u-color--secondary vads-u-margin--0 vads-u-font-size--bold"
                  role="alert"
                >
                  <span className="sr-only">Error</span> Missing day
                </p>
              )}
              <select
                className={
                  startDateDayError
                    ? 'vads-u-border-color--secondary vads-u-border--3px'
                    : ''
                }
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
            <div className="vads-u-display--flex vads-u-flex-direction--column">
              <label className="vads-u-margin--0" htmlFor="endDateMonth">
                {/* The asterisk is superscript u+002A */}
                *Month
              </label>
              {endDateMonthError && (
                <p
                  className="vads-u-color--secondary vads-u-margin--0 vads-u-font-size--bold"
                  role="alert"
                >
                  <span className="sr-only">Error</span> Missing month
                </p>
              )}
              <select
                className={
                  endDateMonthError
                    ? 'vads-u-border-color--secondary vads-u-border--3px'
                    : ''
                }
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
            <div className="vads-u-display--flex vads-u-flex-direction--column vads-u-margin-left--1">
              <label className="vads-u-margin--0" htmlFor="endDateDay">
                {/* The asterisk is superscript u+002A */}
                *Day
              </label>
              {endDateDayError && (
                <p
                  className="vads-u-color--secondary vads-u-margin--0 vads-u-font-size--bold"
                  role="alert"
                >
                  <span className="sr-only">Error</span> Missing day
                </p>
              )}
              <select
                className={
                  endDateDayError
                    ? 'vads-u-border-color--secondary vads-u-border--3px'
                    : ''
                }
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
        </div>
      )}

      {/* Submit */}
      <button
        className="usa-button usa-button-primary vads-u-margin--0 vads-u-margin-top--1"
        type="submit"
      >
        Apply filter
      </button>
    </form>
  );
};

Search.propTypes = {
  onSearch: PropTypes.func.isRequired,
};

export default Search;
