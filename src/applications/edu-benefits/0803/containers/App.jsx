import React, { useEffect } from 'react';
import PropTypes from 'prop-types';

import RoutedSavableApp from 'platform/forms/save-in-progress/RoutedSavableApp';
import { isProfileLoading, isLoggedIn } from 'platform/user/selectors';
import { useSelector } from 'react-redux';
import formConfig from '../config/form';
import manifest from '../manifest.json';
import Breadcrumbs from '../components/Breadcrumbs';

export default function App({ location, children }) {
  const userLoggedIn = useSelector(state => isLoggedIn(state));
  const profileLoading = useSelector(state => isProfileLoading(state));

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
    <div className="form-22-10297-container row">
      <div className="vads-u-padding-left--0">
        <Breadcrumbs />
      </div>
      <RoutedSavableApp formConfig={formConfig} currentLocation={location}>
        {children}
      </RoutedSavableApp>
      <va-need-help>
        <div slot="content">
          <p>
            If you need help in completing this form, call VA TOLL-FREE at{' '}
            <va-telephone contact="8884424551" vanity="888-GIBILL-1" />. If you
            have hearing loss, call <va-telephone contact="711" tty />.
          </p>
        </div>
      </va-need-help>
    </div>
  );
}

App.propTypes = {
  children: PropTypes.node,
  location: PropTypes.object,
};
