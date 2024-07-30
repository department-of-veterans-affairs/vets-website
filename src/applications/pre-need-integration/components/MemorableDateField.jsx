import React, { useState } from 'react';
import moment from 'moment';
import { VaMemorableDate } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import vaMemorableDateFieldMapping from 'platform/forms-system/src/js/web-component-fields/vaMemorableDateFieldMapping';
import {
  formatISOPartialDate,
  parseISODate,
} from 'platform/forms-system/src/js/helpers';

/**
 * Likely should use a datePattern instead of this. See `currentOrPastDateUI()` for example.
 *
 * @param {WebComponentFieldProps} props */
export default function MemorableDateField(props) {
  const mappedProps = vaMemorableDateFieldMapping(props);
  const [values, setValues] = useState(parseISODate(mappedProps.value));
  const [errorVal, setErrorVal] = useState(mappedProps.error);

  /**
   * We store the value in redux as this format: XXXX-03-XX, with X and 0 padding.
   * The component expects the value in this format: '--', '19--', '1999--', '1999-3-', '1999-3-1', '1999-03-12'
   * During user input, we want to make sure there is no leading zero
   *   so that they can type two digits for day/month.
   *
   * parseISODate(XXXX-03-XX) => { year: 1999, month: '', day: '01' }
   * formatISOPartialDate({ day, month, year }) => XXXX-03-XX
   */

  const formattedValue = formatISOPartialDate(values)
    ?.replace(/X/g, '')
    ?.replace(/-0(\d)/g, '-$1');

  const isIncomplete = (vals = {}) => {
    return (
      !vals.year ||
      !vals.month ||
      !vals.day ||
      Number(vals.day) === 0 ||
      Number(vals.month) === 0 ||
      Number(vals.year) === 0
    );
  };

  const isMonthInvalid = (vals = {}) => {
    return Number(vals.month) < 1 || Number(vals.month) > 12;
  };

  const isMonthNotNumbers = (vals = {}) => {
    return isNaN(vals.month);
  };

  const isDayInvalid = (vals = {}) => {
    return Number(vals.month) < 1 || Number(vals.month) > 12;
  };

  const isDayNotNumbers = (vals = {}) => {
    return isNaN(vals.day);
  };

  const currentYear = () => {
    return moment().year();
  };

  const currentDate = () => {
    return moment();
  };

  const enteredDate = (vals = {}) => {
    return moment(`${vals.year}-${vals.month}-${vals.day}`, 'YYYY-MM-DD');
  };

  const isDateInvalid = (vals = {}) => {
    return enteredDate(vals) > currentDate();
  };

  const yearErrorMessage = `Please enter a year between 1900 and ${currentYear()}`;

  return (
    <VaMemorableDate
      customMonthErrorMessage="Enter a valid month"
      customDayErrorMessage="Enter a valid day"
      customYearErrorMessage={yearErrorMessage}
      {...mappedProps}
      onDateChange={(event, newValue) => {
        const date = newValue ?? event.target.value ?? undefined;
        const newValues = parseISODate(date);
        setValues(newValues);
        setErrorVal('');

        if (isIncomplete(newValues)) {
          // if the user has partially filled out the date,
          // represent it as undefined until they have completed it
          // or leave the field (so we don't show errors while they
          // have a WIP value)
          props.childrenProps.onChange(undefined);
        } else {
          props.childrenProps.onChange(formatISOPartialDate(newValues));
        }

        if (isMonthInvalid(newValues)) {
          setErrorVal('Enter a valid month');
        }

        if (isDayInvalid(newValues)) {
          setErrorVal('Enter a valid day');
        }

        if (isMonthNotNumbers(newValues) || isDayNotNumbers(newValues)) {
          setErrorVal('Input numbers only');
        }

        if (isDateInvalid(newValues)) {
          setErrorVal('Please provide a valid current or past date');
        }
      }}
      onDateBlur={event => {
        const newValues = parseISODate(event.target.value);

        if (isIncomplete(newValues)) {
          props.childrenProps.onChange(formatISOPartialDate(newValues));
        }

        props.childrenProps.onBlur(props.childrenProps.idSchema.$id);
      }}
      // onDateBlur={(e) => e.preventDefault()}
      value={formattedValue}
      error={errorVal}
    />
  );
}
