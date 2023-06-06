import React from 'react';
import PropTypes from 'prop-types';

import RoutedSavableApp from 'platform/forms/save-in-progress/RoutedSavableApp';

import formConfig from './config/form';

export default function PreNeedApp({ location, children }) {
  return (
    <article id="pre-need" data-location={`${location?.pathname?.slice(1)}`}>
      <RoutedSavableApp formConfig={formConfig} currentLocation={location}>
        {children}
      </RoutedSavableApp>
    </article>
  );
}

PreNeedApp.propTypes = {
  children: PropTypes.object,
  location: PropTypes.object,
};
