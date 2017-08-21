import React from 'react';
import moment from 'moment';

import ErrorableDate from './ErrorableDate';
import { isDirtyDate } from '../../utils/validations';
import { dateToMoment } from '../../utils/helpers';

export default function ErrorableCurrentOrPastDate(props) {
  let validation = {
    valid: true,
    message: null
  };

  // we’re assuming any custom validation goes after
  // the past date check, because if you want to override that check
  // you should just be using ErrorableDate
  if (isDirtyDate(props.date)) {
    if (dateToMoment(props.date).isAfter(moment().startOf('day'))) {
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
