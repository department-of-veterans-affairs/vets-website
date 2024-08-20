import React from 'react';
import { VaMemorableDate } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import { useVaDateCommon } from './useVaDateCommon';

/**
 * @param {WebComponentFieldProps} props
 */
export default function VaMemorableDateField(props) {
  const {
    mappedProps,
    formattedValue,
    onDateChange,
    onDateBlur,
  } = useVaDateCommon(props);

  return (
    <VaMemorableDate
      {...mappedProps}
      monthSelect={props.uiOptions?.monthSelect ?? true}
      onDateChange={onDateChange}
      onDateBlur={onDateBlur}
      value={formattedValue}
    />
  );
}
