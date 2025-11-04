import PropTypes from 'prop-types';
import React from 'react';

import { SERVICES } from '../constants';

const listFmt = new Intl.ListFormat('en', {
  style: 'long',
  type: 'conjunction',
});

function ServiceUnavailableAlert({ services }) {
  if (!services || !services.length) return null;

  const serviceNames = listFmt.format(services);

  return (
    <va-alert
      class="vads-u-margin-top--1 vads-u-margin-bottom--3"
      slim
      status="warning"
    >
      <p className="vads-u-margin-y--0">
        We can't show your {serviceNames} right now. Refresh this page or try
        again later.
      </p>
    </va-alert>
  );
}

ServiceUnavailableAlert.propTypes = {
  services: PropTypes.arrayOf(PropTypes.oneOf(SERVICES)).isRequired,
};

export default ServiceUnavailableAlert;
