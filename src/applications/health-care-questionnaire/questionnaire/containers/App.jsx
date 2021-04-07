import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';

import LoadingIndicator from '@department-of-veterans-affairs/component-library/LoadingIndicator';

import RequiredLoginView from 'platform/user/authorization/components/RequiredLoginView';
import backendServices from 'platform/user/profile/constants/backendServices';
import environment from 'platform/utilities/environment';
import RoutedSavableApp from 'platform/forms/save-in-progress/RoutedSavableApp';
import {
  externalServices,
  DowntimeNotification,
} from 'platform/monitoring/DowntimeNotification';

import { setData } from 'platform/forms-system/src/js/actions';

import formConfig from '../config/form';

import {
  questionnaireAppointmentLoading,
  questionnaireAppointmentLoaded,
} from '../actions';

import {
  getSelectedAppointmentData,
  getCurrentAppointmentId,
  clearCurrentSession,
} from '../../shared/utils';

import {
  locationSelector,
  organizationSelector,
} from '../../shared/utils/selectors';

const App = props => {
  const { location, children } = props;
  const {
    setLoading,
    setLoadedAppointment,
    isLoadingAppointmentDetails,
    isLoggedIn,
    setFormData,
    formData,
    user,
  } = props;
  const [isLoading, setIsLoading] = useState(true);
  const [form, setForm] = useState(formConfig);
  const appointmentFormData = formData['hidden:appointment'];
  const questionnaireFormData = formData['hidden:questionnaire'];
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
        const {
          appointment,
          questionnaire,
          location: clinic,
          organization: facility,
        } = data;
        if (!appointmentFormData || !questionnaireFormData) {
          setFormData({
            'hidden:appointment': appointment,
            'hidden:questionnaire': questionnaire,
            'hidden:clinic': clinic,
          });
        }
        setLoadedAppointment(data);
        setIsLoading(false);
        const apptType = locationSelector.getType(clinic)?.toLowerCase();
        const facilityName = organizationSelector.getName(facility);
        setForm(f => {
          return {
            ...f,
            title: `Answer ${apptType} questionnaire`,
            subTitle: facilityName,
          };
        });
      } else {
        setIsLoading(false);
      }
    },
    [
      setLoading,
      setLoadedAppointment,
      isLoggedIn,
      setFormData,
      appointmentFormData,
      questionnaireFormData,
    ],
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
        <RequiredLoginView
          serviceRequired={[backendServices.USER_PROFILE]}
          user={user}
          verify={!environment.isLocalhost()}
        >
          <DowntimeNotification
            appTitle="health questionnaire"
            dependencies={[externalServices.hcq]}
          >
            <RoutedSavableApp formConfig={form} currentLocation={location}>
              {children}
            </RoutedSavableApp>
          </DowntimeNotification>
        </RequiredLoginView>
      </>
    );
  }
};

const mapStateToProps = state => ({
  showApplication: true,
  questionnaire: state.questionnaireData,
  isLoadingAppointmentDetails:
    state?.questionnaireData.context?.status.isLoading,
  isLoggedIn: state?.user?.login?.currentlyLoggedIn,
  formData: state.form?.data,
  user: state.user,
});

const mapDispatchToProps = dispatch => {
  return {
    setFormData: data => dispatch(setData(data)),
    setLoading: () => dispatch(questionnaireAppointmentLoading()),
    setLoadedAppointment: value =>
      dispatch(questionnaireAppointmentLoaded(value)),
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(App);
