import React from 'react';
import PropTypes from 'prop-types';

export default function ProviderName({ appointment }) {
  const { name, practiceName, providerName } =
    appointment.communityCareProvider || {};
  let displayName = null;

  if (!!providerName || !!practiceName || !!name) {
    displayName = providerName[0] || practiceName || name;
  }

  return <div>{displayName}</div>;
}

ProviderName.propTypes = {
  appointment: PropTypes.object.isRequired,
};
