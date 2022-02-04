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
      <div className="vads-u-display--flex vads-u-flex-direction--column vads-u-margin-bottom--2">
        <fieldset>
          <legend
            className="vads-u-margin--0 vads-u-margin-bottom--1 vads-u-font-size--base vads-u-font-weight--normal vads-u-line-height--2"
            id="filterByLabel"
            htmlFor="filterBy"
            style={{ flexShrink: 0 }}
          >
            Filter by
          </legend>
          <select
            className="filter-by"
            id="filterBy"
            name="filterBy"
            aria-labelledby="filterByLabel"
            onChange={onFilterByChange}
            value={selectedOption?.value}
          >
            {filterByOptions?.map(option => (
              <option key={option?.value} value={option?.value}>
                {option?.label}
              </option>
            ))}
          </select>
        </fieldset>
      </div>

      {/* ==================== */}
      {/* Specific date fields */}
      {/* ==================== */}
      {selectedOption?.value === 'specific-date' && (
        <div className="vads-u-display--flex vads-u-flex-direction--column vads-u-position--relative">
          {/* Left error bar */}
          {(startDateMonthError || startDateDayError) && (
            <div className="form-left-error-bar" />
          )}

          <fieldset>
            <legend
              className="vads-u-margin--0 vads-u-font-size--base vads-u-font-weight--normal vads-u-line-height--2"
              htmlFor="startDateMonth"
            >
              Please tell us a date{' '}
              <span className="vads-u-color--secondary">(*Required)</span>
            </legend>

            {(startDateMonthError || startDateDayError) && (
              <p
                className="vads-u-color--secondary vads-u-margin--0 vads-u-font-weight--bold vads-u-margin-top--1"
                role="alert"
              >
                <span className="sr-only">Error</span> Please provide a valid
                date
              </p>
            )}

            <div className="vads-u-display--flex vads-u-flex-direction--row vads-u-margin-bottom--1 vads-u-margin-top--0">
              {/* Month */}
              <div className="vads-u-display--flex vads-u-flex-direction--column vads-u-flex--1 events-date-select vads-u-margin-top--1">
                <label className="vads-u-margin--0" htmlFor="startDateMonth">
                  Month
                </label>
                <select
                  className={
                    startDateMonthError
                      ? 'vads-u-border-color--secondary vads-u-border--3px vads-u-padding-y--2'
                      : 'vads-u-padding-y--1'
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
              <div className="vads-u-display--flex vads-u-flex-direction--column vads-u-flex--1 events-date-select vads-u-margin-left--1 vads-u-margin-top--1">
                <label
                  className="vads-u-margin--0"
                  htmlFor="startDateDay"
                  id="startDateDayLabel"
                >
                  Day
                </label>
                <select
                  className={
                    startDateDayError
                      ? 'vads-u-border-color--secondary vads-u-border--3px vads-u-padding-y--1'
                      : 'vads-u-padding-y--1'
                  }
                  id="startDateDay"
                  aria-labelledby="startDateDayLabel"
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
          </fieldset>
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

          <fieldset>
            {/* Start date */}
            <legend
              className="vads-u-margin--0 vads-u-font-size--base vads-u-font-weight--normal vads-u-line-height--2"
              htmlFor="startDateMonth"
            >
              Please tell us a start date{' '}
              <span className="vads-u-color--secondary">(*Required)</span>
            </legend>

            {(startDateMonthError || startDateDayError) && (
              <p
                className="vads-u-color--secondary vads-u-margin--0 vads-u-font-weight--bold vads-u-margin-top--1"
                role="alert"
              >
                <span className="sr-only">Error</span> Please provide a valid
                start date
              </p>
            )}
            <div className="vads-u-display--flex vads-u-flex-direction--row vads-u-margin-top--1 vads-u-margin-bottom--2">
              {/* Start date | Month */}
              <div className="vads-u-display--flex vads-u-flex-direction--column vads-u-flex--2 events-date-select">
                <label
                  className="vads-u-margin--0"
                  htmlFor="startDateMonth"
                  id="startDateMonthLabel"
                >
                  Month
                </label>
                <select
                  className={
                    startDateMonthError
                      ? 'vads-u-border-color--secondary vads-u-border--3px vads-u-padding-y--1'
                      : 'vads-u-padding-y--1'
                  }
                  id="startDateMonth"
                  name="startDateMonth"
                  aria-labelledby="startDateMonthLabel"
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
              <div className="vads-u-display--flex vads-u-flex-direction--column vads-u-margin-left--1 vads-u-flex--1 events-date-select">
                <label
                  className="vads-u-margin--0"
                  htmlFor="startDateDay"
                  id="startDateDayLabel"
                >
                  Day
                </label>
                <select
                  className={
                    startDateDayError
                      ? 'vads-u-border-color--secondary vads-u-border--3px vads-u-padding-y--1'
                      : 'vads-u-padding-y--1'
                  }
                  id="startDateDay"
                  name="startDateDay"
                  aria-labelledby="startDateDayLabel"
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
          </fieldset>
          {/* End date */}
          <fieldset>
            <legend
              className="vads-u-margin--0 vads-u-font-size--base vads-u-font-weight--normal vads-u-line-height--2"
              htmlFor="startDateMonth"
            >
              Please tell us an end date{' '}
              <span className="vads-u-color--secondary">(*Required)</span>
            </legend>

            {(endDateMonthError || endDateDayError) && (
              <p
                className="vads-u-color--secondary vads-u-margin--0 vads-u-font-weight--bold vads-u-margin-top--1"
                role="alert"
              >
                <span className="sr-only">Error</span> Please provide a valid
                end date
              </p>
            )}
            <div className="vads-u-display--flex vads-u-flex-direction--row vads-u-margin-top--1 vads-u-margin-bottom--2">
              {/* End date | Month */}
              <div className="vads-u-display--flex vads-u-flex-direction--column vads-u-flex--2 events-date-select">
                <label
                  className="vads-u-margin--0"
                  htmlFor="endDateMonth"
                  id="endDateMonthLabel"
                >
                  Month
                </label>
                <select
                  className={
                    endDateMonthError
                      ? 'vads-u-border-color--secondary vads-u-border--3px vads-u-padding-y--1'
                      : 'vads-u-padding-y--1'
                  }
                  id="endDateMonth"
                  name="endDateMonth"
                  aria-labelledby="endDateMonthLabel"
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
              <div className="vads-u-display--flex vads-u-flex-direction--column vads-u-margin-left--1 vads-u-flex--1 events-date-select">
                <label
                  className="vads-u-margin--0"
                  htmlFor="endDateDay"
                  id="endDateDayLabel"
                >
                  Day
                </label>
                <select
                  className={
                    endDateDayError
                      ? 'vads-u-border-color--secondary vads-u-border--3px vads-u-padding-y--1'
                      : 'vads-u-padding-y--1'
                  }
                  id="endDateDay"
                  name="endDateDay"
                  aria-labelledby="endDateDayLabel"
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
          </fieldset>
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
