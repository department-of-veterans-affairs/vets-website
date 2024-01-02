import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import recordEvent from '~/platform/monitoring/record-event';
import CustomDateFields from './CustomDateFields';
import FilterBy from './FilterBy';
import SpecificDateFields from './SpecificDateFields';
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

  // Local State =================================================
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
  // End Local State =================================================

  const anyDateErrorsExist =
    startDateMonthError ||
    startDateDayError ||
    startDateYearError ||
    endDateMonthError ||
    endDateDayError ||
    endDateYearError ||
    fullDateError;

  const resetErrorState = () => {
    setStartDateMonthError(false);
    setStartDateDayError(false);
    setStartDateYearError(false);
    setEndDateMonthError(false);
    setEndDateDayError(false);
    setEndDateYearError(false);
    setFullDateError(false);
  };

  const updateFullDateValue = (dateVal, position) => {
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
      updateFullDateValue(startDateFull, 'start');
      updateFullDateValue(endDateFull, 'end');
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
    resetErrorState();

    setSelectedOption(filterByOption);
  };

  const onSubmitHandler = event => {
    event.preventDefault();

    let filterList;

    const recordGAEvent = eventName => {
      recordEvent({
        event: eventName,
        'filter-by': selectedOption?.value,
        'filters-list': filterList,
      });
    };

    if (selectedOption?.value === 'specific-date') {
      filterList = {
        startDateMonth,
        startDateDay,
        startDateYear,
      };

      if (!startDateMonth || !startDateDay || !startDateYear) {
        recordGAEvent('events-apply-filter-failed');

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
        recordGAEvent('events-apply-filter-failed');

        setStartDateMonthError(!startDateMonth);
        setStartDateDayError(!startDateDay);
        setStartDateYearError(!startDateYear);
        setEndDateMonthError(!endDateMonth);
        setEndDateDayError(!endDateDay);
        setEndDateYearError(!endDateYear);
        return;
      }

      if (startDate > endDate) {
        recordGAEvent('events-impossible-date-range');

        setFullDateError(true);
        return;
      }
    }

    recordGAEvent('events-apply-filter-click');

    onSearch({ ...event, filterList });
    resetErrorState();
  };

  return (
    <form
      className="vads-u-display--flex vads-u-flex-direction--column vads-u-background-color--gray-lightest vads-u-padding-x--1 vads-u-padding-y--1p5 medium-screen:vads-u-padding-y--3 medium-screen:vads-u-padding-x--3"
      onSubmit={onSubmitHandler}
    >
      <FilterBy
        filterByOptions={filterByOptions}
        onChange={onFilterByChange}
        selectedOption={selectedOption}
      />
      {selectedOption?.value === 'specific-date' && (
        <SpecificDateFields
          setStartDateFull={setStartDateFull}
          startDateDayError={startDateDayError}
          startDateFull={startDateFull}
          startDateMonthError={startDateMonthError}
          startDateYearError={startDateYearError}
        />
      )}
      {selectedOption?.value === 'custom-date-range' && (
        <CustomDateFields
          anyDateErrorsExist={anyDateErrorsExist}
          endDateFull={endDateFull}
          fullDateError={fullDateError}
          setEndDateFull={setEndDateFull}
          setStartDateFull={setStartDateFull}
          startDateFull={startDateFull}
        />
      )}
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
