import React, { useMemo } from 'react';
import { VaMemorableDate } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import { useVaDateCommon } from './useVaDateCommon';

/**
 * Get the number of days in a given month and year
 * @param {number} month - Month (1-12)
 * @param {number} year - Year (e.g., 2023)
 * @returns {number} Number of days in the month
 */
function getDaysInMonth(month, year) {
  if (!month || month < 1 || month > 12) {
    return 31; // Default to 31 if month is invalid
  }

  // Create a date object for the first day of the next month, then go back one day
  // This automatically handles leap years
  const date = new Date(year || 2000, month, 0);
  return date.getDate();
}

/**
 * @param {WebComponentFieldProps} props
 */
export default function VaMemorableDateField(props) {
  const {
    mappedProps,
    formattedValue,
    onDateChange,
    onDateBlur,
    values,
  } = useVaDateCommon(props);

  const customYearErrorMessage = props.uiOptions?.customYearErrorMessage;
  const customMonthErrorMessage = props.uiOptions?.customMonthErrorMessage;
  const customDayErrorMessageTemplate = props.uiOptions?.customDayErrorMessage;

  // Dynamically calculate max days based on selected month and year
  const customDayErrorMessage = useMemo(
    () => {
      const month = values?.month ? parseInt(values.month, 10) : null;
      const year = values?.year ? parseInt(values.year, 10) : null;

      if (month && month >= 1 && month <= 12) {
        const maxDays = getDaysInMonth(month, year);
        return `Enter a day between 1 and ${maxDays}`;
      }

      // If no month selected or invalid, return the template or default message
      return customDayErrorMessageTemplate || 'Enter a day between 1 and 31';
    },
    [values?.month, values?.year, customDayErrorMessageTemplate],
  );

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
    />
  );
}

VaMemorableDateField.identifier = 'VaMemorableDateField';
