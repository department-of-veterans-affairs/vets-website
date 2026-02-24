import React, { useEffect } from 'react';
import { isLoggedIn } from 'platform/user/selectors';
import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import RoutedSavableApp from 'platform/forms/save-in-progress/RoutedSavableApp';
import formConfig from '../config/form';
import Breadcrumbs from '../components/Breadcrumbs';
import NeedHelp from '../components/NeedHelp';
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
    <div className="form-22-10278-container row">
      <div className="vads-u-padding-left--0">
        <Breadcrumbs />
      </div>
      <RoutedSavableApp formConfig={formConfig} currentLocation={location}>
        {children}
      </RoutedSavableApp>
      <NeedHelp />
    </div>
  );
}

App.propTypes = {
  children: PropTypes.node,
  location: PropTypes.object,
};
