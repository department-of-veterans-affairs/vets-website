// Dependencies.
import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import PromoBanner, {
  PROMO_BANNER_TYPES,
} from '@department-of-veterans-affairs/formation-react/PromoBanner';

function Downtime({ announcement: { expiresAt }, dismiss }) {
  // Derive the message.
  const formattedExpiresAt = moment(expiresAt).format('MMM D [at] h:mm a');
  const message = `We're doing work on VA.gov. If you have trouble using online tools, check back after ${formattedExpiresAt}`;

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
