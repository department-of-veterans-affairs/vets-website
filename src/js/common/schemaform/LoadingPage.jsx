import React from 'react';
import PropTypes from 'prop-types';

import { LOAD_STATUSES } from './save-load-actions';
import LoadingIndicator from '../components/LoadingIndicator';
import SignInLink from '../components/SignInLink';

class LoadingPage extends React.Component {
  getBackButton = () => {
    return (
      <button className="usa-button-outline" onClick={this.props.goBack}>&lt; Back</button>
    );
  }

  loadForm = () => {
    console.log('Placeholder for loading the form after logging in.');
  }

  render() {
    const { loadedStatus } = this.props;
    const { noAuth, notFound } = this.props.errorMessages;
    let content;

    switch (loadedStatus) {
      case LOAD_STATUSES.noAuth:
        content = (
          <div>
            <div className="usa-alert usa-alert-error no-background-image">You have been signed out. {noAuth}</div>
            // TODO: Make the Back and sign in buttons
            <div>
              {this.getBackButton()}
              <SignInLink className="usa-button-primary" onLogin={this.loadForm}>Sign in</SignInLink>
            </div>
          </div>
        );
        break;
      case LOAD_STATUSES.failure:
        content = <div className="usa-alert usa-alert-error no-background-image">We're sorry, but something went wrong. Please try applying again in a few moments.</div>;
        // TODO: Make a resume button
        break;
      case LOAD_STATUSES.notFound:
        content = <div className="usa-alert usa-alert-error no-background-image">We're sorry, but something went wrong. We can't find your application. {notFound}</div>;
        // TODO: Make a start over button
        break;
      default: // pending
        content = <LoadingIndicator message="Wait a moment while we retrieve your saved form."/>;
        break;
    }

    return (
      <div>
        {content}
      </div>
    );
  }
}

LoadingPage.propTypes = {
  loadedStatus: PropTypes.string.isRequired,
  errorMessages: PropTypes.shape({
    notFound: PropTypes.string,
    noAuth: PropTypes.string
  })
};

export default LoadingPage;
