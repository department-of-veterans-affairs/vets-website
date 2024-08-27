import React from 'react';
import { VaMemorableDate } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import { useVaDateCommon } from '../utils/useVaDateCommon';

/**
 * @param {WebComponentFieldProps} props
 */
export default function VaMemorableDateField(props) {
  const {
    mappedProps,
    formattedValue,
    errorVal,
    onDateChange,
    onDateBlur,
    yearErrorMessage,
  } = useVaDateCommon(props);

  return (
    <VaMemorableDate
      customMonthErrorMessage="Enter a valid month"
      customDayErrorMessage="Enter a valid day"
      customYearErrorMessage={yearErrorMessage}
      {...mappedProps}
      monthSelect={props.uiOptions?.monthSelect ?? true}
      onDateChange={onDateChange}
      onDateBlur={onDateBlur}
      value={formattedValue}
      errors={errorVal}
    />
  );
}
