// Node modules.
import React, { useEffect, useState } from 'react';
import { useSelector, connect } from 'react-redux';
import PropTypes from 'prop-types';
import { apiRequest } from 'platform/utilities/api';
// Relative imports.
import { focusElement } from 'platform/utilities/ui';
import { toggleLoginModal as toggleLoginModalAction } from 'platform/site-wide/user-nav/actions';
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
  downloadErrorComponent,
  errorTypes,
} from './utils';
import '../../sass/download-1095b.scss';

export const App = ({ displayToggle, isLOA1, loggedIn, toggleLoginModal }) => {
  const [year, updateYear] = useState(0);
  const [formError, updateFormError] = useState({ error: false, type: '' });
  const cspId = useSelector(signInServiceName);
  const [verifyAlertVariant, setverifyAlertVariant] = useState(null);

  useEffect(
    () => {
      if (formError.type === errorTypes.DOWNLOAD_ERROR) {
        focusElement('#downloadError');
      }
    },
    [formError],
  );

  const getFile = format => {
    return apiRequest(`/form1095_bs/download_${format}/${year}`)
      .then(response => response.blob())
      .then(blob => {
        return window.URL.createObjectURL(blob);
      })
      .catch(() => {
        updateFormError({ error: true, type: errorTypes.DOWNLOAD_ERROR });
        return false;
      });
  };

  const getAvailableForms = () => {
    return apiRequest('/form1095_bs/available_forms')
      .then(response => {
        if (response.errors || response.availableForms.length === 0) {
          updateFormError({ error: true, type: errorTypes.NOT_FOUND });
        }
        return response.availableForms;
      })
      .catch(() => {
        updateFormError({ error: true, type: errorTypes.NOT_FOUND });
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
        if (result) {
          const mostRecentYearData = result[0];
          if (mostRecentYearData?.lastUpdated && mostRecentYearData?.year) {
            updateYear(mostRecentYearData.year);
          }
        }
      });
    },
    [loggedIn],
  );

  const downloadForm = (
    <>
      <va-card>
        <div>
          <h4 className="vads-u-margin-bottom--0 vads-u-margin-top--0">
            1095-B Proof of VA health coverage
          </h4>
          <span>
            <b>Tax year:</b> {year}
          </span>
        </div>
        <div className="download-links vads-u-margin-y--1p5 vads-u-padding-top--3">
          {formError.type === errorTypes.DOWNLOAD_ERROR &&
            downloadErrorComponent}
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
      <p className="vads-u-margin-y--4">
        If you’re having trouble viewing your IRS 1095-B tax form you may need
        the latest version of Adobe Acrobat Reader. It’s free to download.{' '}
        <va-link
          href="https://get.adobe.com/reader"
          text="Get Acrobat Reader for free from Adobe."
        />
      </p>
    </>
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

  if (loggedIn) {
    if (!displayToggle) {
      return unavailableComponent();
    }
    if (formError.type === errorTypes.NOT_FOUND) {
      return notFoundComponent();
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
