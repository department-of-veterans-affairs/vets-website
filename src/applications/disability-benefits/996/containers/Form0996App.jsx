import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import LoadingIndicator from '@department-of-veterans-affairs/component-library/LoadingIndicator';

import RoutedSavableApp from 'platform/forms/save-in-progress/RoutedSavableApp';
import { isLoggedIn } from 'platform/user/selectors';
import scrollToTop from 'platform/utilities/ui/scrollToTop';
import { focusElement } from 'platform/utilities/ui';
import { WIZARD_STATUS_COMPLETE } from 'platform/site-wide/wizard';
import { setData } from 'platform/forms-system/src/js/actions';

import formConfig from '../config/form';
import { IS_PRODUCTION } from '../constants';
import { getHlrWizardStatus, shouldShowWizard } from '../wizard/utils';

export const Form0996App = ({
  loggedIn,
  location,
  children,
  formData,
  setFormData,
  router,
  savedForms,
  hlrV2,
}) => {
  useEffect(
    () => {
      if (
        loggedIn &&
        typeof hlrV2 !== 'undefined' &&
        typeof formData.hlrV2 === 'undefined'
      ) {
        setFormData({
          ...formData,
          hlrV2,
        });
      }
      if (
        getHlrWizardStatus() === WIZARD_STATUS_COMPLETE &&
        window.location.pathname.endsWith('/introduction')
      ) {
        focusElement('h1');
        scrollToTop();
      }
    },
    [loggedIn, formData, setFormData, hlrV2],
  );

  if (!IS_PRODUCTION && shouldShowWizard(formConfig.formId, savedForms)) {
    router.push('/start');
    return (
      <h1 className="vads-u-font-family--sans vads-u-font-size--base vads-u-font-weight--normal">
        <LoadingIndicator message="Please wait while we restart the application for you." />
      </h1>
    );
  }

  // Add data-location attribute to allow styling specific pages
  return (
    <article id="form-0996" data-location={`${location?.pathname?.slice(1)}`}>
      <RoutedSavableApp formConfig={formConfig} currentLocation={location}>
        {children}
      </RoutedSavableApp>
    </article>
  );
};

const mapStateToProps = state => ({
  loggedIn: isLoggedIn(state),
  formData: state.form?.data || {},
  savedForms: state.user?.profile?.savedForms || [],
  hlrV2: state.featureToggles.hlrV2,
});

const mapDispatchToProps = {
  setFormData: setData,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Form0996App);
