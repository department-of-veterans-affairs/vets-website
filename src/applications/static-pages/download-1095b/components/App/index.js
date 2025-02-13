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

  const getFile = format => {
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

  const getAvailableForms = () => {
    return apiRequest('/form1095_bs/available_forms')
      .then(response => {
        if (response.errors || !response.availableForms.length) {
          updateFormError({ error: true, type: 'not found' });
        }
        return response.availableForms;
      })
      .catch(() => updateFormError({ error: true, type: 'not found' }));
  };

  const downloadFileToUser = format => {
    getFile(format).then(result => {
      if (result) {
        const a = document.createElement('a');
        a.href = result;
        a.target = '_blank';
        a.download = `1095B-${year}.${format}`;

        document.body.appendChild(a); // we need to append the element to the dom -> otherwise it will not work in firefox
        a.click();
        a.remove(); // removes element from the DOM
        updateFormError({ error: false, type: '' });
      }
    });
  };

  useEffect(
    () => {
      getAvailableForms().then(result => {
        const mostRecentYearData = result[0];
        if (mostRecentYearData?.lastUpdated && mostRecentYearData?.year) {
          const date = new Date(mostRecentYearData.lastUpdated);
          const options = { year: 'numeric', month: 'long', day: 'numeric' };
          // expected output (varies according to local timezone and default locale): December 20, 2012
          updateLastUpdated(date.toLocaleDateString(undefined, options));
          updateYear(mostRecentYearData.year);
        } else {
          updateFormError({ error: true, type: 'not found' });
        }
      });
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
    <va-card>
      <div>
        <h4 className="vads-u-margin-bottom--0 vads-u-margin-top--0">
          1095-B Proof of VA health coverage
        </h4>
        <span className="vads-u-font-size--h5">
          <b>Tax year:</b> {year}
        </span>
      </div>
      <div className="download-links vads-u-font-size--h5 vads-u-margin-y--1p5 vads-u-padding-top--3">
        <div className="vads-u-padding-bottom--1">
          <va-link
            download
            id="pdf-download-link"
            label="Download PDF (best for printing)"
            text="Download PDF (best for printing)"
            filetype="PDF"
            onClick={e => {
              e.preventDefault();
              recordEvent({ event: '1095b-pdf-download' });
              downloadFileToUser('pdf');
            }}
          />
        </div>
        <div className="vads-u-padding-top--1">
          <va-link
            download
            id="txt-download-link"
            label="Download Text file (best for screen readers, enlargers, and refreshable Braille displays)"
            text="Download Text file (best for screen readers, enlargers, and refreshable Braille displays)"
            filetype="TEXT"
            onClick={e => {
              e.preventDefault();
              recordEvent({ event: '1095b-txt-download' });
              downloadFileToUser('txt');
            }}
          />
        </div>
      </div>
    </va-card>
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
    return downloadForm;
  }
  return loggedOutComponent;
};

App.propTypes = {
  toggleLoginModal: PropTypes.func.isRequired,
  displayToggle: PropTypes.bool,
  loggedIn: PropTypes.bool,
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
