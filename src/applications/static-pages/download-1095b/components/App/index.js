// Node modules.
import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { apiRequest } from 'platform/utilities/api';
import { connect } from 'react-redux';
// Relative imports.
import { toggleLoginModal as toggleLoginModalAction } from 'platform/site-wide/user-nav/actions';

import ServiceProvidersText, {
  ServiceProvidersTextCreateAcct,
} from 'platform/user/authentication/components/ServiceProvidersText';

export const App = ({ loggedIn, toggleLoginModal }) => {
  const [lastUpdated, updateLastUpdated] = useState('');
  const [year, updateYear] = useState(0);
  const [formError, updateFormError] = useState({ error: false, type: '' }); // types: "not found", "download error"
  const [formDownloaded, updateFormDownloaded] = useState({
    downloaded: false,
    timeStamp: '',
  });

  const getPdf = () => {
    return apiRequest(`/form1095_bs/download/${year}`)
      .then(response => response.blob())
      .then(blob => {
        return window.URL.createObjectURL(blob);
      })
      .catch(updateFormError({ error: true, type: 'download error' }));
  };

  // for new endpoint
  const getLastUpdatedOn = () => {
    return apiRequest('/form1095_bs/available_forms')
      .then(response => {
        if (response.errors) {
          updateFormError({ error: true, type: 'not found' });
        }

        return response.availableForms[0];
      })
      .catch(
        // console.log("error?", error);
        updateFormError({ error: true, type: 'not found' }),
      );
  };

  const callLastUpdated = () => {
    getLastUpdatedOn().then(result => {
      if (result.lastUpdated && result.year) {
        const date = new Date(result.lastUpdated);
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        // expected output (varies according to local timezone and default locale): December 20, 2012
        updateLastUpdated(date.toLocaleDateString(undefined, options));
        updateYear(result.year);
      } else {
        updateFormError({ error: true, type: 'not found' });
      }
    });
  };

  const callGetPDF = () => {
    getPdf().then(result => {
      const a = document.createElement('a');
      a.href = result;
      a.target = '_blank';
      document.body.appendChild(a); // we need to append the element to the dom -> otherwise it will not work in firefox
      a.click();
      a.remove(); // removes element from the DOM
      const date = new Date();
      const options = {
        year: 'numeric',
        month: 'numeric',
        day: 'numeric',
        hour: 'numeric',
        minute: 'numeric',
        hour12: true,
      };
      updateFormDownloaded({
        downloaded: true,
        timeStamp: date.toLocaleDateString(undefined, options),
      });
    });
  };

  useEffect(() => {
    callLastUpdated();
  }, []);

  const downloadButton = (
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
  );

  const notFoundComponent = (
    <va-alert close-btn-aria-label="Close notification" status="info" visible>
      <h3 slot="headline">
        You don’t have a 1095-B tax form available right now
      </h3>
      <div>
        <p>
          If you recently enrolled in VA health care, you may not have a 1095-B
          form yet. We process 1095-B forms in early January each year, based on
          your enrollment in VA health care during the past year.
        </p>
        <p>
          If you think you should have a 1095-B form, call us at{' '}
          <a href="tel:+18772228387">1-877-222-8387 (TTY: 711)</a>. We’re here
          Monday through Friday, 8:00 a.m. to 8:00 p.m. ET.
        </p>
      </div>
    </va-alert>
  );

  const errorComponent = (
    <>
      <va-alert
        close-btn-aria-label="Close notification"
        status="warning"
        visible
      >
        <h3 slot="headline">We couldn’t download your form</h3>
        <div>
          <p>
            We’re sorry. Something went wrong when we tried to download your
            form. Please try again. If your form still doesn’t download, call us
            at <a href="tel:+18772228387">800-698-2411 (TTY: 711)</a>. We’re
            here 24/7.
          </p>
        </div>
      </va-alert>
      <p>{downloadButton}</p>
    </>
  );

  const successComponent = (
    <>
      <va-alert
        close-btn-aria-label="Close notification"
        status="success"
        visible
      >
        <h3 slot="headline">Download Complete</h3>
        <div>
          <p>
            You successfully downloaded your 1095-B tax form. Please check your
            files.
            {formDownloaded.timeStamp}
          </p>
        </div>
      </va-alert>
      <p>{downloadButton}</p>
    </>
  );

  const loggedInComponent = (
    <>
      <h3 slot="headline">Download your 1095-B</h3>
      <div>
        <p>
          <span className="vads-u-line-height--3 vads-u-display--block">
            <strong>Related to:</strong> Health care
          </span>
          <span className="vads-u-line-height--3 vads-u-display--block">
            <strong>Last updated on:</strong> {lastUpdated}
          </span>
        </p>
        <p>{downloadButton}</p>
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
  // will this work? needs testing
  if (loggedIn) {
    if (formError.error) {
      if (formError.type === 'not found') {
        return notFoundComponent;
      }
      if (formError.type === 'download error') {
        return errorComponent;
      }
    } else if (formDownloaded.downloaded) {
      return successComponent;
    }
    return loggedInComponent;
  }
  return loggedOutComponent;
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
