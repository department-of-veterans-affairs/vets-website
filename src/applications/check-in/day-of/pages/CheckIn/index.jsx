import React, { useCallback, useMemo } from 'react';
import PropTypes from 'prop-types';
import { connect, useSelector } from 'react-redux';

import LoadingIndicator from '@department-of-veterans-affairs/component-library/LoadingIndicator';

import { triggerRefresh } from '../../actions';

import DisplayMultipleAppointments from './DisplayMultipleAppointments';

import { makeSelectAppointmentListData } from '../../hooks/selectors';

const CheckIn = props => {
  const {
    appointments,
    isDemographicsPageEnabled,
    isLoading,
    isUpdatePageEnabled,
    refreshAppointments,
    router,
  } = props;
  const appointment = appointments ? appointments[0] : {};
  const selectAppointmentListData = useMemo(makeSelectAppointmentListData, []);
  const { context } = useSelector(selectAppointmentListData);
  const { token } = context;

  const getMultipleAppointments = useCallback(
    () => {
      refreshAppointments();
    },
    [refreshAppointments],
  );

  if (isLoading || !appointment) {
    return <LoadingIndicator message={'Loading your appointments for today'} />;
  } else {
    return (
      <DisplayMultipleAppointments
        isUpdatePageEnabled={isUpdatePageEnabled}
        isDemographicsPageEnabled={isDemographicsPageEnabled}
        router={router}
        token={token}
        appointments={appointments}
        getMultipleAppointments={getMultipleAppointments}
      />
    );
  }
};

const mapDispatchToProps = dispatch => {
  return {
    refreshAppointments: () => dispatch(triggerRefresh()),
  };
};

CheckIn.propTypes = {
  appointments: PropTypes.array,
  isDemographicsPageEnabled: PropTypes.bool,
  isLoading: PropTypes.bool,
  isUpdatePageEnabled: PropTypes.bool,
  refreshAppointments: PropTypes.func,
  router: PropTypes.object,
};

export default connect(
  null,
  mapDispatchToProps,
)(CheckIn);
