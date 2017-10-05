import PropTypes from 'prop-types';
import React from 'react';
import URLSearchParams from 'url-search-params';

class Signin extends React.Component {
  constructor(props) {
    super(props);
    this.handleLogin = this.handleLogin.bind(this);
    this.handleSignup = this.handleSignup.bind(this);
  }

  componentDidMount() {
    this.checkLoggedInStatus();
    window.dataLayer.push({ event: 'login-modal-opened' });
  }

  componentWillReceiveProps(nextProps) {
    this.checkLoggedInStatus(nextProps.currentlyLoggedIn);
  }

  checkLoggedInStatus(loggedIn) {
    if (this.props.currentlyLoggedIn || loggedIn) {
      const nextParams = new URLSearchParams(window.location.search);
      const nextPath = nextParams.get('next');

      if (this.props.onLoggedIn) {
        this.props.onLoggedIn();
      }

      if (nextPath && window.location.pathname.indexOf('verify') === -1) {
        window.location.replace(nextPath || '/');
      }
    }
  }

  handleLogin(loginType) {
    return () => {
      window.dataLayer.push({ event: `login-attempted-${loginType}` });
      this.props.handleLogin(loginType);
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
                      <img alt="DSLogon" src="/img/signin/dslogon-icon.svg"/><strong> Sign in with DS Logon</strong>
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
                <h2 className="hide-for-small">One site. A lifetime of benefits and services at your fingertips.</h2>
                <p>
                  You spoke. We listened. Vets.gov is the direct result of what you said you wanted most—one easy-to-use place to:
                </p>
                <ul>
                  <li>Check your disability claim and appeal status</li>
                  <li>Find out how much money you have left to pay for school or training</li>
                  <li>Refill your prescriptions and communicate with your health care team</li>
                  <li>...and more</li>
                </ul>
                <p>
                  <strong>A secure account powered by ID.me</strong><br/>
                  ID.me is our trusted technology partner in helping to keep your personal information safe. They specialize in digital identity protection and help us make sure you're you—and not someone pretending to be you—before we give you access to your information.
                </p>
                <p><a href="/faq#what-is-idme" target="_blank">Learn more about ID.me</a></p>
              </div>
            </div>
          </div>
          <div className="row">
            <div className="columns small-12">
              <div className="help-info">
                <h4>Having trouble signing in?</h4>
                <p><a href="/faq" target="_blank">Get answers to Frequently Asked Questions</a></p>
                <p>
                  Call the Vets.gov Help Desk at <a href="tel:+18555747286">1-855-574-7286</a> (TTY: <a href="tel:+18008778339">1-800-877-8339</a>).<br/>
                  We're here Monday – Friday, 8:00am – 8:00pm (ET).
                </p>
              </div>
              <hr/>
              <div className="fed-warning">
                <p>
                  <strong>Please note:</strong> When you sign in to Vets.gov, you're accessing a United States Federal Government information system.
                </p>
                <p>
                  By signing in, you're agreeing to access only information you have the legal authority to view and use. You're also agreeing to allow us to monitor and record your activity on the system—and to share this information with auditors or law enforcement officials as needed.
                </p>
                <p>
                  By signing in, you're also confirming that you understand unauthorized use of this system (like gaining unauthorized access to data, changing data, causing harm to the system or its data, or misusing the system) is prohibited and may result in criminal, civil, or administrative penalties. We can suspend or stop your use of this system if we suspect any unauthorized use.
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
  onLoggedIn: PropTypes.func,
  currentlyLoggedIn: PropTypes.bool,
  handleLogin: PropTypes.func,
  handleSignup: PropTypes.func,
};

export default Signin;
