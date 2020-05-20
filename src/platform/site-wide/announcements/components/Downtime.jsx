// Dependencies.
import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import PromoBanner, {
  PROMO_BANNER_TYPES,
} from '@department-of-veterans-affairs/formation-react/PromoBanner';

function Downtime({ announcement: { expiresAt }, dismiss }) {
  // Derive the message.
  const formattedExpiresAt = moment(expiresAt).format('dddd M/D [at] h:mm a');
  const message = `DS Logon is down for maintenance. Please use ID.me or MyHealtheVet to sign in or use online tools. We hope to finish our DS Logon work by ${formattedExpiresAt}`;

  return (
    <PromoBanner
      onClose={dismiss}
      render={() => <div>{message}</div>}
      type={PROMO_BANNER_TYPES.announcement}
    />
  );
}

Downtime.propTypes = {
  announcement: PropTypes.shape({
    expiresAt: PropTypes.string.isRequired,
  }).isRequired,
  dismiss: PropTypes.func.isRequired,
};

export default Downtime;
