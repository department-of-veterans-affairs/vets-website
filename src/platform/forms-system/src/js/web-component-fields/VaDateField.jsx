import React from 'react';
import { VaDate } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import { useVaDateCommon } from './useVaDateCommon';

/**
 * @param {WebComponentFieldProps} props
 */
export default function VaDateField(props) {
  const {
    mappedProps,
    formattedValue,
    onDateChange,
    onDateBlur,
  } = useVaDateCommon(props);

  return (
    <VaDate
      {...mappedProps}
      monthYearOnly={props.uiOptions?.monthYearOnly ?? false}
      onDateChange={onDateChange}
      onDateBlur={onDateBlur}
      value={formattedValue}
    />
  );
}
