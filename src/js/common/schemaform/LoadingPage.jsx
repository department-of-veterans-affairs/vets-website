import React from 'react';
import PropTypes from 'prop-types';

import { LOAD_STATUSES } from './save-load-actions';
import LoadingIndicator from '../components/LoadingIndicator';
import SignInLink from '../components/SignInLink';
import ProgressButton from '../components/form-elements/ProgressButton';


// TODO: Determine whether I can connect() and withRouter() this component and still
//  be alright for testing; the contamination in FormApp is getting silly.
class LoadingPage extends React.Component {
  getBackButton = (primary = false) => {
    const buttonClass = primary ? 'usa-button-primary' : 'usa-button-outline';
    return (
      <ProgressButton
          onButtonClick={this.props.goBack}
          buttonClass={buttonClass}
          buttonText="Back"
          beforeText="«"/>
    );
  }

  getRetryButton = () => {
    const text = this.props.type === 'loading'
      ? 'Resume previous application'
      : 'Save';
    return <button className="usa-button-primary" onClick={this.props.retry}>{text}</button>;
  }

  render() {
    const { loadedStatus } = this.props;
    const { noAuth, notFound } = this.props.errorMessages || {};
    let content;
    let errorText;

    switch (loadedStatus) {
      case LOAD_STATUSES.noAuth:
        content = (
          <div>
            <div className="usa-alert usa-alert-error no-background-image">You have been signed out. {noAuth}</div>
            <div>
              <div style={{ marginTop: '30px' }}>
                {this.getBackButton()}
                <SignInLink
                    type="button"
                    className="usa-button-primary"
                    onLogin={this.props.retry}
                    isLoggedIn={this.props.isLoggedIn}
                    loginUrl={this.props.loginUrl}
                    onUpdateLoginUrl={this.props.onUpdateLoginUrl}>Sign in</SignInLink>
              </div>
            </div>
          </div>
        );
        break;
      case LOAD_STATUSES.failure:
        errorText = this.props.type === 'loading'
          ? 'Please try applying again in a few moments.'
          : 'Please try saving again in a few moments.';
        content = (
          <div>
            <div className="usa-alert usa-alert-error no-background-image">We're sorry, but something went wrong. {errorText}</div>
            <div style={{ marginTop: '30px' }}>
              {this.getBackButton()}
              {this.getRetryButton()}
            </div>
          </div>
        );
        break;
      case LOAD_STATUSES.notFound:
        errorText = this.props.type === 'loading'
          ? "We can't find your application."
          : "We couldn't save your application";
        content = (
          <div>
            <div className="usa-alert usa-alert-error no-background-image">We're sorry, but something went wrong. {errorText} {notFound}</div>
            <div style={{ marginTop: '30px' }}>
              {this.getBackButton(true)}
            </div>
          </div>
          // <button className="usa-button-primary" onClick={this.props.startOver}>Start over</button>
        );
        break;
      default: // pending
        content = (<LoadingIndicator message={
            this.props.type === 'loading'
              ? 'Wait a moment while we retrieve your saved form.'
              : 'Wait a moment while we save your form.'
          }/>);
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
  type: PropTypes.oneOf(['loading', 'saving']),
  goBack: PropTypes.func.isRequired,
  startOver: PropTypes.func.isRequired,
  // Function to duplicate the action which got you to this page
  retry: PropTypes.func.isRequired,

  // Prop threading for SignInLink
  isLoggedIn: PropTypes.bool.isRequired,
  loginUrl: PropTypes.string,
  onUpdateLoginUrl: PropTypes.func.isRequired
};

LoadingPage.defaultProps = {
  type: 'loading'
};

export default LoadingPage;
