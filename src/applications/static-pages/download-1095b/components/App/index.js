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
    return apiRequest('/form1095_bs/download/2021')
      .then(response => response.blob())
      .then(blob => {
        return window.URL.createObjectURL(blob);
      });
  };

  const callGetPDF = () => {
    getPdf()
      .then(result => {
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

  // TODO error handling views
  // const notFoundComponent = (
  //   <va-alert close-btn-aria-label="Close notification" status="warning" visible>
  //     <h3 slot="headline">No previous year health coverage found</h3>
  //     <div>
  //       <p>
  //       At this time, you do not have a 1095-B available for download. If you have recently enrolled in VA benefits, this may be why.  1095-B forms are  processed in early January and based on coverage that you had during the previous year.
  //     </p>
  //     <p>
  //       If you feel that you are receiving this notice in error, please contact the Enrollment Center at 1-877-222-VETS (8387).
  //       </p>

  //     </div>
  //   </va-alert>
  // );

  // const errorComponent = (
  //   <va-alert close-btn-aria-label="Close notification" status="warning" visible>
  //     <h3 slot="headline">Error</h3>
  //     <div>
  //       <p>
  //       We’re sorry. Something went wrong on our end and we were unable to download your 1095-B tax form. Please try again.  If you continue to experience this error, please call the VA.gov Help Desk at 1-8555-574-7286, TTY: 1-800-877-8339. We’re here Monday - Friday, 8:00 a.m. - 8:00 p.m.
  //     </p>
  //     </div>
  //   </va-alert>
  // );

  // const successComponent = (
  //   <va-alert close-btn-aria-label="Close notification" status="success" visible>
  //     <h3 slot="headline">Download Complete</h3>
  //     <div>
  //       <p>
  //       Your 1095-B form has been successfully downloaded. 4/1/2022 6:35 p.m.
  //     </p>
  //     </div>
  //   </va-alert>
  // );

  const loggedInComponent = (
    <>
      <h3 slot="headline">Download your 1095-B</h3>
      <div>
        <p>
          <span className="vads-u-line-height--3 vads-u-display--block">
            <strong>Related to:</strong> Health care
          </span>
        </p>
        <button
          className="usa-button-primary va-button-primary"
          onClick={function() {
            // event.preventDefault(); only needed if we decide to use a link tag here (unlikely)
            callGetPDF();
          }}
          id="download-url"
        >
          Download your 1095-B tax form (PDF){' '}
        </button>
      </div>
    </>
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
        <ServiceProvidersTextCreateAcct />
      </div>
      <button
        type="button"
        onClick={() => toggleLoginModal(true)}
        className="usa-button-primary va-button-primary vads-u-margin-top--2"
      >
        Sign in or create an account
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
