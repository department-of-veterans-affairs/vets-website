import React from 'react';
import ErrorableDate from './ErrorableDate';
import { isValidDateField, isDirtyDate } from '../../utils/validations';

export default function ErrorableCurrentOrPastDate(props) {
  let validation = {
    valid: true,
    message: null
  };

  if (isDirtyDate(props.date)) {
    if (!isValidDateField(props.date)) {
      validation = {
        valid: false,
        message: props.invalidMessage
      };
    } else if (props.validation) {
      validation = props.validation;
    }
  }
  return (
    <ErrorableDate
        {...props}
        validation={validation}/>
  );
}

ErrorableCurrentOrPastDate.defaultProps = {
  invalidMessage: 'Please provide a valid date in the past'
};
