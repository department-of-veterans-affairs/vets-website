import React from 'react';
import PropTypes from 'prop-types';

import { LOAD_STATUSES } from './save-load-actions';
import LoadingIndicator from '../components/LoadingIndicator';
import SignInLink from '../components/SignInLink';


// TODO: Determine whether I can connect() and withRouter() this component and still
//  be alright for testing; the contamination in FormApp is getting silly.
class LoadingPage extends React.Component {
  getBackButton = (primary = false) => {
    const buttonClass = primary ? 'usa-button-primary' : 'usa-button-outline';
    return (
      <button className={buttonClass} onClick={this.props.goBack}>&lt; Back</button>
    );
  }

  loadForm = () => {
    // console.log('Placeholder for loading the form after logging in.');
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
              <SignInLink
                  type="button"
                  className="usa-button-primary"
                  onLogin={this.loadForm}
                  isLoggedIn={this.props.isLoggedIn}
                  loginUrl={this.props.loginUrl}
                  onUpdateLoginUrl={this.props.onUpdateLoginUrl}>Sign in</SignInLink>
            </div>
          </div>
        );
        break;
      case LOAD_STATUSES.failure:
        content = (
          <div>
            <div className="usa-alert usa-alert-error no-background-image">We're sorry, but something went wrong. Please try applying again in a few moments.</div>
            {this.getBackButton()}
            <button className="usa-button-primary" onClick={this.props.resumeForm}>Resume previous application</button>
          </div>
        );
        break;
      case LOAD_STATUSES.notFound:
        content = (
          <div>
            <div className="usa-alert usa-alert-error no-background-image">We're sorry, but something went wrong. We can't find your application. {notFound}</div>
            {this.getBackButton(true)}
          </div>
          // <button className="usa-button-primary" onClick={this.props.startOver}>Start over</button>
        );
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
  }),
  goBack: PropTypes.func.isRequired,
  resumeForm: PropTypes.func.isRequired,
  startOver: PropTypes.func.isRequired,
  // Prop threading for SignInLink
  isLoggedIn: PropTypes.bool.isRequired,
  loginUrl: PropTypes.string,
  onUpdateLoginUrl: PropTypes.func.isRequired
};

export default LoadingPage;
