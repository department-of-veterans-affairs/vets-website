import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { connect, useSelector } from 'react-redux';

import RoutedSavableApp from 'platform/forms/save-in-progress/RoutedSavableApp';
import { isLoggedIn } from 'platform/user/selectors';
import scrollTo from 'platform/utilities/ui/scrollTo';
import { setData } from 'platform/forms-system/src/js/actions';
import { useBrowserMonitoring } from '../hooks/useBrowserMonitoring';

import { wrapWithBreadcrumb } from '../components/Breadcrumbs';
import formConfig from '../config/form';
import configService from '../utilities/configService';
import { getFormSubtitle } from '../utilities/helpers';

import { useDefaultFormData } from '../hooks/useDefaultFormData';

import { selectFeatureToggles } from '../utilities/selectors/featureToggles';

import { selectAuthStatus } from '../utilities/selectors/authStatus';

function App({ location, children, formData }) {
  const subTitle = getFormSubtitle(formData);
  const { isLoadingFeatureFlags } = useSelector(selectFeatureToggles);
  const { isLoadingProfile } = useSelector(selectAuthStatus);
  const isAppLoading = isLoadingFeatureFlags || isLoadingProfile;

  // Use Datadog Real User Monitoring (RUM)
  useBrowserMonitoring();

  // Set default view fields within the form data
  useDefaultFormData();

  const { pathname } = location || {};
  const [updatedFormConfig, setUpdatedFormConfig] = useState({ ...formConfig });

  useEffect(
    () => {
      if (!pathname?.includes('introduction')) {
        scrollTo('topScrollElement');
      }
    },
    [pathname],
  );

  // dynamically updates the form subtitle to 21-22 or 21-22A
  useEffect(
    () => {
      configService.setFormConfig({ subTitle });
      setUpdatedFormConfig(configService.getFormConfig());
    },
    [subTitle],
  );

  const content = (
    <RoutedSavableApp formConfig={updatedFormConfig} currentLocation={location}>
      {children}
    </RoutedSavableApp>
  );

  if (isAppLoading) {
    return (
      <va-loading-indicator
        message={content['load-app']}
        class="vads-u-margin-y--4"
        set-focus
      />
    );
  }

  return wrapWithBreadcrumb(
    <article id="form-21-22" data-location={`${pathname?.slice(1)}`}>
      {content}
    </article>,
  );
}

const mapStateToProps = state => ({
  profile: state.user.profile,
  formData: state.form?.data,
  loggedIn: isLoggedIn(state),
});

const mapDispatchToProps = {
  setFormData: setData,
};

App.propTypes = {
  children: PropTypes.node,
  formData: PropTypes.object,
  location: PropTypes.object,
  loggedIn: PropTypes.bool,
  setFormData: PropTypes.func,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(App);
