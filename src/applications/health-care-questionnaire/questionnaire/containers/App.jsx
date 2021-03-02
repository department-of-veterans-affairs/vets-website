import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';

import LoadingIndicator from '@department-of-veterans-affairs/component-library/LoadingIndicator';

import RoutedSavableApp from 'platform/forms/save-in-progress/RoutedSavableApp';
import {
  externalServices,
  DowntimeNotification,
} from 'platform/monitoring/DowntimeNotification';

import formConfig from '../config/form';

import {
  questionnaireAppointmentLoading,
  questionnaireAppointmentLoaded,
} from '../actions';

import {
  getSelectedAppointmentData,
  getAppointTypeFromAppointment,
  getCurrentAppointmentId,
  clearCurrentSession,
} from '../../shared/utils';

const App = props => {
  const { location, children } = props;
  const {
    setLoading,
    setLoadedAppointment,
    isLoadingAppointmentDetails,
    isLoggedIn,
  } = props;
  const [isLoading, setIsLoading] = useState(true);
  const [form, setForm] = useState(formConfig);

  useEffect(
    () => {
      const id = getCurrentAppointmentId(window);
      if (isLoggedIn) {
        setLoading();
        const data = getSelectedAppointmentData(window, id);
        if (!data) {
          clearCurrentSession(window);
          window.location.replace(
            '/health-care/health-questionnaires/questionnaires',
          );
        }
        const { appointment } = data;

        setLoadedAppointment(appointment);
        setIsLoading(false);
        const apptType = getAppointTypeFromAppointment(appointment);
        setForm(f => {
          return {
            ...f,
            title: `Answer ${apptType} questionnaire`,
            subTitle:
              appointment?.attributes?.vdsAppointments[0]?.clinic?.facility
                ?.displayName,
          };
        });
      } else {
        setIsLoading(false);
      }
    },
    [setLoading, setLoadedAppointment, isLoggedIn],
  );
  if (isLoading || isLoadingAppointmentDetails) {
    return (
      <>
        <LoadingIndicator message="Please wait while we load your appointment details..." />
      </>
    );
  } else {
    return (
      <>
        <DowntimeNotification
          appTitle="health questionnaire"
          dependencies={[externalServices.hcq]}
        >
          <RoutedSavableApp formConfig={form} currentLocation={location}>
            {children}
          </RoutedSavableApp>
        </DowntimeNotification>
      </>
    );
  }
};

const mapStateToProps = state => ({
  showApplication: true,
  questionnaire: state?.questionnaireData,
  isLoadingAppointmentDetails:
    state?.questionnaireData.context?.status.isLoading,
  isLoggedIn: state?.user?.login?.currentlyLoggedIn,
});

const mapDispatchToProps = dispatch => {
  return {
    setLoading: () => dispatch(questionnaireAppointmentLoading()),
    setLoadedAppointment: value =>
      dispatch(questionnaireAppointmentLoaded(value)),
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(App);
