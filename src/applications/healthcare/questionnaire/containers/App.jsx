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
  const { setLoading, setLoadedAppointment } = props;

  useEffect(
    () => {
      setLoading();
      setTimeout(() => {
        setLoadedAppointment({ hello: 'world' });
      }, 3000);
    },
    [setLoading, setLoadedAppointment],
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
