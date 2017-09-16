import PropTypes from 'prop-types';
import React from 'react';

class Signin extends React.Component {
  constructor(props) {
    super(props);
    this.handleLogin = this.handleLogin.bind(this);
    this.handleSignup = this.handleSignup.bind(this);
  }

  componentDidMount() {
    this.checkLoggedInStatus();
  }

  componentWillReceiveProps(nextProps) {
    this.checkLoggedInStatus(nextProps.currentlyLoggedIn);
  }

  checkLoggedInStatus(loggedIn) {
    if (this.props.currentlyLoggedIn || loggedIn) {
      const nextParams = new URLSearchParams(window.location.search);
      const nextPath = nextParams.get('next');

      return window.location.replace(nextPath || '/');
    }

    return window.dataLayer.push({ event: 'login-prompt-displayed' });
  }

  handleLogin(loginUrl) {
    return () => {
      this.props.handleLogin(loginUrl);
    };
  }

  handleSignup() {
    this.props.handleSignup();
  }

  render() {
    return (
      <main className="login">
        <div className="row">
          <div className="columns">
            <div className="logo">
              <a href="/">
                <img alt="vets.gov" className="va-header-logo" src="/img/design/logo/logo-alt.png"/>
              </a>
            </div>
          </div>
        </div>
        <div className="container">
          <div className="row">
            <div className="columns small-12">
              <h1>Sign in to Vets.gov</h1>
            </div>
          </div>
          <div className="row hide-for-medium-up mobile-explanation">
            <div className="columns small-12">
              <h2>Manage the benefits and services you've earned. Simply and securely.</h2>
            </div>
          </div>
          <div className="row">
            <div className="columns usa-width-one-half medium-6">
              <div className="signin-actions-container">
                <div className="top-banner">
                  <div>
                    <img alt="ID.me" src="/img/signin/lock-icon.svg"/> Secured & powered by <img alt="ID.me" src="/img/signin/idme-icon-dark.svg"/>
                  </div>
                </div>
                <div className="signin-actions">
                  <h5>Sign in with an existing account</h5>
                  <div>
                    <button className="dslogon" onClick={this.handleLogin('dslogon')}>
                      <img alt="ID.me" src="/img/signin/dslogon-icon.svg"/><strong> Sign in with DS Logon</strong>
                    </button>
                    <button className="usa-button-primary va-button-primary" onClick={this.handleLogin('idme')}>
                      <img alt="ID.me" src="/img/signin/idme-icon-white.svg"/><strong> Sign in with ID.me</strong>
                    </button>
                    <span className="sidelines">OR</span>
                    <div className="alternate-signin">
                      <h5>Don't have those accounts?</h5>
                      <button className="idme-create usa-button usa-button-outline" onClick={this.handleSignup}>
                        <img alt="ID.me" src="/img/signin/idme-icon-dark.svg"/><strong> Create an ID.me account</strong>
                      </button>
                      <p>Use your email, Google, or Facebook</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="columns usa-width-one-half medium-6">
              <div className="explanation-content">
                <h2 className="hide-for-small">Manage the benefits and services you've earned. Simply and securely.</h2>
                <p>
                  With Vets.gov you can:
                </p>
                <ul>
                  <li>Track your VA claims and appeals</li>
                  <li>Download your VA health record</li>
                  <li>Refill your VA prescriptions</li>
                  <li>And more</li>
                </ul>
                <p>
                  <strong>A secure account powered by ID.me</strong><br/>
                  ID.me is our trusted technology partner in helping to keep your personal information safe. They specialize in digital identity protection and help us make sure you're you—and not someone pretending to be you—before we give you access to your information.
                </p>
                <p><a href="#">Learn more about ID.me</a></p>
              </div>
            </div>
          </div>
          <div className="row">
            <div className="columns small-12">
              <div className="help-info">
                <h4>Having trouble signing in?</h4>
                <p><a href="/faq">Get answers to Frequently Asked Questions</a></p>
                <p>
                  Call the Vets.gov Help Desk at <a href="tel:+18555747286">1-855-574-7286</a> (TTY: <a href="tel:+18008294833">1-800-829-4833</a>).<br/>
                  We're here Monday – Friday, 8:00am – 8:00pm (ET).
                </p>
              </div>
              <hr/>
              <div className="fed-warning">
                <p>
                  By entering authentication information, you are attempting to access a United States Federal Government information system. This system is for the use of authorized users only.
                </p>
                <p>
                  System usage may be monitored, recorded, and subject to audit. By accessing this system, you are consenting to have your activities monitored, recorded, and made available to auditors or law enforcement officials.
                </p>
                <p>
                  Unauthorized use of this information system or use in excess of your approved authority is prohibited, and may be subject to disciplinary action including criminal or civil penalties.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    );
  }
}

Signin.propTypes = {
  currentlyLoggedIn: PropTypes.bool,
  handleLogin: PropTypes.func,
  handleSignup: PropTypes.func,
};

export default Signin;
