// Node modules.
import React, { Component } from 'react';
import AlertBox from '@department-of-veterans-affairs/formation-react/AlertBox';
import classnames from 'classnames';
import moment from 'moment';
// Relative imports.
import environment from 'platform/utilities/environment';
import localStorage from 'platform/utilities/storage/localStorage';
import config from '../config';

const {
  content,
  expiresAt,
  id,
  startsAt,
  title,
  warnContent,
  warnStartsAt,
  warnTitle,
} = config;
const MAINTENANCE_BANNER = 'MAINTENANCE_BANNER';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      dismissed: localStorage.getItem(MAINTENANCE_BANNER) === id,
    };
  }

  onCloseAlert = () => {
    localStorage.setItem(MAINTENANCE_BANNER, id);
    this.setState({ dismissed: true });
  };

  render() {
    const { onCloseAlert } = this;
    const { dismissed } = this.state;
    const now = moment();

    // Escape early if the banner is dismissed.
    if (dismissed) {
      return null;
    }

    // Escape early if it's before when it should show.
    if (now.isBefore(warnStartsAt)) {
      return null;
    }

    // Escape early if it's after when it should show.
    if (now.isAfter(expiresAt)) {
      return null;
    }

    // Show pre-downtime.
    if (now.isBefore(startsAt)) {
      return (
        <div className="usa-alert-full-width vads-u-border-top--10px vads-u-border-color--warning-message">
          <AlertBox
            content={warnContent}
            headline={warnTitle}
            onCloseAlert={onCloseAlert}
            status="warning"
          />
        </div>
      );
    }

    // Show downtime.
    return (
      <div className="usa-alert-full-width vads-u-border-top--10px vads-u-border-color--secondary">
        <AlertBox
          content={content}
          headline={title}
          onCloseAlert={onCloseAlert}
          status="error"
        />
      </div>
    );
  }
}

export default App;
