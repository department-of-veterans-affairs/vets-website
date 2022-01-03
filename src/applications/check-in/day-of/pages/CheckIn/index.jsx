import React, { useCallback, useMemo } from 'react';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';

import { triggerRefresh } from '../../actions';

import DisplayMultipleAppointments from './DisplayMultipleAppointments';

import { makeSelectAppointmentListData } from '../../hooks/selectors';

const CheckIn = props => {
  const { appointments, isLoading, router } = props;
  const appointment = appointments ? appointments[0] : {};
  const selectAppointmentListData = useMemo(makeSelectAppointmentListData, []);
  const { context } = useSelector(selectAppointmentListData);
  const { token } = context;
  const dispatch = useDispatch();

  const getMultipleAppointments = useCallback(
    () => {
      dispatch(triggerRefresh());
    },
    [dispatch],
  );

  if (isLoading || !appointment) {
    return (
      <va-loading-indicator message={'Loading your appointments for today'} />
    );
  } else {
    return (
      <DisplayMultipleAppointments
        router={router}
        token={token}
        appointments={appointments}
        getMultipleAppointments={getMultipleAppointments}
      />
    );
  }
};

CheckIn.propTypes = {
  appointments: PropTypes.array,
  isLoading: PropTypes.bool,
  router: PropTypes.object,
};

export default CheckIn;
