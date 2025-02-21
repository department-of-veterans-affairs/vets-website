// Node modules.
import React, { useEffect, useState } from 'react';
import { useSelector, connect } from 'react-redux';
import PropTypes from 'prop-types';
import { apiRequest } from 'platform/utilities/api';
// Relative imports.
import { toggleLoginModal as toggleLoginModalAction } from 'platform/site-wide/user-nav/actions';
import { CONTACTS } from '@department-of-veterans-affairs/component-library/contacts';
import {
  VaAlertSignIn,
  VaButton,
} from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import recordEvent from '~/platform/monitoring/record-event';
import {
  VerifyIdmeButton,
  VerifyLogingovButton,
} from '~/platform/user/authentication/components/VerifyButton';

import { CSP_IDS } from '~/platform/user/authentication/constants';
import { signInServiceName } from '~/platform/user/authentication/selectors';
import { isLOA1 as isLOA1Selector } from '~/platform/user/selectors';
import {
  notFoundComponent,
  unavailableComponent,
  phoneComponent,
  LastUpdatedComponent,
} from './utils';
import '../../sass/download-1095b.scss';

export const App = ({ displayToggle, isLOA1, loggedIn, toggleLoginModal }) => {
  const [lastUpdated, updateLastUpdated] = useState('');
  const [year, updateYear] = useState(0);
  const [formError, updateFormError] = useState({ error: false, type: '' }); // types: "not found", "download error"
  const cspId = useSelector(signInServiceName);
  const [verifyAlertVariant, setverifyAlertVariant] = useState(null);

  const getFile = format => {
    return apiRequest(`/form1095_bs/download_${format}/${year}`)
      .then(response => response.blob())
      .then(blob => {
        return window.URL.createObjectURL(blob);
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
      .catch(() => {
        updateFormError({ error: true, type: 'not found' });
        return null; // Return null in case of an error
      });
  };

  useEffect(
    () => {
      const getverifyAlertVariant = () => {
        if (cspId === CSP_IDS.LOGIN_GOV) {
          return (
            <VaAlertSignIn variant="verifyLoginGov" visible headingLevel={4}>
              <span slot="LoginGovVerifyButton">
                <VerifyLogingovButton />
              </span>
            </VaAlertSignIn>
          );
        }
        if (cspId === CSP_IDS.ID_ME) {
          return (
            <VaAlertSignIn variant="verifyIdMe" visible headingLevel={4}>
              <span slot="IdMeVerifyButton">
                <VerifyIdmeButton />
              </span>
            </VaAlertSignIn>
          );
        }
        return (
          <VaAlertSignIn variant="signInEither" visible headingLevel={4}>
            <span slot="LoginGovSignInButton">
              <VerifyLogingovButton />
            </span>
            <span slot="IdMeSignInButton">
              <VerifyIdmeButton />
            </span>
          </VaAlertSignIn>
        );
      };
      setverifyAlertVariant(getverifyAlertVariant());
    },
    [cspId, isLOA1],
  );

  const showSignInModal = () => {
    toggleLoginModal(true, 'ask-va', true);
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
        if (
          mostRecentYearData &&
          mostRecentYearData?.lastUpdated &&
          mostRecentYearData?.year
        ) {
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
    <VaAlertSignIn variant="signInRequired" visible headingLevel={4}>
      <span slot="SignInButton">
        <VaButton
          text="Sign in or create an account"
          onClick={showSignInModal}
        />
      </span>
    </VaAlertSignIn>
  );

  if (!displayToggle) {
    return unavailableComponent();
  }
  if (loggedIn) {
    if (formError.error) {
      return getErrorComponent();
    }
    if (isLOA1) {
      return verifyAlertVariant;
    }
    return downloadForm;
  }
  return loggedOutComponent;
};

App.propTypes = {
  displayToggle: PropTypes.bool,
  isLOA1: PropTypes.bool,
  loggedIn: PropTypes.bool,
  toggleLoginModal: PropTypes.func.isRequired,
};
const mapStateToProps = state => ({
  displayToggle: state?.featureToggles?.showDigitalForm1095b,
  isLOA1: isLOA1Selector(state),
  loggedIn: state?.user?.login?.currentlyLoggedIn,
});

const mapDispatchToProps = dispatch => ({
  toggleLoginModal: open => dispatch(toggleLoginModalAction(open)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(App);
