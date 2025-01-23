import React from 'react';
import PropTypes from 'prop-types';
import Breadcrumbs from './Breadcrumbs';

export default function DischargeWizardApp({ children }) {
  return (
    <div className="row discharge-wizard vads-u-padding-bottom--8">
      <Breadcrumbs />
      <div className="usa-width-two-thirds medium-8 columns">{children}</div>
    </div>
  );
}
DischargeWizardApp.propTypes = {
  children: PropTypes.any,
};
