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
  return <>{loggedIn ? loggedInComponent : loggedOutComponent}</>;
};

App.propTypes = {
  loggedIn: PropTypes.bool,
  toggleLoginModal: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
  loggedIn: state?.user?.login?.currentlyLoggedIn || null,
});

const mapDispatchToProps = dispatch => ({
  toggleLoginModal: open => dispatch(toggleLoginModalAction(open)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(App);
