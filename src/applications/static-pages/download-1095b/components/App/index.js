// Node modules.
import React from 'react';
import PropTypes from 'prop-types';
import { apiRequest } from 'platform/utilities/api';
import { connect } from 'react-redux';
// Relative imports.
import { toggleLoginModal as toggleLoginModalAction } from 'platform/site-wide/user-nav/actions';

import ServiceProvidersText, {
  ServiceProvidersTextCreateAcct,
} from 'platform/user/authentication/components/ServiceProvidersText';

export const App = ({ loggedIn, toggleLoginModal }) => {
  const getPdf = () => {
    return apiRequest('/form1095_bs/2021', {
      mode: 'cors',
      headers: {
        'X-CSRF-Token': localStorage.getItem('csrfToken'),
      },
    })
      .then(response => response.blob())
      .then(blob => {
        return window.URL.createObjectURL(blob);
      });
  };

  const callGetPDF = () => {
    getPdf()
      .then(result => {
        // we could set the url to the existing a tag already in the DOM, but if user clicks on it too fast it will load this page in a new window instead of the PDF
        const a = document.createElement('a');
        a.href = result;
        a.target = '_blank';
        document.body.appendChild(a); // we need to append the element to the dom -> otherwise it will not work in firefox
        a.click();
        a.remove(); // removes element from the DOM
      })
      .catch(() => {
        // TODO: display error
      });
  };

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
        <button
          className="usa-button-secondary"
          onClick={function() {
            // event.preventDefault(); only needed if we decide to use a link tag here (unlikely)
            callGetPDF();
          }}
          id="download-url"
        >
          <i
            className="fas fa-download download-icon vads-u-color--primary-alt-darkest"
            role="presentation"
          />
          &nbsp; Download current 1095-B tax document (PDF){' '}
        </button>
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
