import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';

import RoutedSavableApp from 'platform/forms/save-in-progress/RoutedSavableApp';
import formConfig from '../config/form';
import NoFormPage from '../components/NoFormPage';
import manifest from '../manifest.json';

export default function App({ location, children }) {
  const featureToggle = useSelector(
    state => state?.featureToggles?.vaDependentsVerification,
  );
  const externalServicesLoading = useSelector(
    state => state?.externalServiceStatus?.loading,
  );
  const hasSession = JSON.parse(localStorage.getItem('hasSession'));

  const isIntroPage = location?.pathname?.endsWith('/introduction');

  const breadcrumbs = [
    {
      href: '/',
      label: 'Home',
    },
    {
      href: '/view-change-dependents',
      label: 'Manage dependents',
    },
    {
      href:
        '/view-change-dependents/verify-dependents-form-21-0538/introduction',
      label: 'Verify your dependents for disability benefits',
    },
  ];

  const rawBreadcrumbs = JSON.stringify(breadcrumbs);

  useEffect(
    () => {
      if (!hasSession && !isIntroPage) {
        window.location.replace(`${manifest.rootUrl}/introduction`);
      }
    },
    [hasSession, isIntroPage],
  );

  let content;

  if (!featureToggle) {
    content = <NoFormPage />;
  } else if (externalServicesLoading) {
    content = <va-loading-indicator message="Loading your information..." />;
  } else if (!hasSession && !isIntroPage) {
    content = <va-loading-indicator message="Loading your information..." />;
  } else {
    content = (
      <RoutedSavableApp formConfig={formConfig} currentLocation={location}>
        {children}
      </RoutedSavableApp>
    );
  }

  return (
    <article>
      <div className="row">
        <div className="columns">
          <va-breadcrumbs breadcrumb-list={rawBreadcrumbs} wrapping />
        </div>
      </div>
      {content}
    </article>
  );
}

App.propTypes = {
  children: PropTypes.node,
  location: PropTypes.object,
};
