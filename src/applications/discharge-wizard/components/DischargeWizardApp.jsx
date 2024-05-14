import React from 'react';
import PropTypes from 'prop-types';
import environment from 'platform/utilities/environment';
import Breadcrumbs from './Breadcrumbs';
import BreadcrumbsV2 from './v2/BreadcrumbsV2';

export default function DischargeWizardApp({ children }) {
  const isProd = environment.isProduction();

  if (isProd) {
    return (
      <div className="discharge-wizard row vads-u-padding-x--1 large-screen:vads-u-padding-x--0">
        <Breadcrumbs />
        {children}
      </div>
    );
  }
  return (
    <div className="row discharge-wizard-v2 vads-u-padding-bottom--8">
      <BreadcrumbsV2 />
      <div className="columns">{children}</div>
    </div>
  );
}
DischargeWizardApp.propTypes = {
  children: PropTypes.any,
};
