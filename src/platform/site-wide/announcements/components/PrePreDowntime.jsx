// Dependencies.
import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import PromoBanner, {
  PROMO_BANNER_TYPES,
} from '@department-of-veterans-affairs/formation-react/PromoBanner';

function PrePreDowntime(props) {
  const {
    announcement: { downtimeStartsAt, downtimeExpiresAt },
    dismiss,
  } = props;

  // Derive the message.
  const formattedStartsAt = moment(downtimeStartsAt).format('ddd. M/D, h:mm a');
  const formattedExpiresAt = moment(downtimeExpiresAt).format(
    'ddd. M/D, h:mm a',
  );
  const message = `DS Logon will be unavailable from ${formattedStartsAt} to ${formattedExpiresAt} Please use ID.me or MyHealtheVet to sign in or use online tools during this time.`;

  return (
    <PromoBanner
      onClose={dismiss}
      render={() => <div>{message}</div>}
      type={PROMO_BANNER_TYPES.announcement}
    />
  );
}

PrePreDowntime.propTypes = {
  announcement: PropTypes.shape({
    downtimeStartsAt: PropTypes.string.isRequired,
    downtimeExpiresAt: PropTypes.string.isRequired,
  }).isRequired,
  dismiss: PropTypes.func.isRequired,
};

export default PrePreDowntime;
