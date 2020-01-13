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
      downtimeStartsAt: PropTypes.object.isRequired,
      expiresAt: PropTypes.object.isRequired,
    }).isRequired,
    dismiss: PropTypes.func.isRequired,
  };

  static deriveMessage(downtimeStartsAt, expiresAt, component) {
    // Derive the timestamp for the present.
    const now = moment().tz('America/New_York');

    // No message if the announcement has expired (This shouldn't ever be run.)
    if (now.isAfter(expiresAt)) {
      return '';
    }

    // MESSAGE 3: if there is scheduled maintenance *in progress*.
    if (now.isAfter(downtimeStartsAt)) {
      return `We're doing work on VA.gov. If you have trouble using online tools, check back after ${expiresAt.format(
        'MMM Do [at] h:mm a z',
      )}.`;
    }

    // Derive cloned downtimeStartsAt since moment mutates with .subtract... :(
    const clonedDowntimeStartsAt = downtimeStartsAt.clone();

    // MESSAGE 2: if scheduled maintenance *is really about to* happen.
    if (now.isAfter(clonedDowntimeStartsAt.subtract(60, 'minutes'))) {
      // Update in a few seconds to update the minute number on the UI.
      if (component) {
        component.refreshIn(60000);
      }

      return `Scheduled maintenance starts in ${downtimeStartsAt.diff(
        now,
        'minutes',
      )} minutes. If you’re filling out a form, sign in or create an account to save your work.`;
    }

    // Derive cloned downtimeStartsAt since moment mutates with .subtract... :(
    const cloned2DowntimeStartsAt = downtimeStartsAt.clone();

    // MESSAGE 1: if scheduled maintenance *is about to* happen.
    if (now.isAfter(cloned2DowntimeStartsAt.subtract(12, 'hours'))) {
      return `We'll be doing site maintenance on ${downtimeStartsAt.format(
        'MMM Do [at] h:mm a',
      )} until ${expiresAt.format(
        'h:mm a z',
      )}. You won’t be able to sign in or use some tools during this time.`;
    }

    // No message if scheduled maintenance is not about to happen.
    return '';
  }

  componentWillUnmount() {
    // Prevent memory leaks by clearing timeouts.
    clearTimeout(this.rerenderTimeout);
  }

  refreshIn = milliseconds => {
    clearTimeout(this.rerenderTimeout);
    this.rerenderTimeout = setTimeout(() => {
      this.forceUpdate();
    }, milliseconds);
  };

  render() {
    const {
      announcement: { downtimeStartsAt, expiresAt },
      dismiss,
    } = this.props;

    // Derive the timestamp for the present.
    const now = moment().tz('America/New_York');

    // Do not render if it's after the expiration date.
    if (now.isAfter(expiresAt)) {
      return null;
    }

    // Derive cloned downtimeStartsAt since moment mutates with .subtract... :(
    const clonedDowntimeStartsAt = downtimeStartsAt.clone();

    // Do not render if it's before scheduled maintenance.
    if (now.isBefore(clonedDowntimeStartsAt.subtract(12, 'hours'))) {
      return null;
    }

    return (
      <PromoBanner
        onClose={dismiss}
        render={() => (
          <div>
            {ScheduledMaintenance.deriveMessage(
              downtimeStartsAt,
              expiresAt,
              this,
            )}
          </div>
        )}
        type={PROMO_BANNER_TYPES.announcement}
      />
    );
  }
}

export default ScheduledMaintenance;
