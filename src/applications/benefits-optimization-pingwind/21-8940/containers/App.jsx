import React from 'react';
import { useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';


import RoutedSavableApp from 'platform/forms/save-in-progress/RoutedSavableApp';
import {
  DowntimeNotification,
  externalServices,
} from '@department-of-veterans-affairs/platform-monitoring/DowntimeNotification';
import formConfig from '../config/form';

import { toggleValues } from 'platform/site-wide/feature-toggles/selectors';
import FEATURE_FLAG_NAMES from 'platform/utilities/feature-toggles/featureFlagNames';

import { setData } from '@department-of-veterans-affairs/platform-forms-system/actions';
import environment from 'platform/utilities/environment';
import { WIP } from '../../shared/components/WIP';

import { workInProgressContent } from '../definitions/constants';

function App({  location,
  children,
  showForm,
  isLoading,
  formData,
  setFormData,
  isEmailPresenceRequired,}) {

  useEffect(
    () => {
      const hasEmailPresenceChanged =
        formData['view:isEmailPresenceRequired'] !== isEmailPresenceRequired;
    

      if (hasEmailPresenceChanged) {
        setFormData({
          ...formData,
          'view:isEmailPresenceRequired': isEmailPresenceRequired,
         
        });
      }
    },
    [formData, isEmailPresenceRequired, setFormData],
  );

 if (isLoading) {
    return (
      <va-loading-indicator
        message="Please wait while we load the application for you."
        class="vads-u-margin-y--4"
        set-focus
      />
    );
  }

   if (isLoading) {
    return (
      <va-loading-indicator
        message="Please wait while we load the application for you."
        class="vads-u-margin-y--4"
        set-focus
      />
    );
  }

  if (!showForm) {
    return <WIP content={workInProgressContent} />;
  }


  return (
    <RoutedSavableApp formConfig={formConfig} currentLocation={location}>
      <DowntimeNotification
        appTitle="veteran's application for increase compensation based on unemployability"
        dependencies={[externalServices.lighthouseBenefitsIntake]}
      >
        {children}
      </DowntimeNotification>
    </RoutedSavableApp>
  );
}

App.propTypes = {
  children: PropTypes.node,
  formData: PropTypes.object,
  isEmailPresenceRequired: PropTypes.bool,
  isLoading: PropTypes.bool,
  location: PropTypes.object,
  setFormData: PropTypes.func,
  showForm: PropTypes.bool,
};

const mapStateToProps = state => ({
  formData: state?.form?.data || {},
  isLoading: state?.featureToggles?.loading,
  isEmailPresenceRequired: toggleValues(state)[
    FEATURE_FLAG_NAMES.form218940ValidateEmailPresence
  ],
  showForm:
    toggleValues(state)[FEATURE_FLAG_NAMES.form218940] ||
    environment.isLocalhost(),
});

const mapDispatchToProps = {
  setFormData: setData,
};


export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(App);
