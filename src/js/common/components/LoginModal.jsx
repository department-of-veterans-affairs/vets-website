import React from 'react';
import PropTypes from 'prop-types';

// Copied from src/js/login/containers/Main.jsx
import { handleLogin } from '../../common/helpers/login-helpers.js';

import Modal from './Modal';


class LoginModal extends React.Component {
  constructor(props) {
    super(props);
    this.handleLogin = this.handleLogin.bind(this);

    // I don’t like this, but we need to make sure componentWillReceiveProps
    //  doesn’t call onLogin() when a page with a LoginModal is refreshed and
    //  a user is logged in.
    this.loginButtonClicked = false;
  }

  componentWillReceiveProps(nextProps) {
    // If the loggedIn status went from false to true, close the modal
    const wasLoggedIn = this.props.user.login.currentlyLoggedIn;
    const isLoggedIn = nextProps.user.login.currentlyLoggedIn;
    if (!wasLoggedIn && isLoggedIn && this.loginButtonClicked) {
      if (this.props.onLogin) {
        this.props.onLogin();
      }
      this.loginButtonClicked = false;
      this.props.onClose();
    }
  }

  shouldComponentUpdate(nextProps) {
    const wasLoggedIn = this.props.user.login.currentlyLoggedIn;
    const isLoggedIn = nextProps.user.login.currentlyLoggedIn;

    return (wasLoggedIn !== isLoggedIn) || (this.props.visible !== nextProps.visible);
  }

  // Copied from src/js/login/containers/Main.jsx
  componentWillUnmount() {
    if (this.loginUrlRequest && this.loginUrlRequest.abort) {
      this.loginUrlRequest.abort();
    }
  }

  getModalContents = (user) => {
    let contents = (<div className="usa-grid">
      <h3>{this.props.title || 'Sign In'}</h3>
      <div className="usa-width-one-fourth">
        <button className="usa-button-primary full-width" onClick={this.handleLogin}>Sign In</button>
      </div>
      <div className="usa-width-one-fourth">
        <button className="usa-button-secondary full-width" onClick={this.props.onClose}>Cancel</button>
      </div>
    </div>);

    // Shouldn’t in get here, but just in case
    if (user.login.currentlyLoggedIn) {
      contents = (<div>
        You are signed in as {user.profile.userFullName.first} {user.profile.userFullName.last}!
      </div>);
    }

    return contents;
  }

  handleLogin(e) {
    e.preventDefault(); // Don’t try to submit the page
    this.loginButtonClicked = true;
    const loginUrl = this.props.user.login.loginUrl;
    const onUpdateLoginUrl = this.props.onUpdateLoginUrl;
    this.loginUrlRequest = handleLogin(loginUrl, onUpdateLoginUrl);
  }

  render() {
    return (
      <Modal
        cssClass="va-modal-large"
        contents={this.getModalContents(this.props.user)}
        onClose={this.props.onClose}
        visible={this.props.visible}/>
    );
  }
}

LoginModal.propTypes = {
  visible: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  title: PropTypes.string,
  user: PropTypes.object.isRequired, // Taken from the redux store
  onUpdateLoginUrl: PropTypes.func.isRequired, // Dispatches updateLogInUrl()
  onLogin: PropTypes.func
};


export default LoginModal;
