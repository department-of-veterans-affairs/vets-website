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
      startsAt: PropTypes.object.isRequired,
      expiresAt: PropTypes.object.isRequired,
    }).isRequired,
    dismiss: PropTypes.func.isRequired,
  };

  render() {
    const {
      announcement: { startsAt, expiresAt },
      dismiss,
    } = this.props;

    // Derive the message.
    const formattedStartsAt = moment(startsAt).format('MMM Do [at] h:mm a');
    const formattedExpiresAt = moment(expiresAt).format('h:mm a z');
    const message = `We'll be doing site maintenance on ${formattedStartsAt} until ${formattedExpiresAt}. You won’t be able to sign in or use some tools during this time.`;

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
