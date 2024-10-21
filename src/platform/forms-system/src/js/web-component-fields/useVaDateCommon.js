import { useState } from 'react';
import vaDateCommonFieldMapping from './vaDateCommonFieldMapping';
import {
  formatISOPartialDate,
  formatMonthYearISOPartialDate,
  parseISODate,
} from '../helpers';

export function useVaDateCommon(props) {
  const mappedProps = vaDateCommonFieldMapping(props);
  const [values, setValues] = useState(parseISODate(mappedProps.value));
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

  function onDateChange(event, newValue) {
    const date = newValue ?? event.target.value ?? undefined;
    const newValues = parseISODate(date);
    setValues(newValues);

    if (isIncomplete(newValues)) {
      props.childrenProps.onChange(undefined);
    } else {
      props.childrenProps.onChange(formatter(newValues));
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
    onDateChange,
    onDateBlur,
  };
}
