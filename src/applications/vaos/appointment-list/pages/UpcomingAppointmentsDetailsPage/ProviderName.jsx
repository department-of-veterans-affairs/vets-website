import React from 'react';
import PropTypes from 'prop-types';

export default function ProviderName({ appointment, useV2 }) {
  const { providerName } = appointment.communityCareProvider || {};
  let displayName = null;

  if (providerName) {
    displayName = useV2 ? providerName[0] : null;
  }

  return <div>{displayName}</div>;
}

ProviderName.propTypes = {
  appointment: PropTypes.shape({
    communityCareProvider: PropTypes.shape({
      providerName: PropTypes.array,
    }),
  }),
  useV2: PropTypes.bool,
};

ProviderName.defaultProps = {
  appointment: {
    communityCareProvider: {
      providerName: [''],
    },
  },
  useV2: false,
};
