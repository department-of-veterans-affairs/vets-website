import React from 'react';
import { VaMemorableDate } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import { useVaDateCommon } from 'platform/forms-system/src/js/web-component-fields/useVaDateCommon';

/**
 * VaMemorableDateField with custom error messages
 * @param {WebComponentFieldProps} props
 */
export default function DateField(props) {
  const {
    mappedProps,
    formattedValue,
    onDateChange,
    onDateBlur,
  } = useVaDateCommon(props);

  const customYearErrorMessage = props.uiOptions?.customYearErrorMessage;
  const customMonthErrorMessage = props.uiOptions?.customMonthErrorMessage;
  const customDayErrorMessage = props.uiOptions?.customDayErrorMessage;
  const removeDateHint = props.uiOptions?.removeDateHint;

  return (
    <VaMemorableDate
      {...mappedProps}
      externalValidation
      monthSelect={props.uiOptions?.monthSelect ?? true}
      onDateChange={onDateChange}
      onDateBlur={onDateBlur}
      value={formattedValue}
      {...customYearErrorMessage && {
        customYearErrorMessage,
      }}
      {...customMonthErrorMessage && {
        customMonthErrorMessage,
      }}
      {...customDayErrorMessage && {
        customDayErrorMessage,
      }}
      {...removeDateHint && {
        removeDateHint,
      }}
    />
  );
}

DateField.propTypes = VaMemorableDate.propTypes;
