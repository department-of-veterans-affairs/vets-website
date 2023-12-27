import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { VaDate } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import recordEvent from 'platform/monitoring/record-event';
import {
  deriveDefaultSelectedOption,
  deriveStartsAtUnix,
  filterByOptions,
} from '../../helpers';

export const Search = ({ onSearch }) => {
  const queryParams = new URLSearchParams(window.location.search);

  const defaultSelectedOption = deriveDefaultSelectedOption();

  const getFullDate = (day, month, year) => {
    if (!day || !month || !year) {
      return false;
    }

    return `${year}-${month}-${day}`;
  };

  const [selectedOption, setSelectedOption] = useState(defaultSelectedOption);
  const [startDateMonth, setStartDateMonth] = useState(
    queryParams.get('startDateMonth') || '',
  );
  const [startDateDay, setStartDateDay] = useState(
    queryParams.get('startDateDay') || '',
  );
  const [startDateYear, setStartDateYear] = useState(
    queryParams.get('startDateYear') || '',
  );
  const [endDateMonth, setEndDateMonth] = useState(
    queryParams.get('endDateMonth') || '',
  );
  const [endDateDay, setEndDateDay] = useState(
    queryParams.get('endDateDay') || '',
  );
  const [endDateYear, setEndDateYear] = useState(
    queryParams.get('endDateYear') || '',
  );

  const [startDateFull, setStartDateFull] = useState(
    getFullDate(startDateDay, startDateMonth, startDateYear),
  );

  const [endDateFull, setEndDateFull] = useState(
    getFullDate(endDateDay, endDateMonth, endDateYear),
  );

  const [startDateMonthError, setStartDateMonthError] = useState(false);
  const [startDateDayError, setStartDateDayError] = useState(false);
  const [startDateYearError, setStartDateYearError] = useState(false);
  const [endDateMonthError, setEndDateMonthError] = useState(false);
  const [endDateDayError, setEndDateDayError] = useState(false);
  const [endDateYearError, setEndDateYearError] = useState(false);
  const [fullDateError, setFullDateError] = useState(false);

  const updatefullDateValue = (dateVal, position) => {
    const isInvalidDateRange = dateCheck => {
      const enoughCharacters = dateCheck.split('').length === 10;
      const enoughFields = dateCheck.split('-').length === 3;

      return !enoughCharacters || !enoughFields;
    };

    if (!dateVal || isInvalidDateRange(dateVal)) {
      return null;
    }

    const fields = dateVal.split('-');

    if (position === 'start') {
      setStartDateYear(fields[0]);
      setStartDateMonth(fields[1]);
      setStartDateDay(fields[2]);
    } else {
      setEndDateYear(fields[0]);
      setEndDateMonth(fields[1]);
      setEndDateDay(fields[2]);
    }

    return null;
  };

  useEffect(() => {
    setStartDateFull(getFullDate(startDateDay, startDateMonth, startDateYear));
    setEndDateFull(getFullDate(endDateDay, endDateMonth, endDateYear));
  }, []);

  useEffect(
    () => {
      updatefullDateValue(startDateFull, 'start');
      updatefullDateValue(endDateFull, 'end');
    },
    [selectedOption, startDateFull, endDateFull],
  );

  const onFilterByChange = event => {
    const filterByOption = filterByOptions?.find(
      option => option?.value === event?.target?.value,
    );

    if (filterByOption?.value === selectedOption?.value) {
      return;
    }

    setStartDateMonth('');
    setStartDateDay('');
    setStartDateYear('');
    setEndDateMonth('');
    setEndDateDay('');
    setEndDateYear('');
    setStartDateMonthError(false);
    setStartDateDayError(false);
    setStartDateYearError(false);
    setEndDateMonthError(false);
    setEndDateDayError(false);
    setEndDateYearError(false);
    setFullDateError(false);

    setSelectedOption(filterByOption);
  };

  const onSubmitHandler = event => {
    event.preventDefault();

    let filterList;

    if (selectedOption?.value === 'specific-date') {
      filterList = {
        startDateMonth,
        startDateDay,
        startDateYear,
      };

      if (!startDateMonth || !startDateDay || !startDateYear) {
        recordEvent({
          event: 'events-apply-filter-failed',
          'filter-by': selectedOption?.value,
          'filters-list': filterList,
        });
        setStartDateMonthError(!startDateMonth);
        setStartDateDayError(!startDateDay);
        setStartDateYearError(!startDateYear);
        return;
      }
    }

    if (selectedOption?.value === 'custom-date-range') {
      filterList = {
        startDateMonth,
        startDateDay,
        startDateYear,
        endDateMonth,
        endDateDay,
        endDateYear,
      };

      const startDate = deriveStartsAtUnix(
        startDateMonth,
        startDateDay,
        startDateYear,
      );
      const endDate = deriveStartsAtUnix(endDateMonth, endDateDay, endDateYear);

      if (
        !startDateMonth ||
        !startDateDay ||
        !startDateYear ||
        !endDateMonth ||
        !endDateDay ||
        !endDateYear
      ) {
        recordEvent({
          event: 'events-apply-filter-failed',
          'filter-by': selectedOption?.value,
          'filters-list': filterList,
        });

        setStartDateMonthError(!startDateMonth);
        setStartDateDayError(!startDateDay);
        setStartDateYearError(!startDateYear);
        setEndDateMonthError(!endDateMonth);
        setEndDateDayError(!endDateDay);
        setEndDateYearError(!endDateYear);
        return;
      }

      if (startDate > endDate) {
        recordEvent({
          event: 'events-impossible-date-range',
          'filter-by': selectedOption?.value,
          'filters-list': filterList,
        });

        setFullDateError(true);
        return;
      }
    }

    // Allow the event to be submitted and clear errors.
    recordEvent({
      event: 'events-apply-filter-click',
      'filter-by': selectedOption?.value,
      'filters-list': filterList,
    });

    onSearch({ ...event, filterList });
    setStartDateMonthError(false);
    setStartDateDayError(false);
    setStartDateYearError(false);
    setEndDateMonthError(false);
    setEndDateDayError(false);
    setEndDateYearError(false);
    setFullDateError(false);
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
          {(startDateMonthError || startDateDayError || startDateYearError) && (
            <div className="form-left-error-bar" />
          )}

          <VaDate
            label="Please tell us a date"
            id="startDate"
            name="startDate"
            value={startDateFull}
            required
            onDateChange={e => setStartDateFull(e.target.value)}
          />
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
            startDateYearError ||
            endDateMonthError ||
            endDateDayError ||
            endDateYearError ||
            fullDateError) && <div className="form-left-error-bar" />}

          {fullDateError && (
            <p className="va-c-range-error-message">
              Please select an end date that comes after the start date.
            </p>
          )}

          <VaDate
            label="Please tell us a start date"
            id="startDate"
            name="startDate"
            value={startDateFull}
            required
            onDateChange={e => setStartDateFull(e.target.value)}
          />

          <VaDate
            label="Please tell us an end date"
            id="endDate"
            name="endDate"
            value={endDateFull}
            required
            onDateBlur={function noRefCheck() {}}
            onDateChange={e => setEndDateFull(e.target.value)}
          />
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
