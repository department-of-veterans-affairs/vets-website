// Node modules.
import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { apiRequest } from 'platform/utilities/api';
import { connect } from 'react-redux';
// Relative imports.
import { toggleLoginModal as toggleLoginModalAction } from 'platform/site-wide/user-nav/actions';
import { toggleValues } from 'platform/site-wide/feature-toggles/selectors';
import FEATURE_FLAG_NAMES from 'platform/utilities/feature-toggles/featureFlagNames';
import { CONTACTS } from '@department-of-veterans-affairs/component-library';
import ServiceProvidersText, {
  ServiceProvidersTextCreateAcct,
} from 'platform/user/authentication/components/ServiceProvidersText';
import {
  VaRadio,
  VaRadioOption,
} from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import recordEvent from '~/platform/monitoring/record-event';

import {
  notFoundComponent,
  radioOptions,
  unavailableComponent,
  phoneComponent,
  dateOptions,
  LastUpdatedComponent,
  formatTimeString,
} from './utils';

export const App = ({ loggedIn, toggleLoginModal, displayToggle }) => {
  const [lastUpdated, updateLastUpdated] = useState('');
  const [year, updateYear] = useState(0);
  const [formError, updateFormError] = useState({ error: false, type: '' }); // types: "not found", "download error"
  const [formType, updateFormType] = useState('pdf');
  const [formDownloaded, updateFormDownloaded] = useState({
    downloaded: false,
    timeStamp: '',
  });

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
    <>
      <h2>Choose your file format and download your document</h2>
      <VaRadio
        id="1095-download-options"
        label="We offer two file format options for this form. Choose the option that best meets your needs."
        onRadioOptionSelected={e => {
          e.preventDefault();
          updateFormType(e.target.value);
        }}
      >
        {radioOptions.map(({ value, label }) => (
          <VaRadioOption
            id={value}
            key={value}
            checked={value === formType}
            label={label}
            value={value}
            name="1095b-form-select"
          />
        ))}
      </VaRadio>
    </>
  );

  const downloadButton = (
    <p>
      <button
        className="usa-button-primary va-button"
        onClick={function() {
          recordEvent({
            event: 'int-radio-button-option-click',
            'radio-button-label':
              'Choose your file format and download your document',
            'radio-button-option-click-label': `${formType} 1095B downloaded`,
          });
          callGetContent();
        }}
        id="download-url"
      >
        Download your 1095-B tax form{' '}
      </button>
    </p>
  );

  const errorComponent = (
    <>
      <LastUpdatedComponent lastUpdated={lastUpdated} />
      <va-alert
        close-btn-aria-label="Close notification"
        status="error"
        visible
      >
        <h2 slot="headline">We couldn’t download your form</h2>
        <div>
          <p>
            We’re sorry. Something went wrong when we tried to download your
            form. Please try again. If your form still doesn’t download, call us
            at {phoneComponent(CONTACTS.HELP_DESK)}. We’re here 24/7.
          </p>
        </div>
      </va-alert>
      {downloadButton}
    </>
  );

  const getErrorComponent = () => {
    if (formError.type === 'not found') {
      return notFoundComponent();
    }
    return errorComponent;
  };

  const successComponent = (
    <>
      <LastUpdatedComponent lastUpdated={lastUpdated} />
      <va-alert
        close-btn-aria-label="Close notification"
        status="success"
        visible
      >
        <h2 slot="headline">Download Complete</h2>
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
      <LastUpdatedComponent lastUpdated={lastUpdated} />
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
      <h2 slot="headline">
        Please sign in to download your 1095-B tax document
      </h2>
      <div>
        Sign in with your existing <ServiceProvidersText isBold /> account.{' '}
        <ServiceProvidersTextCreateAcct />
      </div>
      <va-button
        onClick={() => toggleLoginModal(true)}
        primary-alternate
        text="Sign in or create an account"
        className="vads-u-margin-top--2"
      />
    </va-alert>
  );

  if (!displayToggle) {
    return unavailableComponent();
  }
  if (loggedIn) {
    if (formError.error) {
      return getErrorComponent();
    }
    if (formDownloaded.downloaded) {
      return successComponent;
    }
    return loggedInComponent;
  }
  return loggedOutComponent;
};

App.propTypes = {
  loggedIn: PropTypes.bool,
  toggleLoginModal: PropTypes.func.isRequired,
  displayToggle: PropTypes.bool,
};

const mapStateToProps = state => ({
  loggedIn: state?.user?.login?.currentlyLoggedIn || null,
  displayToggle: toggleValues(state)[FEATURE_FLAG_NAMES.showDigitalForm1095b],
});

const mapDispatchToProps = dispatch => ({
  toggleLoginModal: open => dispatch(toggleLoginModalAction(open)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(App);
