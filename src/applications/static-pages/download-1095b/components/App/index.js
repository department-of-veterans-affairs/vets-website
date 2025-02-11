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
import {
  VaCard,
  VaLink,
} from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import recordEvent from '~/platform/monitoring/record-event';

import {
  notFoundComponent,
  unavailableComponent,
  phoneComponent,
  LastUpdatedComponent,
} from './utils';

import '../../sass/download-1095b.scss';

export const App = ({ loggedIn, toggleLoginModal, displayToggle }) => {
  const [lastUpdated, updateLastUpdated] = useState('');
  const [year, updateYear] = useState(0);
  const [formError, updateFormError] = useState({ error: false, type: '' }); // types: "not found", "download error"

  const getContent = format => {
    return apiRequest(`/form1095_bs/download_${format}/${year}`)
      .then(response => response.blob())
      .then(blob => {
        return window.URL.createObjectURL(blob);
      })
      .catch(() => {
        updateFormError({ error: true, type: 'download error' });
        return false;
      });
  };

  const fetchAvailableForms = () => {
    return apiRequest('/form1095_bs/available_forms')
      .then(response => {
        if (response.errors || !response.availableForms.length) {
          updateFormError({ error: true, type: 'not found' });
        }
        return response.availableForms[0];
      })
      .catch(() => updateFormError({ error: true, type: 'not found' }));
  };

  const callAvailableForms = () => {
    fetchAvailableForms().then(result => {
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

  const callGetContent = format => {
    getContent(format).then(result => {
      if (result) {
        const a = document.createElement('a');
        a.href = result;
        a.target = '_blank';

        if (format === 'txt') a.download = `1095B-${year}.${format}`; // download text file directly

        document.body.appendChild(a); // we need to append the element to the dom -> otherwise it will not work in firefox
        a.click();
        a.remove(); // removes element from the DOM
        updateFormError({ error: false, type: '' });
      }
    });
  };

  useEffect(
    () => {
      callAvailableForms();
    },
    [loggedIn],
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
    </>
  );

  const getErrorComponent = () => {
    if (formError.type === 'not found') {
      return notFoundComponent();
    }
    return errorComponent;
  };

  const downloadForm = (
    <VaCard>
      <div>
        <h4 className="vads-u-margin-bottom--0 vads-u-margin-top--0">
          1095-B Proof of VA health coverage
        </h4>
        <span className="vads-u-font-size--h5">
          <b>Tax year:</b> {year}
        </span>
      </div>
      <div className="download-links vads-u-font-size--h5">
        <div className="vads-u-padding-bottom--1">
          <VaLink
            download
            id="pdf-download-link"
            label="Download PDF (best for printing)"
            text="Download PDF (best for printing)"
            filetype="PDF"
            onClick={e => {
              e.preventDefault();
              callGetContent('pdf');
            }}
          />
        </div>
        <div className="vads-u-padding-top--1">
          <VaLink
            download
            id="txt-download-link"
            label="Download Text file (best for screen readers, enlargers, and refreshable Braille displays)"
            text="Download Text file (best for screen readers, enlargers, and refreshable Braille displays)"
            filetype="TEXT"
            onClick={e => {
              e.preventDefault();
              callGetContent('txt');
            }}
          />
        </div>
      </div>
    </VaCard>
  );

  const loggedOutComponent = (
    <va-alert close-btn-aria-label="Close notification" status="info" visible >
      <h2 slot="headline">
        Sign in with a verified account to download your documents
      </h2>
      <div>
        You'll need to sign in with an identity-verified account through one of our account
        providers. Identity verification helps us protect all Veterans' information and prevent
        scammers from stealing your benefits.
        <b>Don't yet have an account?</b> Create a <b>Login.gov</b> or <b>ID.me</b> account. We'll help you
        verify your account now.
        <b>Not sure if your account is verified?</b> Sign in here. If you still need to verify your identity,
        we'll help you do that now.
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
    return downloadForm;
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
