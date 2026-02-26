import React, { useEffect } from 'react';
import PropTypes from 'prop-types';

import RoutedSavableApp from 'platform/forms/save-in-progress/RoutedSavableApp';
import { isProfileLoading, isLoggedIn } from 'platform/user/selectors';
import { useSelector } from 'react-redux';
import formConfig from '../config/form';
import manifest from '../manifest.json';
import Breadcrumbs from '../components/Breadcrumbs';
import NeedHelp from '../components/NeedHelp';

export default function App({ location, children }) {
  const userLoggedIn = useSelector(state => isLoggedIn(state));
  const profileLoading = useSelector(state => isProfileLoading(state));

  useEffect(() => {
    document.title = `${formConfig.title} | Veterans Affairs`;
  }, []);

  useEffect(
    () => {
      if (
        !userLoggedIn &&
        !profileLoading &&
        location.pathname !== '/introduction'
      ) {
        window.location.href = manifest.rootUrl;
      }
    },
    [userLoggedIn, profileLoading, location],
  );

  return (
    <div className="form-22-0803-container row">
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
