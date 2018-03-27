import PropTypes from 'prop-types';
import React from 'react';
import URLSearchParams from 'url-search-params';

import AlertBox from '../../common/components/AlertBox';
import { verify } from '../utils/helpers';

class Verify extends React.Component {
  componentDidMount() {
    if (!sessionStorage.userToken) {
      return window.location.replace('/');
    }
    return window.dataLayer.push({ event: 'verify-prompt-displayed' });
  }

  componentDidUpdate(prevProps) {
    const { verified } = this.props.profile;
    const shouldCheckAccount = prevProps.profile.verified !== verified;
    if (shouldCheckAccount) { this.checkAccountAccess(); }
  }

  checkAccountAccess() {
    if (this.props.profile.verified && this.props.shouldRedirect) {
      const nextParams = new URLSearchParams(window.location.search);
      const nextPath = nextParams.get('next');
      window.location.replace(nextPath || '/');
    }
  }

  render() {
    const signinMethod = {
      dslogon: 'DS Logon',
      myhealthevet: 'My HealtheVet'
    };

    return (
      <main className="verify">
        <div className="container">
          <div className="row">
            <div className="columns small-12">
              <div>
                <h1>Verify your identity</h1>
                <AlertBox
                  content={`You signed in with ${signinMethod[this.props.profile.authnContext] || 'ID.me'}`}
                  isVisible
                  status="success"/>
                <p>
                  We'll need to verify your identity so that you can securely access and manage your benefits.<br/>
                  <a href="/faq/#why-verify" target="_blank">Why does Vets.gov verify identity?</a>
                </p>
                <p>This one-time process will take <strong>5 - 10 minutes</strong> to complete.</p>
                <button className="usa-button-primary va-button-primary" onClick={verify}>
                  <img alt="ID.me" src="/img/signin/idme-icon-white.svg"/><strong> Verify with ID.me</strong>
                </button>
              </div>
            </div>
          </div>
          <div className="row">
            <div className="columns small-12">
              <div className="help-info">
                <h4>Having trouble verifying your identity?</h4>
                <p><a href="/faq/" target="_blank">Get answers to Frequently Asked Questions</a></p>
                <p>
                  Call the Vets.gov Help Desk at <a href="tel:855-574-7286">1-855-574-7286</a>, TTY: <a href="tel:18008778339">1-800-877-8339</a><br/>
                  Monday &#8211; Friday, 8:00 a.m. &#8211; 8:00 p.m. (ET)
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    );
  }
}

Verify.propTypes = {
  shouldRedirect: PropTypes.bool,
  profile: PropTypes.object,
};

export default Verify;
