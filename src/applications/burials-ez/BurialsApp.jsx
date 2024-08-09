import React from 'react';
import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';

import RoutedSavableApp from '@department-of-veterans-affairs/platform-forms/RoutedSavableApp';
import formConfig from './config/form';
import { NoFormPage } from './components/NoFormPage';

export default function BurialsEntry({ location, children }) {
  const { loading: isLoadingFeatures, burialFormEnabled } = useSelector(
    state => state?.featureToggles,
  );

  if (isLoadingFeatures) {
    return <va-loading-indicator message="Loading application..." />;
  }

  if (!burialFormEnabled) {
    if (location.pathname !== '/introduction') {
      window.location.href = '/burials-memorials/veterans-burial-allowance/';
      return <></>;
    }
    return <NoFormPage />;
  }

  const breadcrumbs = [
    {
      href: '/',
      label: 'Home',
    },
    {
      href: '/burials-memorials/',
      label: 'Burials and memorials',
    },
    {
      href: '/burials-memorials/veterans-burial-allowance',
      label: 'Veterans burial allowance and transportation benefits',
    },
    {
      href:
        '/burials-memorials/veterans-burial-allowance/apply-for-allowance-form-21p-530ez',
      label:
        'Apply for a Veterans burial allowance and transportation benefits',
    },
  ];
  const rawBreadcrumbs = JSON.stringify(breadcrumbs);
  return (
    <>
      <RoutedSavableApp formConfig={formConfig} currentLocation={location}>
        <va-breadcrumbs breadcrumb-list={rawBreadcrumbs} wrapping />
        {children}
      </RoutedSavableApp>
    </>
  );
}

BurialsEntry.propTypes = {
  children: PropTypes.node.isRequired,
  location: PropTypes.object.isRequired,
};
