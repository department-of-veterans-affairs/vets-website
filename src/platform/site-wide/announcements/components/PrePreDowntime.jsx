// Dependencies.
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import PromoBanner, {
  PROMO_BANNER_TYPES,
} from '@department-of-veterans-affairs/formation-react/PromoBanner';

class PrePreDowntime extends Component {
  static propTypes = {
    announcement: PropTypes.shape({
      downtimeStartsAt: PropTypes.string.isRequired,
      downtimeExpiresAt: PropTypes.string.isRequired,
    }).isRequired,
    dismiss: PropTypes.func.isRequired,
  };

  render() {
    const {
      announcement: { downtimeStartsAt, downtimeExpiresAt },
      dismiss,
    } = this.props;

    // Derive the message.
    const formattedStartsAt = moment(downtimeStartsAt).format(
      'ddd. M/D, h:mm a',
    );
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
}

export default PrePreDowntime;
