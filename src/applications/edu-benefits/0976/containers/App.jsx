import React from 'react';
import PropTypes from 'prop-types';

import RoutedSavableApp from 'platform/forms/save-in-progress/RoutedSavableApp';
import formConfig from '../config/form';
import Breadcrumbs from '../components/Breadcrumbs';

export default function App({ location, children }) {
  return (
    <div className="form-22-0976-container row">
      <div className="vads-u-padding-left--0">
        <Breadcrumbs />
      </div>
      <RoutedSavableApp formConfig={formConfig} currentLocation={location}>
        {children}
      </RoutedSavableApp>
      <va-need-help>
        <div slot="content">
          <p>
            Call us at
            <va-telephone contact="8008271000" />. We're here Monday through
            Friday, 8:00 a.m. to 9:00 p.m. EST. If you have hearing loss, call{' '}
            <va-telephone contact="711" tty />.
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
