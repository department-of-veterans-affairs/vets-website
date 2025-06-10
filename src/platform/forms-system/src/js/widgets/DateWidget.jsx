import React, { useState, useEffect, useCallback } from 'react';

import get from '../../../../utilities/data/get';
import set from '../../../../utilities/data/set';

import { months, days } from '../utilities/date';
import {
  formatISOPartialDate,
  parseISODate,
  minYear,
  maxYear,
} from '../helpers';

function getEmptyState(value) {
  return {
    value: parseISODate(value),
    touched: {
      month: false,
      day: false,
      year: false,
    },
  };
}

export default function DateWidget({
  id,
  value,
  disabled,
  options = {},
  required,
  formContext = {},
  onChange,
  onBlur,
}) {
  const [state, setState] = useState(() => getEmptyState(value));

  useEffect(
    () => {
      // Handle pagePerItemIndex changes (equivalent to componentWillReceiveProps)
      setState(getEmptyState(value));
    },
    [formContext.pagePerItemIndex, value],
  );

  const isTouched = useCallback(
    ({ year, month, day }) => {
      if (get('options.monthYear', { options })) {
        return year && month;
      }

      return year && day && month;
    },
    [options],
  );

  const isIncomplete = useCallback(
    ({ month, year, day }) => {
      if (get('options.monthYear', { options })) {
        return !year || !month;
      }

      return !year || !month || !day;
    },
    [options],
  );

  const handleBlur = useCallback(
    field => {
      setState(prevState => {
        const newState = set(['touched', field], true, prevState);
        if (isTouched(newState.touched)) {
          onBlur(id);
        }
        return newState;
      });
    },
    [id, onBlur, isTouched],
  );

  const handleChange = useCallback(
    (field, fieldValue) => {
      setState(prevState => {
        let newState = set(['value', field], fieldValue, prevState);
        newState = set(['touched', field], true, newState);

        if (required && isIncomplete(newState.value)) {
          onChange();
        } else {
          onChange(formatISOPartialDate(newState.value));
        }

        return newState;
      });
    },
    [required, isIncomplete, onChange],
  );

  const { month, day, year } = state.value;
  let daysForSelectedMonth;

  const { monthYear } = options;
  if (month) {
    daysForSelectedMonth = days[month];
  }

  return (
    <div className="usa-date-of-birth usa-datefields">
      <div className="form-datefield-month">
        <label className="input-date-label" htmlFor={`${id}Month`}>
          Month
        </label>
        <select
          name={`${id}Month`}
          id={`${id}Month`}
          value={month}
          disabled={disabled}
          onChange={event => handleChange('month', event.target.value)}
        >
          <option value="" />
          {months.map(mnth => (
            <option key={mnth.value} value={mnth.value}>
              {mnth.text}
            </option>
          ))}
        </select>
      </div>
      {!monthYear && (
        <div className="form-datefield-day">
          <label className="input-date-label" htmlFor={`${id}Day`}>
            Day
          </label>
          <select
            name={`${id}Day`}
            id={`${id}Day`}
            value={day}
            disabled={disabled}
            onChange={event => handleChange('day', event.target.value)}
          >
            <option value="" />
            {daysForSelectedMonth &&
              daysForSelectedMonth.map(dayOpt => (
                <option key={dayOpt} value={dayOpt}>
                  {dayOpt}
                </option>
              ))}
          </select>
        </div>
      )}
      <div className="usa-datefield usa-form-group usa-form-group-year">
        <label className="input-date-label" htmlFor={`${id}Year`}>
          Year
        </label>
        <input
          type="number"
          autoComplete={options.autocomplete}
          name={`${id}Year`}
          id={`${id}Year`}
          disabled={disabled}
          max={maxYear}
          min={minYear}
          pattern="[0-9]{4}"
          value={year}
          onBlur={() => handleBlur('year')}
          onChange={event => handleChange('year', event.target.value)}
        />
      </div>
    </div>
  );
}
