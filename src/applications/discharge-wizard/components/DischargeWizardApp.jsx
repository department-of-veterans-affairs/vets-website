import React from 'react';
import PropTypes from 'prop-types';
import BreadcrumbsV2 from './v2/BreadcrumbsV2';

export default function DischargeWizardApp({ children }) {
  return (
    <div className="row discharge-wizard-v2 vads-u-padding-bottom--8">
      <BreadcrumbsV2 />
      <div className="usa-width-two-thirds medium-8 columns">{children}</div>
    </div>
  );
}
DischargeWizardApp.propTypes = {
  children: PropTypes.any,
};
