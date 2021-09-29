import React, { useState, useEffect } from 'react';
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
    isLowAuthEnabled,
    setAppointment,
    setMultipleAppointments,
    isMultipleAppointmentsEnabled,
  } = props;
  const appointment = appointments[0];

  const [isLoadingData, setIsLoadingData] = useState(!appointment.startTime);
  const { token } = context;
  useEffect(
    () => {
      if (isLowAuthEnabled) {
        if (isMultipleAppointmentsEnabled) {
          setIsLoadingData(true);
          api.v2
            .getCheckInData(token)
            .then(json => {
              const { payload } = json;
              setMultipleAppointments(payload, token);
              setIsLoadingData(false);
              focusElement('h1');
            })
            .catch(() => {
              goToNextPage(router, URLS.ERROR);
            });
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
      } else {
        focusElement('h1');
      }
    },
    [
      token,
      isLowAuthEnabled,
      setAppointment,
      setMultipleAppointments,
      router,
      isMultipleAppointmentsEnabled,
    ],
  );

  if (isLoadingData) {
    return <LoadingIndicator message={'Loading appointment details'} />;
  } else if (!appointment) {
    goToNextPage(router, URLS.ERROR);
    return <></>;
  } else {
    return (
      <FeatureToggle on={isMultipleAppointmentsEnabled}>
        <FeatureOn>
          <DisplayMultipleAppointments
            isUpdatePageEnabled={isUpdatePageEnabled}
            isLowAuthEnabled={isLowAuthEnabled}
            router={router}
            token={token}
            appointments={appointments}
          />
        </FeatureOn>
        <FeatureOff>
          <DisplaySingleAppointment
            isUpdatePageEnabled={isUpdatePageEnabled}
            isLowAuthEnabled={isLowAuthEnabled}
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
