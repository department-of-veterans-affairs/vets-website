import React from 'react';
import PropTypes from 'prop-types';

import { LOAD_STATUSES } from './save-load-actions';
import LoadingIndicator from '../components/LoadingIndicator';

class LoadingPage extends React.Component {
  render() {
    const { loadedStatus } = this.props;
    let content;

    switch (loadedStatus) {
      // TODO: make the Back and Sign in buttons
      case LOAD_STATUSES.noAuth:
        content = <div className="usa-alert usa-alert-error no-background-image">You have been signed out. Please sign in again to resume your application for health care.</div>;
        break;
      // TODO: Make the Back and Resume previous application buttons
      case LOAD_STATUSES.failure:
      case LOAD_STATUSES.notFound:
        content = <div className="usa-alert usa-alert-error no-background-image">We're sorry, but something went wrong. Please try applying again in a few moments.</div>;
        break;
      default: // pending
        content = <LoadingIndicator message="Wait a moment while we retrieve your saved form."/>; break;
    }

    return (
      <div>{content}</div>
    );
  }
}

LoadingPage.propTypes = {
  loadedStatus: PropTypes.string.isRequired
};

export default LoadingPage;
