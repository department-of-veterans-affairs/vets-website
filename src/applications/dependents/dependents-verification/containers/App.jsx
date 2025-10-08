import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';

import RoutedSavableApp from 'platform/forms/save-in-progress/RoutedSavableApp';
import { useBrowserMonitoring } from 'platform/monitoring/Datadog/';
import environment from 'platform/utilities/environment';
import formConfig from '../config/form';
import NoFormPage from '../components/NoFormPage';
import manifest from '../manifest.json';
import { TITLE } from '../constants';

import { getRootParentUrl } from '../../shared/utils';

// Must match the H1
document.title = TITLE;

export default function App({ location, children }) {
  const isLoggedIn = useSelector(
    state => state?.user?.login?.currentlyLoggedIn,
  );
  const featureToggle = useSelector(
    state => state?.featureToggles?.vaDependentsVerification,
  );
  const externalServicesLoading = useSelector(
    state => state?.externalServiceStatus?.loading,
  );
  const dependentsLoading = useSelector(state => {
    return state?.dependents?.loading;
  });
  const { pathname = '' } = location || {};
  const isIntroPage = pathname.endsWith('/introduction');
  const pageUrl = pathname.slice(1);

  const breadcrumbs = [
    {
      href: '/',
      label: 'Home',
    },
    {
      href: getRootParentUrl(manifest.rootUrl),
      label: 'Manage dependents for disability, pension, or DIC benefits',
    },
    {
      href: `${manifest.rootUrl}/introduction`,
      label:
        pageUrl === 'exit-form'
          ? 'Update your dependents in a different form'
          : 'Verify your dependents for disability benefits',
    },
  ];

  const rawBreadcrumbs = JSON.stringify(breadcrumbs);

  // Add Datadog UX monitoring to the application
  // https://github.com/department-of-veterans-affairs/va.gov-team/issues/116840
  useBrowserMonitoring({
    loggedIn: isLoggedIn,
    toggleName: 'vaDependentsBrowserMonitoringEnabled',
    applicationId: '2f49e2b2-d5d6-4a53-9850-a42ed7ab26d7',
    clientToken: 'pub15c7121f25875066ff90b92371cd7ff4',
    site: 'ddog-gov.com',
    // see https://docs.datadoghq.com/getting_started/site/
    service: 'benefits-dependents-verification',
    version: '1.0.0',
    sessionReplaySampleRate: 100,
    sessionSampleRate: 100,
    defaultPrivacyLevel: 'mask-user-input',
    trackBfcacheViews: true,
    env: environment.isProduction(),
  });

  useEffect(() => {
    if (!isIntroPage && dependentsLoading) {
      location.replace(`${manifest.rootUrl}/introduction`);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
