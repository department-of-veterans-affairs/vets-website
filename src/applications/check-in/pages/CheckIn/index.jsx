import React, { useCallback } from 'react';
import { connect } from 'react-redux';

import LoadingIndicator from '@department-of-veterans-affairs/component-library/LoadingIndicator';

import {
  receivedAppointmentDetails,
  receivedMultipleAppointmentDetails,
  triggerRefresh,
} from '../../actions';

import FeatureToggle, {
  FeatureOn,
  FeatureOff,
} from '../../components/FeatureToggle';
import DisplaySingleAppointment from './DisplaySingleAppointment';
import DisplayMultipleAppointments from './DisplayMultipleAppointments';

const CheckIn = props => {
  const {
    appointments,
    context,
    isDemographicsPageEnabled,
    isLoading,
    isUpdatePageEnabled,
    isMultipleAppointmentsEnabled,
    router,
    refreshAppointments,
  } = props;
  // console.log('check0in', { props });
  const appointment = appointments ? appointments[0] : {};

  const { token } = context;

  const getMultipleAppointments = useCallback(
    () => {
      refreshAppointments();
    },
    [refreshAppointments],
  );

  if (isLoading) {
    return <LoadingIndicator message={'Loading your appointments for today'} />;
  } else {
    return (
      <FeatureToggle on={isMultipleAppointmentsEnabled}>
        <FeatureOn>
          <DisplayMultipleAppointments
            isUpdatePageEnabled={isUpdatePageEnabled}
            isDemographicsPageEnabled={isDemographicsPageEnabled}
            router={router}
            token={token}
            appointments={appointments}
            getMultipleAppointments={getMultipleAppointments}
          />
        </FeatureOn>
        <FeatureOff>
          <DisplaySingleAppointment
            isUpdatePageEnabled={isUpdatePageEnabled}
            router={router}
            token={token}
            appointment={appointment}
          />
        </FeatureOff>
      </FeatureToggle>
    );
  }
};
const mapStateToProps = state => {
  return {
    context: state.checkInData.context,
  };
};
const mapDispatchToProps = dispatch => {
  return {
    setAppointment: (data, token) =>
      dispatch(receivedAppointmentDetails(data, token)),
    setMultipleAppointments: (data, token) =>
      dispatch(receivedMultipleAppointmentDetails(data, token)),
    refreshAppointments: () => dispatch(triggerRefresh()),
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(CheckIn);
