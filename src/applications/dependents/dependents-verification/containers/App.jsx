import React from 'react';
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
  const loading = useSelector(state => state?.externalServiceStatus?.loading);
  const hasSession = JSON.parse(localStorage.getItem('hasSession'));

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

  const content = featureToggle ? (
    <RoutedSavableApp formConfig={formConfig} currentLocation={location}>
      {children}
    </RoutedSavableApp>
  ) : (
    <NoFormPage />
  );

  // Handle loading
  if (loading) {
    return <va-loading-indicator message="Loading your information..." />;
  }

  // If on intro page, just return content
  if (location?.pathname === '/introduction') {
    return content;
  }

  // If session is missing and path requires it, redirect
  if (!hasSession && location?.pathname?.includes('/introduction')) {
    window.location.replace(`${manifest.rootUrl}/introduction`);
    return <va-loading-indicator message="Loading your information..." />;
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
