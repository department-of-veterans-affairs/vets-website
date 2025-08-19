import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';

import RoutedSavableApp from 'platform/forms/save-in-progress/RoutedSavableApp';
import formConfig from '../config/form';
import NoFormPage from '../components/NoFormPage';
import manifest from '../manifest.json';
import { TITLE } from '../constants';

// Must match the H1
document.title = TITLE;

export default function App({ location, children }) {
  const featureToggle = useSelector(
    state => state?.featureToggles?.vaDependentsVerification,
  );
  const externalServicesLoading = useSelector(
    state => state?.externalServiceStatus?.loading,
  );
  const dependentsLoading = useSelector(state => {
    return state?.dependents?.loading;
  });
  const isIntroPage = location?.pathname?.endsWith('/introduction');
  const { pathname } = location || {};
  const pageUrl = pathname?.slice(1);

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
      label:
        pageUrl === 'exit-form'
          ? 'Update your dependents in a different form'
          : 'Verify your dependents for disability benefits',
    },
  ];

  const rawBreadcrumbs = JSON.stringify(breadcrumbs);

  useEffect(() => {
    if (!isIntroPage && dependentsLoading) {
      window.location.replace(`${manifest.rootUrl}/introduction`);
    }
  }, []);

  let content;

  if (!featureToggle) {
    content = <NoFormPage />;
  } else if (externalServicesLoading) {
    content = <va-loading-indicator message="Loading your information..." />;
  } else {
    content = (
      <RoutedSavableApp formConfig={formConfig} currentLocation={location}>
        {children}
      </RoutedSavableApp>
    );
  }

  return (
    <article id="form-0538" data-location={pageUrl}>
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
