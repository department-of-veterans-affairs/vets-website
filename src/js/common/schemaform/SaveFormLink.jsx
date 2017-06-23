import React from 'react';
import PropTypes from 'prop-types';

import LoginModal from '../components/LoginModal';
import { SAVE_STATUSES } from './save-load-actions';

class SaveFormLink extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      modalOpened: false
    };
  }

  openLoginModal = () => {
    // console.log('opening login modal');
    this.setState({ modalOpened: true });
  }

  closeLoginModal = () => {
    this.setState({ modalOpened: false });
  }

  render() {
    const {
      saveForm,
      savedStatus
    } = this.props;
    let content = <a onClick={saveForm}>Save and finish later</a>;

    if (!this.props.user.login.currentlyLoggedIn) {
      // if we have a noAuth status, that means they tried to save and got a 401, which
      // likely means their session is expired (since they were logged in before)
      content = (
        <div>
          {savedStatus === SAVE_STATUSES.noAuth
              ? <div className="usa-alert usa-alert-error no-background-image schemaform-save-error">Sorry, you’re signed out. Please <a onClick={this.openLoginModal}>sign in</a> again to save your application.</div>
              : <span><a onClick={this.openLoginModal}>Save and finish later</a></span>}
        </div>
      );
    }

    if (savedStatus === SAVE_STATUSES.pending) {
      content = <span>Saving application...</span>;
    }

    // TODO: Remove LoginModal from here
    return (
      <div>
        <LoginModal
            key={1}
            title="Sign in to save your application"
            onClose={this.closeLoginModal}
            visible={this.state.modalOpened}
            user={this.props.user}
            onUpdateLoginUrl={this.props.onUpdateLoginUrl}
            onLogin={saveForm}/>
        {savedStatus === SAVE_STATUSES.failure &&
          <div className="usa-alert usa-alert-error no-background-image schemaform-save-error">We’re sorry, but something went wrong. Please try saving your application again.</div>}
        {content}
      </div>
    );
  }
}

SaveFormLink.propTypes = {
  saveForm: PropTypes.func.isRequired,
  savedStatus: PropTypes.string.isRequired,
  user: PropTypes.object.isRequired,
  onUpdateLoginUrl: PropTypes.func.isRequired
};

export default SaveFormLink;
