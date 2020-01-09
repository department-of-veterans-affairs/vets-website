// Node modules.
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment-timezone';
import PromoBanner, {
  PROMO_BANNER_TYPES,
} from '@department-of-veterans-affairs/formation-react/PromoBanner';

class ScheduledMaintenance extends Component {
  static propTypes = {
    announcement: PropTypes.shape({
      startsAt: PropTypes.object.isRequired,
      expiresAt: PropTypes.object.isRequired,
    }).isRequired,
    dismiss: PropTypes.func.isRequired,
  };

  deriveMessage = () => {
    const {
      announcement: { startsAt, expiresAt },
    } = this.props;

    // Derive the timestamp for the present.
    const now = moment().tz('America/New_York');

    // No message if the announcement has expired (This shouldn't ever be run.)
    if (now.isAfter(expiresAt)) {
      return '';
    }

    // Message if there is scheduled maintenance in progress.
    if (now.isAfter(startsAt)) {
      return `We’re doing some work on VA.gov right now. You may have trouble signing in or using some tools during this time. If you have trouble, please check back after ${expiresAt.format(
        'MMM. Do @ h:mm a z',
      )}.`;
    }

    // Message if scheduled maintenance is about to happen.
    if (now.isAfter(startsAt.subtract(60, 'minutes'))) {
      return `We’ll be starting site maintenance in ${startsAt.diff(
        now,
        'minutes',
      )} minutes. If you’re using our tools or services right now, please sign in or create an account to save your work.`;
    }

    // No message if scheduled maintenance is not about to happen.
    return '';
  };

  render() {
    const { deriveMessage } = this;
    const {
      announcement: { startsAt, expiresAt },
      dismiss,
    } = this.props;

    // Derive the timestamp for the present.
    const now = moment().tz('America/New_York');

    // Do not render if it's after the expiration date.
    if (now.isAfter(expiresAt)) {
      return null;
    }

    // Do not render if it's before scheduled maintenance.
    if (now.isBefore(startsAt.subtract(60, 'minutes'))) {
      return null;
    }

    return (
      <PromoBanner
        href="#"
        onClose={dismiss}
        text={deriveMessage()}
        type={PROMO_BANNER_TYPES.announcement}
      />
    );
  }
}

export default ScheduledMaintenance;
