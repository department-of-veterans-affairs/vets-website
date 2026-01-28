import React from 'react';
import { isValidDateString } from 'platform/utilities/date';

export const validatePrepCourseStartDate = (
  errors,
  fieldData,
  formData,
) => {
  if (!fieldData) return;

  if (!isValidDateString(fieldData)) errors.addError('Enter a valid date');

  if (!isValidDateString(formData.prepCourseEndDate)) return;

  const start = new Date(formData.prepCourseStartDate);
  const end = new Date(formData.prepCourseEndDate);

  if (end < start) {
    errors.addError(
      'The start date cannot be after the end date',
    );
  }
  if (
    start.getFullYear() === end.getFullYear() &&
    start.getMonth() === end.getMonth() &&
    start.getDate() === end.getDate()
  ) {
    errors.addError('The start date and end date cannot be the same');
  }
};