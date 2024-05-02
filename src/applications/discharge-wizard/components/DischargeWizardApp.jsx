import React from 'react';
import PropTypes from 'prop-types';
import environment from 'platform/utilities/environment';
import Breadcrumbs from './Breadcrumbs';
import BreadcrumbsV2 from './v2/BreadcrumbsV2';

export default function DischargeWizardApp({ children }) {
  const isProd = environment.isProduction();

  if (isProd) {
    return (
      <div className="discharge-wizard vads-u-padding-x--1 large-screen:vads-u-padding-x--0">
        <Breadcrumbs />
        {children}
      </div>
    );
  }
  return (
    <div className="usa-grid usa-grid-full discharge-wizard-v2 vads-u-padding-bottom--8">
      <BreadcrumbsV2 />
      <article className="usa-width-two-thirds">{children}</article>
    </div>
  );
}
DischargeWizardApp.propTypes = {
  children: PropTypes.any,
};
