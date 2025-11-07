import React, { useEffect } from 'react';
import PropTypes from 'prop-types';

import RoutedSavableApp from 'platform/forms/save-in-progress/RoutedSavableApp';
import { isLoggedIn } from 'platform/user/selectors';
import { useSelector } from 'react-redux';
import formConfig from '../config/form';
import manifest from '../manifest.json';

export default function App({ location, children }) {
  const userLoggedIn = useSelector(state => isLoggedIn(state));
  useEffect(
    () => {
      if (!userLoggedIn && location.pathname !== '/introduction') {
        window.location.href = manifest.rootUrl;
      }
    },
    [userLoggedIn, location],
  );

  return (
    <RoutedSavableApp formConfig={formConfig} currentLocation={location}>
      {children}
    </RoutedSavableApp>
  );
}

App.propTypes = {
  children: PropTypes.node,
  location: PropTypes.object,
};
