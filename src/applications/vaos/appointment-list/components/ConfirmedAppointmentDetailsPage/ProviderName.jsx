import React from 'react';
import PropTypes from 'prop-types';

export default function ProviderName({ appointment, useV2 = false }) {
  const { name, practiceName, providerName } =
    appointment.communityCareProvider || {};

  return (
    /* the order of display name is important to match screen name on add to calendar title */
    (!!providerName || !!practiceName || !!name) &&
    !useV2 &&
    // V1 displays the name from the provider object
    <>
      {providerName || practiceName || name}
      <br />
    </>(!!providerName || !!practiceName || !!name) &&
    useV2 && (
      // V2 displays the first provider name from the array
      <>
        {providerName[0] || practiceName || name}
        <br />
      </>
    )
  );
}
ProviderName.propTypes = {
  appointment: PropTypes.object.isRequired,
  useV2: PropTypes.bool,
};
