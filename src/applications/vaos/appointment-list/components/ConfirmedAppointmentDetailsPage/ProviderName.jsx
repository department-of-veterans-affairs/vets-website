import React from 'react';
import PropTypes from 'prop-types';

export default function ProviderName({ appointment, useV2 = false }) {
  const { name, practiceName, providerName } =
    appointment.communityCareProvider || {};
  let displayName = null;

  if (!!providerName || !!practiceName || !!name) {
    displayName = useV2
      ? providerName[0] || practiceName || name
      : providerName || practiceName || name;
  }

  return <div>{displayName}</div>;
}

ProviderName.propTypes = {
  appointment: PropTypes.object.isRequired,
  useV2: PropTypes.bool,
};
