import React from 'react';
import PropTypes from 'prop-types';

import { handleLogin } from '../../common/helpers/login-helpers.js';


class SignInLink extends React.Component {
  constructor(props) {
    super(props);

    // I don’t like this, but we need to make sure componentWillReceiveProps
    //  doesn’t call onLogin() when a page with a SignInLink is refreshed and
    //  a user is logged in.
    this.clicked = false;
  }

  // If the loggedIn status went from false to true, call onLogin()
  componentWillReceiveProps(nextProps) {
    const wasLoggedIn = this.props.isLoggedIn;
    const isLoggedIn = nextProps.isLoggedIn;
    if (!wasLoggedIn && isLoggedIn && this.clicked) {
      if (this.props.onLogin) {
        this.props.onLogin();
      }
      this.clicked = false;
    }
  }

  // Copied from src/js/login/containers/Main.jsx
  componentWillUnmount() {
    if (this.loginUrlRequest && this.loginUrlRequest.abort) {
      this.loginUrlRequest.abort();
    }
  }


  signIn = (e) => {
    if (this.props.type === 'button') {
      e.preventDefault(); // Don’t try to submit the page
    }
    this.clicked = true;
    const { loginUrl, onUpdateLoginUrl } = this.props;
    this.loginUrlRequest = handleLogin(loginUrl, onUpdateLoginUrl);
  }

  render() {
    return React.createElement(
      this.props.type || 'a',
      {
        className: this.props.className,
        onClick: this.signIn
      },
      this.props.children
    );
  }
}

SignInLink.propTypes = {
  type: PropTypes.string,
  className: PropTypes.string,
  onLogin: PropTypes.func,

  // I’d prefer to connect() the component rather than threading these props,
  //  but testing is a pain.
  isLoggedIn: PropTypes.bool.isRequired,
  loginUrl: PropTypes.string,
  onUpdateLoginUrl: PropTypes.func.isRequired, // Dispatches updateLogInUrl()
};

export default SignInLink;
