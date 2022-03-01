// Node modules.
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
// Relative imports.
import { toggleLoginModal as toggleLoginModalAction } from 'platform/site-wide/user-nav/actions';

import ServiceProvidersText, {
  ServiceProvidersTextCreateAcct,
} from 'platform/user/authentication/components/ServiceProvidersText';

export const App = ({ loggedIn, toggleLoginModal }) => {
  // show is feature toggle, see medical-copays-cta for example
  // if (!show) {
  //   return null;
  // }

  const loggedInComponent = (
      <va-alert close-btn-aria-label="Close notification" status="info" visible>
        <h3 slot="headline">Download your 1095-B</h3>
        <div>
          <p className="vads-u-margin-bottom--5">
            <span className="vads-u-line-height--3 vads-u-display--block">
              <strong>Related to:</strong> Health care
            </span>
            <span className="vads-u-line-height--3 vads-u-display--block">
              <strong>Document last updated:</strong> November 5, 2021
            </span>
          </p>
          <i
            className="fas fa-download download-icon vads-u-color--primary-alt-darkest"
            role="presentation"
          />
          &nbsp;
          <a
            href="http://localhost:3000/v0/tax_1095/download_pdf"
            className="download-text"
          >
            Download current 1095-B tax document (PDF){' '}
          </a>
        </div>
      </va-alert>
    );
  const loggedOutComponent = (
      <va-alert
        close-btn-aria-label="Close notification"
        status="continue"
        visible
      >
        <h3 slot="headline">
          Please sign in to download your 1095-B tax document
        </h3>
        <div>
          Sign in with your existing <ServiceProvidersText isBold /> account.{' '}
          <ServiceProvidersTextCreateAcct hasExtraTodo />
        </div>
        <button
          type="button"
          onClick={() => toggleLoginModal(true)}
          className="usa-button-primary va-button-primary vads-u-margin-top--2"
        >
          Sign in
        </button>
      </va-alert>
    );
  return (
    <>

        <h1 className="vads-u-font-size--h1">
          1095-B tax document (proof of health coverage)
        </h1>
        <p className="va-introtext">
          The 1095-B is an IRS tax document that shows the period that you
          had health coverage through the VA for the tax year. Due to
          changes in the{' '}
          <a href="http://wwww.link.com">Affordable Care Act</a>, this
          document is no longer required to file your federal taxes; however
          some states may still require proof of health coverage.
        </p>
        <p className="vads-u-margin-bottom--5">
          *States requiring proof of coverage as of January 2022:
          Massachusetts, New Jersey, Vermont, California, Rhode Island and
          District of Columbia (Washington D.C.)
        </p>
        {loggedIn ? loggedInComponent : loggedOutComponent}
        <h3 className="vads-u-font-size--h3 vads-u-border-bottom--3px vads-u-border-color--primary vads-u-margin-top--5">
          Need help?
        </h3>
        <p>
          <span className="vads-u-font-weight--bold">
            If your address or other information is incorrect or needs to be
            updated on your 1095-B
          </span>
          . Call the enrollment center toll-free at{' '}
          <a href="http://wwww.link.com">1-877-222-VETS (8387)</a> Monday
          through Friday, 8:00 am until 8:00 pm (EST). Changes may take up
          to 10 business days to process and for you to receive your updated
          document.
        </p>
        <p>
          <span className="vads-u-font-weight--bold">
            If you’re having trouble viewing your 1095-B.
          </span>{' '}
          To view your 1095-B after download, you may need the latest
          version of Adobe Acrobat Reader. It’s free to download.{' '}
          <a href="http://wwww.link.com">
            Get Acrobat Reader for free from Adobe
          </a>
          .
        </p>
    </>
  );
};

App.propTypes = {
  // From mapStateToProps.
  loggedIn: PropTypes.bool,
 // show: PropTypes.bool,
  // From mapDispatchToProps.
  toggleLoginModal: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
  loggedIn: state?.user?.login?.currentlyLoggedIn || false
});

const mapDispatchToProps = dispatch => ({
  toggleLoginModal: open => dispatch(toggleLoginModalAction(open)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(App);
