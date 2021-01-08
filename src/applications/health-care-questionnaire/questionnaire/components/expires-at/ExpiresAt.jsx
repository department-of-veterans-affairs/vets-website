import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import moment from 'moment';

import { getAppointmentTimeFromAppointment } from '../../utils';

const ExpiresAt = props => {
  const { onChange, appointment } = props;
  const time = getAppointmentTimeFromAppointment(appointment);
  const currentValue = time;
  const [diff, setDiff] = useState(60);
  useEffect(
    () => {
      // Only try to use the booking note there is not a current value.
      if (currentValue) {
        const x = moment(currentValue);
        const y = moment();
        setDiff(x.diff(y, 'days') + 1);
      }
    },
    [currentValue],
  );

  useEffect(
    () => {
      onChange(diff);
    },
    [diff, onChange],
  );

  return <></>;
};

const mapStateToProps = state => ({
  appointment: state?.questionnaireData?.context?.appointment,
});

export default connect(
  mapStateToProps,
  null,
)(ExpiresAt);
