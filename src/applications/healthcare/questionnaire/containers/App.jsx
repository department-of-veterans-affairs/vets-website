import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';

import LoadingIndicator from '@department-of-veterans-affairs/formation-react/LoadingIndicator';

import RoutedSavableApp from 'platform/forms/save-in-progress/RoutedSavableApp';
import formConfig from '../config/form';

import {
  questionnaireAppointmentLoading,
  questionnaireAppointmentLoaded,
} from '../actions';
import { loadAppointment } from '../api';

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
      if (isLoggedIn) {
        setLoading();
        loadAppointment().then(response => {
          const { data } = response;
          setLoadedAppointment(data);
          setIsLoading(false);
          setForm(f => {
            return {
              ...f,
              title: 'Answer primary care questionnaire',
              subTitle:
                data?.attributes?.vdsAppointments[0]?.clinic?.facility
                  ?.displayName,
            };
          });
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
        <RoutedSavableApp formConfig={form} currentLocation={location}>
          {children}
        </RoutedSavableApp>
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
