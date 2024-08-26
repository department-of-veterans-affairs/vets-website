import { useState } from 'react';
import moment from 'moment';
import vaDateCommonFieldMapping from 'platform/forms-system/src/js/web-component-fields/vaDateCommonFieldMapping';
import {
  formatISOPartialDate,
  formatMonthYearISOPartialDate,
  parseISODate,
} from 'platform/forms-system/src/js/helpers';

export function useVaDateCommon(props) {
  const mappedProps = vaDateCommonFieldMapping(props);
  const [values, setValues] = useState(parseISODate(mappedProps.value));
  const [errorVal, setErrorVal] = useState(mappedProps.errors);
  const monthYearOnly = props?.uiOptions?.monthYearOnly;

  const formatter = monthYearOnly
    ? formatMonthYearISOPartialDate
    : formatISOPartialDate;

  /**
   * We store the value in redux as this format: XXXX-03-XX, with X and 0 padding.
   * The component expects the value in this format: '--', '19--', '1999--', '1999-3-', '1999-3-1', '1999-03-12'
   * During user input, we want to make sure there is no leading zero
   *   so that they can type two digits for day/month.
   *
   * parseISODate(XXXX-03-XX) => { year: 1999, month: '', day: '01' }
   * formatISOPartialDate({ day, month, year }) => XXXX-03-XX
   */
  const formattedValue = formatter(values)
    ?.replace(/X/g, '')
    ?.replace(/-0(\d)/g, '-$1');

  const isIncomplete = (vals = {}) => {
    return (
      !vals.year ||
      !vals.month ||
      Number(vals.month) === 0 ||
      Number(vals.year) === 0 ||
      (!monthYearOnly && (!vals.day || Number(vals.day) === 0))
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

  const isYearNotNumbers = (vals = {}) => {
    return isNaN(vals.year);
  };

  const yearErrorMessage = `Please enter a year between 1900 and ${currentYear()}`;

  function onDateChange(event, newValue) {
    const date = newValue ?? event.target.value ?? undefined;
    const newValues = parseISODate(date);
    setValues(newValues);
    setErrorVal('');

    if (isIncomplete(newValues)) {
      props.childrenProps.onChange(undefined);
    } else {
      props.childrenProps.onChange(formatter(newValues));
    }

    if (isMonthInvalid(newValues)) {
      setErrorVal('Enter a valid month');
    }

    if (isDayInvalid(newValues)) {
      setErrorVal('Enter a valid day');
    }

    if (
      isMonthNotNumbers(newValues) ||
      isDayNotNumbers(newValues) ||
      isYearNotNumbers(newValues)
    ) {
      setErrorVal('Input numbers only');
    }

    if (isDateInvalid(newValues)) {
      setErrorVal('Please provide a valid current or past date');
    }
  }

  function onDateBlur(event) {
    const newValues = parseISODate(event.target.value);

    if (isIncomplete(newValues)) {
      props.childrenProps.onChange(formatter(newValues));
    }

    props.childrenProps.onBlur(props.childrenProps.idSchema.$id);
  }

  return {
    mappedProps,
    formattedValue,
    errorVal,
    onDateChange,
    onDateBlur,
    yearErrorMessage,
  };
}
