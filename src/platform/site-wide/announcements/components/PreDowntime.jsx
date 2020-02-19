// Dependencies.
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import PromoBanner, {
  PROMO_BANNER_TYPES,
} from '@department-of-veterans-affairs/formation-react/PromoBanner';

class PreDowntime extends Component {
  static propTypes = {
    announcement: PropTypes.shape({
      startsAt: PropTypes.object.isRequired,
      expiresAt: PropTypes.object.isRequired,
    }).isRequired,
    dismiss: PropTypes.func.isRequired,
  };

  componentWillMount() {
    // Set an interval to update the time.
    this.rerenderInterval = setInterval(() => this.forceUpdate(), 60000);
  }

  componentWillUnmount() {
    // Prevent memory leaks by clearing timeouts.
    clearInterval(this.rerenderInterval);
  }

  render() {
    const {
      announcement: { startsAt },
      dismiss,
    } = this.props;

    // Derive the message.
    const now = moment();
    const minutesRemaining = moment(startsAt).diff(now, 'minutes');
    const message = `Scheduled maintenance starts in ${minutesRemaining} minutes. If you’re filling out a form, sign in or create an account to save your work.`;

    return (
      <PromoBanner
        onClose={dismiss}
        render={() => <div>{message}</div>}
        type={PROMO_BANNER_TYPES.announcement}
      />
    );
  }
}

export default PreDowntime;
