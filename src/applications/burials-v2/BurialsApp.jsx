import React from 'react';
import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';

import RoutedSavableApp from '@department-of-veterans-affairs/platform-forms/RoutedSavableApp';
import formConfig from './config/form';

export default function BurialsEntry({ location, children }) {
  const { profile } = useSelector(state => state?.user);
  const { loading: isLoadingFeatures } = useSelector(
    state => state?.featureToggles,
  );

  if (isLoadingFeatures || !profile || profile.loading) {
    return <va-loading-indicator message="Loading application..." />;
  }

  return (
    <RoutedSavableApp formConfig={formConfig} currentLocation={location}>
      {children}
    </RoutedSavableApp>
  );
}

BurialsEntry.propTypes = {
  children: PropTypes.node.isRequired,
  location: PropTypes.object.isRequired,
};
