import React, { useEffect } from 'react';
import { connect } from 'react-redux';

import RoutedSavableApp from 'platform/forms/save-in-progress/RoutedSavableApp';
import formConfig from '../config/form';

import {
  questionnaireAppointmentLoading,
  questionnaireAppointmentLoaded,
} from '../actions';

const App = props => {
  const { location, children } = props;
  const { setLoading, setLoadedAppointment, isLoggedIn } = props;

  useEffect(
    () => {
      if (isLoggedIn) {
        setLoading();
        setTimeout(() => {
          setLoadedAppointment({ hello: 'world' });
        }, 3000);
      }
    },
    [setLoading, setLoadedAppointment, isLoggedIn],
  );
  return (
    <RoutedSavableApp formConfig={formConfig} currentLocation={location}>
      {children}
    </RoutedSavableApp>
  );
};

const mapStateToProps = state => ({
  showApplication: true,
  questionnaire: state?.questionnaireData,
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
