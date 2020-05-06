import React from 'react';
import { connect } from 'react-redux';
import Scroll from 'react-scroll';
import appendQuery from 'append-query';

import AlertBox from '@department-of-veterans-affairs/formation-react/AlertBox';
import LoadingIndicator from '@department-of-veterans-affairs/formation-react/LoadingIndicator';

import recordEvent from 'platform/monitoring/record-event';
import { hasSession } from 'platform/user/profile/utilities';
import { getScrollOptions } from 'platform/utilities/ui';

import {
  acceptTerms,
  fetchLatestTerms,
  fetchTermsAcceptance,
} from '../actions';

const ScrollElement = Scroll.Element;
const scroller = Scroll.scroller;

const TERMS_NAME = 'mhvac';

export class MhvTermsAndConditions extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isSubmitted: false,
    };
  }

  componentDidMount() {
    this.props.fetchLatestTerms(TERMS_NAME);
    if (hasSession()) {
      this.props.fetchTermsAcceptance(TERMS_NAME);
    }
  }

  componentDidUpdate(prevProps) {
    if (this.state.isSubmitted && !prevProps.accepted && this.props.accepted) {
      this.handleAcceptanceSuccess();
    }
  }

  redirect = () => {
    const redirectUrl = this.props.location.query.tc_redirect;
    if (redirectUrl) {
      const newUrl = appendQuery(redirectUrl, { tc_accepted: true }); // eslint-disable-line camelcase
      window.location.replace(newUrl);
    }
  };

  handleAcceptanceSuccess = () => {
    scroller.scrollTo('banner', getScrollOptions());
    recordEvent({ event: 'account-terms-transaction' });
    this.redirect();
  };

  handleSubmit = e => {
    e.preventDefault();
    this.setState({ isSubmitted: true }, () => {
      this.props.acceptTerms(TERMS_NAME);
    });
    recordEvent({
      event: 'account-navigation',
      'account-action': 'update-button',
      'account-section': 'terms',
    });
  };

  renderBanner = () => {
    const bannerProps = this.props.accepted
      ? {
          headline:
            'You’ve accepted the Terms and Conditions for using VA.gov health tools',
          content: '',
          status: 'success',
        }
      : {
          headline:
            'Accept our terms and conditions to use VA.gov health tools',
          content: (
            <>
              <p>
                Before you can use the health tools on VA.gov, you’ll need to
                read and agree to the terms and conditions below. This will give
                us permission to share your VA medical information with you so
                you can:
              </p>
              <ul>
                <li>Refill your VA prescriptions</li>
                <li>Download your VA health records</li>
                <li>Communicate securely with your health care team</li>
              </ul>
              <div className="vads-u-margin-top--2">
                {this.renderAcceptButton()}
              </div>
            </>
          ),
          status: 'info',
        };

    return (
      bannerProps && (
        <ScrollElement name="banner">
          <AlertBox {...bannerProps} isVisible />
        </ScrollElement>
      )
    );
  };

  renderAcceptButton = () => {
    const { loading } = this.props;
    const shouldHideSection =
      !this.props.user.loggedIn ||
      !this.props.user.verified ||
      this.props.accepted;

    if (shouldHideSection) {
      return null;
    }
    return (
      <button
        className="usa-button submit-button"
        disabled={loading.acceptance}
      >
        Accept terms and conditions
      </button>
    );
  };

  /* eslint-disable react/no-danger */
  renderTermsAndConditions = () => {
    if (this.props.errors) {
      return (
        <AlertBox
          headline="We failed to process the terms and conditions"
          content="We’re sorry. Something went wrong on our end. Please try again later."
          isVisible
          status="error"
        />
      );
    }

    const { loading } = this.props;

    if (loading.acceptance && this.state.isSubmitted) {
      return (
        <LoadingIndicator
          setFocus
          message="Accepting terms and conditions..."
        />
      );
    }

    if (loading.tc || loading.acceptance) {
      return (
        <LoadingIndicator setFocus message="Loading terms and conditions..." />
      );
    }

    const { termsContent } = this.props.attributes;

    return (
      <>
        <h1>Terms and conditions for medical information</h1>
        {this.renderBanner()}
        <form onSubmit={this.handleSubmit}>
          <h2>Terms and conditions</h2>
          <div
            dangerouslySetInnerHTML={{ __html: termsContent }}
            className="terms-text"
          />
          {this.renderAcceptButton()}
        </form>
      </>
    );
  };
  /* eslint-enable react/no-danger */

  render() {
    return (
      <main className="terms-and-conditions">
        <div className="container">
          <div className="row">
            <div
              className="columns medium-9"
              role="region"
              aria-label="Terms and Conditions"
            >
              {this.renderTermsAndConditions()}
            </div>
          </div>
        </div>
      </main>
    );
  }
}

const mapStateToProps = state => ({
  ...state.termsAndConditions,
  user: {
    loggedIn: state.user.login.currentlyLoggedIn,
    verified: state.user.profile.verified,
  },
});

const mapDispatchToProps = {
  acceptTerms,
  fetchLatestTerms,
  fetchTermsAcceptance,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(MhvTermsAndConditions);
