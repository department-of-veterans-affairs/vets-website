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
      downtimeStartsAt: PropTypes.string.isRequired,
    }).isRequired,
    dismiss: PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);

    // Derive minutes remaining.
    const now = moment();
    const minutesRemaining = moment(props?.announcement?.downtimeStartsAt).diff(
      now,
      'minutes',
    );

    this.state = {
      minutesRemaining,
    };
  }

  componentWillMount() {
    // Set an interval to update the time.
    this.rerenderInterval = setInterval(
      () => this.updateMinutesRemaining(),
      60000,
    );
  }

  componentWillUnmount() {
    // Prevent memory leaks by clearing timeouts.
    clearInterval(this.rerenderInterval);
  }

  updateMinutesRemaining = () => {
    const {
      announcement: { downtimeStartsAt },
    } = this.props;

    // Derive minutes remaining.
    const now = moment();
    const minutesRemaining = moment(downtimeStartsAt).diff(now, 'minutes');

    // Update minutes remaining in state.
    this.setState({ minutesRemaining });
  };

  render() {
    const { minutesRemaining } = this.state;
    const { dismiss } = this.props;

    // Derive the message.
    const message = `Scheduled maintenance on DS Logon will start in ${minutesRemaining} minutes. You can still use ID.me or MyHealtheVet to sign in or use online tools.`;

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
