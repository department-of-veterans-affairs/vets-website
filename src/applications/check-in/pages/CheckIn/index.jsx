import React, { useState, useEffect, useCallback } from 'react';
import { connect } from 'react-redux';

import LoadingIndicator from '@department-of-veterans-affairs/component-library/LoadingIndicator';

import { focusElement } from 'platform/utilities/ui';

import {
  receivedAppointmentDetails,
  receivedMultipleAppointmentDetails,
} from '../../actions';
import { goToNextPage, URLS } from '../../utils/navigation';
import { api } from '../../api';

import FeatureToggle, {
  FeatureOn,
  FeatureOff,
} from '../../components/FeatureToggle';
import DisplaySingleAppointment from './DisplaySingleAppointment';
import DisplayMultipleAppointments from './DisplayMultipleAppointments';

const CheckIn = props => {
  const {
    router,
    appointments,
    context,
    isUpdatePageEnabled,
    setAppointment,
    setMultipleAppointments,
    isMultipleAppointmentsEnabled,
  } = props;
  const appointment = appointments[0];

  const [isLoadingData, setIsLoadingData] = useState(!appointment.startTime);
  const { token } = context;

  const getMultipleAppointments = useCallback(
    () => {
      setIsLoadingData(true);
      api.v2
        .getCheckInData(token)
        .then(json => {
          const { payload } = json;
          setMultipleAppointments(payload.appointments, token);
          setIsLoadingData(false);
          focusElement('h1');
        })
        .catch(() => {
          goToNextPage(router, URLS.ERROR);
        });
    },
    [token, setMultipleAppointments, setIsLoadingData, router],
  );

  useEffect(
    () => {
      if (isMultipleAppointmentsEnabled) {
        getMultipleAppointments();
      } else {
        // load data from checks route
        api.v1
          .getCheckInData(token)
          .then(json => {
            const { payload } = json;
            setAppointment(payload, token);
            setIsLoadingData(false);
            focusElement('h1');
          })
          .catch(() => {
            goToNextPage(router, URLS.ERROR);
          });
      }
    },
    [
      isMultipleAppointmentsEnabled,
      getMultipleAppointments,
      router,
      setAppointment,
      setMultipleAppointments,
      token,
    ],
  );

  if (isLoadingData) {
    return <LoadingIndicator message={'Loading your appointments for today'} />;
  } else if (!appointment) {
    goToNextPage(router, URLS.ERROR);
    return <></>;
  } else {
    return (
      <FeatureToggle on={isMultipleAppointmentsEnabled}>
        <FeatureOn>
          <DisplayMultipleAppointments
            isUpdatePageEnabled={isUpdatePageEnabled}
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
    appointments: state.checkInData.appointments,
    context: state.checkInData.context,
  };
};
const mapDispatchToProps = dispatch => {
  return {
    setAppointment: (data, token) =>
      dispatch(receivedAppointmentDetails(data, token)),
    setMultipleAppointments: (data, token) =>
      dispatch(receivedMultipleAppointmentDetails(data, token)),
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(CheckIn);
