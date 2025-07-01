import React from 'react';
import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';

import RoutedSavableApp from 'platform/forms/save-in-progress/RoutedSavableApp';
import formConfig from '../config/form';
import NoFormPage from '../components/NoFormPage';

export default function App({ location, children }) {
  const featureToggle = useSelector(
    state => state?.featureToggles?.vaDependentsVerification,
  );

  const breadcrumbs = [
    { href: '/', label: 'Home' },
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
