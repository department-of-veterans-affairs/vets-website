import React from 'react';
import PropTypes from 'prop-types';
import environment from 'platform/utilities/environment';
import Breadcrumbs from './Breadcrumbs';

export default function DischargeWizardApp({ children }) {
  const isProd = environment.isProduction();

  if (isProd) {
    return (
      <div className="row discharge-wizard vads-u-padding-x--1 large-screen:vads-u-padding-x--0">
        <Breadcrumbs />
        {children}
      </div>
    );
  }
  return (
    <div className="row discharge-wizard-v2 vads-u-padding-x--1 large-screen:vads-u-padding-x--0 vads-u-padding-bottom--8">
      <Breadcrumbs />
      <div className="usa-width-two-thirds medium-8 columns">{children}</div>
    </div>
  );
}
DischargeWizardApp.propTypes = {
  children: PropTypes.any,
};
