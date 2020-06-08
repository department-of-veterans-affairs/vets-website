// Node modules.
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import AlertBox from '@department-of-veterans-affairs/formation-react/AlertBox';
import classnames from 'classnames';
import moment from 'moment';
// Relative imports.
import environment from 'platform/utilities/environment';
import localStorage from 'platform/utilities/storage/localStorage';
import config from './config';

export const MAINTENANCE_BANNER = 'MAINTENANCE_BANNER';

export class MaintenanceBanner extends Component {
  static propTypes = {
    content: PropTypes.string.isRequired,
    expiresAt: PropTypes.object.isRequired,
    id: PropTypes.string.isRequired,
    startsAt: PropTypes.object.isRequired,
    title: PropTypes.string.isRequired,
    warnContent: PropTypes.string,
    warnStartsAt: PropTypes.object,
    warnTitle: PropTypes.string,
  };

  static defaultProps = {
    content: config.content,
    expiresAt: config.expiresAt,
    id: config.id,
    startsAt: config.startsAt,
    title: config.title,
    warnContent: config.warnContent,
    warnStartsAt: config.warnStartsAt,
    warnTitle: config.warnTitle,
  };

  constructor(props) {
    super(props);
    this.state = {
      dismissed: localStorage.getItem(MAINTENANCE_BANNER) === this.props.id,
    };
  }

  onCloseAlert = () => {
    localStorage.setItem(MAINTENANCE_BANNER, this.props.id);
    this.setState({ dismissed: true });
  };

  render() {
    const { onCloseAlert } = this;
    const { dismissed } = this.state;
    const {
      content,
      expiresAt,
      id,
      startsAt,
      title,
      warnContent,
      warnStartsAt,
      warnTitle,
    } = this.props;

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
        <div
          className="usa-alert-full-width vads-u-border-top--10px vads-u-border-color--warning-message"
          data-e2e-id="maintenance-banner-pre-downtime"
        >
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
      <div
        className="usa-alert-full-width vads-u-border-top--10px vads-u-border-color--secondary"
        data-e2e-id="maintenance-banner-downtime"
      >
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

export default MaintenanceBanner;
