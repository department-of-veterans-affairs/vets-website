import React, { useState } from 'react';
import { VaMemorableDate } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import vaMemorableDateFieldMapping from './vaMemorableDateFieldMapping';
import { formatISOPartialDate, parseISODate } from '../helpers';

/**
 * Likely should use a datePattern instead of this. See `currentOrPastDateUI()` for example.
 *
 * @param {WebComponentFieldProps} props */
export default function VaMemorableDateField(props) {
  const mappedProps = vaMemorableDateFieldMapping(props);
  const [values, setValues] = useState(parseISODate(mappedProps.value));

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

  return (
    <VaMemorableDate
      {...mappedProps}
      onDateChange={(event, newValue) => {
        const date = newValue ?? event.target.value ?? undefined;
        const newValues = parseISODate(date);
        setValues(newValues);

        if (isIncomplete(newValues)) {
          // if the user has partially filled out the date,
          // represent it as undefined until they have completed it
          // or leave the field (so we don't show errors while they
          // have a WIP value)
          props.childrenProps.onChange(undefined);
        } else {
          props.childrenProps.onChange(formatISOPartialDate(newValues));
        }
      }}
      onDateBlur={event => {
        const newValues = parseISODate(event.target.value);

        if (isIncomplete(newValues)) {
          props.childrenProps.onChange(formatISOPartialDate(newValues));
        }

        props.childrenProps.onBlur(props.childrenProps.idSchema.$id);
      }}
      value={formattedValue}
    />
  );
}
