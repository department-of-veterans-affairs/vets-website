// Node modules.
import React, { useEffect, useState } from 'react';
import RadioButtons from '@department-of-veterans-affairs/component-library/RadioButtons';
import PropTypes from 'prop-types';
import { apiRequest } from 'platform/utilities/api';
import { connect } from 'react-redux';
// Relative imports.
import { toggleLoginModal as toggleLoginModalAction } from 'platform/site-wide/user-nav/actions';

import ServiceProvidersText, {
  ServiceProvidersTextCreateAcct,
} from 'platform/user/authentication/components/ServiceProvidersText';

import {
  notFoundComponent,
  radioOptions,
  radioOptionsAriaLabels,
} from './utils';

export const App = ({ loggedIn, toggleLoginModal }) => {
  const [lastUpdated, updateLastUpdated] = useState('');
  const [year, updateYear] = useState(0);
  const [formError, updateFormError] = useState({ error: false, type: '' }); // types: "not found", "download error"
  const [formType, updateFormType] = useState('pdf');
  const [formDownloaded, updateFormDownloaded] = useState({
    downloaded: false,
    timeStamp: '',
  });

  const dateOptions = {
    year: 'numeric',
    month: 'numeric',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    hour12: true,
  };

  const getContent = () => {
    return apiRequest(`/form1095_bs/download_${formType}/${year}`)
      .then(response => response.blob())
      .then(blob => {
        return window.URL.createObjectURL(blob);
      })
      .catch(() => {
        updateFormError({ error: true, type: 'download error' });
        return false;
      });
  };

  const getLastUpdatedOn = () => {
    return apiRequest('/form1095_bs/available_forms')
      .then(response => {
        if (response.errors || !response.availableForms.length) {
          updateFormError({ error: true, type: 'not found' });
        }
        return response.availableForms[0];
      })
      .catch(() => updateFormError({ error: true, type: 'not found' }));
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

  // VA content time formatting - should be lowercase with periods
  const formatTimeString = string => {
    if (string.includes('AM')) {
      return string.replace('AM', 'a.m.');
    }
    return string.replace('PM', 'p.m.');
  };

  const callGetContent = () => {
    getContent().then(result => {
      if (result) {
        const a = document.createElement('a');
        a.href = result;
        a.target = '_blank';

        if (formType === 'txt') a.download = `1095B-${year}.txt`; // download text file directly

        document.body.appendChild(a); // we need to append the element to the dom -> otherwise it will not work in firefox
        a.click();
        a.remove(); // removes element from the DOM
        const date = new Date();
        updateFormError({ error: false, type: '' });
        updateFormDownloaded({
          downloaded: true,
          timeStamp: formatTimeString(
            date.toLocaleDateString(undefined, dateOptions),
          ),
        });
      }
    });
  };

  useEffect(
    () => {
      callLastUpdated();
    },
    [loggedIn],
  );

  const radioComponent = (
    <RadioButtons
      id="1095-download-options"
      name="1095-download-options"
      label={
        <div>
          <h3>Choose your file format and download your document</h3>
          <p>
            We offer two file format options for this form. Choose the option
            that best meets your needs.
          </p>
        </div>
      }
      options={radioOptions}
      onValueChange={({ value }) => updateFormType(value)}
      value={{ value: formType }}
      ariaDescribedby={radioOptionsAriaLabels}
      additionalFieldsetClass="vads-u-margin-top--0"
    />
  );

  const downloadButton = (
    <p>
      <button
        className="usa-button-primary va-button"
        onClick={function() {
          callGetContent();
        }}
        id="download-url"
      >
        Download your 1095-B tax form{' '}
      </button>
    </p>
  );

  const lastUpdatedComponent = (
    <p>
      <span className="vads-u-line-height--3 vads-u-display--block">
        <strong>Related to:</strong> Health care
      </span>
      <span className="vads-u-line-height--3 vads-u-display--block">
        <strong>Document last updated:</strong> {lastUpdated}
      </span>
    </p>
  );

  const errorComponent = (
    <>
      {lastUpdatedComponent}
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
            at{' '}
            <a href="tel:+18006982411" aria-label="1 8 0 0 6 9 8 2 4 1 1">
              1-800-698-2411
            </a>{' '}
            (
            <a href="tel:711" aria-label="TTY. 7 1 1">
              TTY: 711
            </a>
            ). We’re here 24/7.
          </p>
        </div>
      </va-alert>
      {downloadButton}
    </>
  );

  const successComponent = (
    <>
      {lastUpdatedComponent}
      <va-alert
        close-btn-aria-label="Close notification"
        status="success"
        visible
      >
        <h3 slot="headline">Download Complete</h3>
        <div>
          <p>
            You successfully downloaded your 1095-B tax form. Please check your
            files. &nbsp;
            {formDownloaded.timeStamp}
          </p>
        </div>
      </va-alert>
      {downloadButton}
    </>
  );

  const loggedInComponent = (
    <>
      {lastUpdatedComponent}
      {radioComponent}
      {downloadButton}
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

  if (loggedIn) {
    if (formError.error) {
      if (formError.type === 'not found') {
        return notFoundComponent();
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
