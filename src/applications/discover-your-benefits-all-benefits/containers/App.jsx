import React from 'react';
import PropTypes from 'prop-types';

import { VaBreadcrumbs } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import ConfirmationPage from './ConfirmationPage';

export default function App() {
  return (
    <div className="vads-l-grid-container desktop-lg:vads-u-padding-x--0 discover-your-benefits">
      <VaBreadcrumbs
        breadcrumbList={[
          {
            href: '/',
            label: 'VA.gov Home',
          },
          {
            href: '/discover-your-benefits/all-benefits',
            label: 'discover-your-benefits-all-benefits',
          },
        ]}
        label="Breadcrumb"
        wrapping
      />
      <ConfirmationPage />
    </div>
  );
}

App.propTypes = {
  children: PropTypes.node,
};
