import React from 'react';
import PropTypes from 'prop-types';

import { VaBreadcrumbs } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import RoutedSavableApp from 'platform/forms/save-in-progress/RoutedSavableApp';
import SubmitHelper from '../components/SubmitHelper';
import formConfig from '../config/form';

export default function App({ location, children }) {
  return (
    <div className="vads-l-grid-container desktop-lg:vads-u-padding-x--0 discover-your-benefits">
      <VaBreadcrumbs
        breadcrumbList={[
          {
            href: '/',
            label: 'VA.gov Home',
          },
          {
            href: '/discover-your-benefits',
            label: formConfig.title,
          },
        ]}
        label="Breadcrumb"
        wrapping
      />
      <RoutedSavableApp formConfig={formConfig} currentLocation={location}>
        <SubmitHelper />
        {children}
      </RoutedSavableApp>
    </div>
  );
}

App.propTypes = {
  children: PropTypes.object,
  location: PropTypes.object,
};
