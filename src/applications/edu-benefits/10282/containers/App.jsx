import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import RoutedSavableApp from 'platform/forms/save-in-progress/RoutedSavableApp';
import formConfig from '../config/form';
import Breadcrumbs from '../components/Breadcrumbs';

export default function App({ location, children }) {
  useEffect(
    () => {
      if (location.pathname === '/review-and-submit') {
        // Add the parameter without refreshing the page
        //   const params = new URLSearchParams(window.location.search);
        //   params.set('yourParam', 'value');

        //   const newUrl = `${window.location.pathname}?${params.toString()}`;
        //   window.history.replaceState({}, '', newUrl);
        localStorage.setItem('isReview', true);
      } else {
        localStorage.setItem('isReview', false);
      }
    },
    [location.pathname],
  );
  return (
    <div className="form-22-10282-container">
      <Breadcrumbs />
      <RoutedSavableApp formConfig={formConfig} currentLocation={location}>
        {children}
      </RoutedSavableApp>
    </div>
  );
}

App.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
  ]),
  location: PropTypes.object,
};
