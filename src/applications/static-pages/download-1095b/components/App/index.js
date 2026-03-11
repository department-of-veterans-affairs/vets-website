// Node modules.
import { apiRequest } from 'platform/utilities/api';
import PropTypes from 'prop-types';
import React, { useEffect, useMemo, useState } from 'react';
import { connect, useSelector } from 'react-redux';
// Relative imports.
import {
  VaAlertSignIn,
  VaButton,
} from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import { toggleLoginModal as toggleLoginModalAction } from 'platform/site-wide/user-nav/actions';
import environment from 'platform/utilities/environment';
import { focusElement } from 'platform/utilities/ui';
import recordEvent from '~/platform/monitoring/record-event';
import {
  VerifyIdmeButton,
  VerifyLogingovButton,
} from '~/platform/user/authentication/components/VerifyButton';

import { CSP_IDS } from '~/platform/user/authentication/constants';
import { signInServiceName } from '~/platform/user/authentication/selectors';
import '../../sass/download-1095b.scss';
import { useFeatureToggle } from 'platform/utilities/feature-toggles';
import { selectAuthStatus } from '../../selectors/auth-status';
import {
  downloadErrorComponent,
  errorTypes,
  NotFoundComponent,
  PdfHelp,
  systemErrorComponent,
} from './utils';

export const App = ({ toggleLoginModal }) => {
  const [year, updateYear] = useState(0);
  const [availableForms, setAvailableForms] = useState([]);
  const [formError, updateFormError] = useState({
    error: false,
    type: '',
    year: null,
  });
  const cspId = useSelector(signInServiceName);
  const [verifyAlertVariant, setverifyAlertVariant] = useState(null);
  const profile = useSelector(state => selectAuthStatus(state));
  const [hasLoadedMostRecentYear, setHasLoadedMostRecentYear] = useState(false);
  const {
    TOGGLE_NAMES,
    useToggleLoadingValue,
    useToggleValue,
  } = useFeatureToggle();
  const togglesLoading = useToggleLoadingValue();
  const isForm1095bMultipleYears = useToggleValue(
    TOGGLE_NAMES.form1095bMultipleYears,
  );

  const isAppLoading = useMemo(
    () => {
      return (
        profile.isLoadingProfile ||
        togglesLoading ||
        (profile.isUserLOA3 && hasLoadedMostRecentYear === false)
      );
    },
    [hasLoadedMostRecentYear, profile, togglesLoading],
  );
  useEffect(
    () => {
      if (profile.isUserLOA3 !== true || togglesLoading) {
        return;
      }

      apiRequest('/form1095_bs/available_forms')
        .then(response => {
          if (response.availableForms.length === 0) {
            recordEvent({ event: '1095b-available-forms-not-found' });
            updateFormError({
              error: true,
              type: errorTypes.NOT_FOUND,
              year: null,
            });
          } else {
            recordEvent({ event: '1095b-available-forms-found' });
            if (isForm1095bMultipleYears) {
              setAvailableForms(response.availableForms);
            } else {
              const mostRecentYearData = response.availableForms[0];
              if (mostRecentYearData.year) {
                updateYear(mostRecentYearData.year);
              }
            }
          }
        })
        .catch(() => {
          recordEvent({ event: '1095b-available-forms-system-error' });
          updateFormError({
            error: true,
            type: errorTypes.SYSTEM_ERROR,
            year: null,
          });
        })
        .finally(() => {
          setHasLoadedMostRecentYear(true);
        });
    },
    [profile.isUserLOA3, isForm1095bMultipleYears, togglesLoading],
  );

  useEffect(
    () => {
      if (formError.type === errorTypes.DOWNLOAD_ERROR) {
        focusElement('#downloadError');
      }
    },
    [formError],
  );

  const getFile = (format, taxYear) => {
    return apiRequest(`/form1095_bs/download_${format}/${taxYear}`)
      .then(response => response.blob())
      .then(blob => {
        return window.URL.createObjectURL(blob);
      })
      .catch(() => {
        recordEvent({ event: `1095b-${format}-download-error` });
        updateFormError({
          error: true,
          type: errorTypes.DOWNLOAD_ERROR,
          year: taxYear,
        });
        return false;
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
            <span slot="IdMeSignInButton">
              <VerifyIdmeButton />
            </span>
            <span slot="LoginGovSignInButton">
              <VerifyLogingovButton />
            </span>
          </VaAlertSignIn>
        );
      };
      setverifyAlertVariant(getverifyAlertVariant());
    },
    [cspId, profile.isUserLOA1],
  );

  const showSignInModal = () => {
    toggleLoginModal(true, 'ask-va', true);
  };

  const downloadFileToUser = (format, taxYear) => {
    getFile(format, taxYear).then(result => {
      if (result) {
        const a = document.createElement('a');
        a.href = result;
        a.target = '_blank';
        a.download = `1095B-${taxYear}.${format}`;

        document.body.appendChild(a); // we need to append the element to the dom -> otherwise it will not work in firefox
        a.click();
        a.remove(); // removes element from the DOM
        updateFormError({ error: false, type: '', year: null });
      }
    });
  };

  const renderDownloadCard = taxYear => {
    // The space in "10 95-B" helps screen readers pronounce "ten ninety-five".
    const pdfLabel = `Download ${taxYear} 10 95-B PDF (best for printing)`;
    const txtLabel = `Download ${taxYear} 10 95-B Text file (best for screen readers, enlargers, and refreshable Braille displays)`;

    return (
      <va-card key={taxYear}>
        <div>
          {!isForm1095bMultipleYears && (
            <h3 className="vads-u-margin-bottom--0 vads-u-margin-top--0 vads-u-font-size--h4">
              1095-B Proof of VA health coverage
            </h3>
          )}
          <span>
            <b>Tax year:</b> {taxYear}
          </span>
        </div>
        <div className="download-links vads-u-margin-y--1p5 vads-u-padding-top--3">
          {formError.type === errorTypes.DOWNLOAD_ERROR &&
            formError.year === taxYear &&
            downloadErrorComponent}
          <div className="vads-u-padding-bottom--1">
            <va-link
              download
              href={encodeURI(
                `${environment.API_URL}/v0/form1095_bs/download_pdf/${taxYear}`,
              )}
              id={`pdf-download-link-${taxYear}`}
              label={pdfLabel}
              text={`Download ${taxYear} PDF (best for printing)`}
              onClick={e => {
                e.preventDefault();
                recordEvent({ event: '1095b-pdf-download' });
                downloadFileToUser('pdf', taxYear);
              }}
            />
          </div>
          <div className="vads-u-padding-top--1">
            <va-link
              download
              href={encodeURI(
                `${environment.API_URL}/v0/form1095_bs/download_txt/${taxYear}`,
              )}
              id={`txt-download-link-${taxYear}`}
              label={txtLabel}
              text={`Download ${taxYear} Text file (best for screen readers, enlargers, and refreshable Braille displays)`}
              onClick={e => {
                e.preventDefault();
                recordEvent({ event: '1095b-txt-download' });
                downloadFileToUser('txt', taxYear);
              }}
            />
          </div>
        </div>
      </va-card>
    );
  };

  const downloadForm = (
    <>
      {isForm1095bMultipleYears
        ? [...availableForms]
            .sort((a, b) => b.year - a.year)
            .slice(0, 3)
            .map(form => renderDownloadCard(form.year))
        : renderDownloadCard(year)}
      <PdfHelp />
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

  const getVerifiedComponent = () => {
    if (formError.type === errorTypes.SYSTEM_ERROR) {
      return systemErrorComponent;
    }
    if (formError.type === errorTypes.NOT_FOUND) {
      return <NotFoundComponent />;
    }
    return downloadForm;
  };

  // determine what to render
  if (isAppLoading) {
    return (
      <div>
        <va-loading-indicator
          label="Loading"
          message="Loading your 1095-B information..."
        />
      </div>
    );
  }
  if (profile.isUserLOA1) {
    return verifyAlertVariant;
  }
  if (profile.isUserLOA3) {
    return getVerifiedComponent();
  }
  return loggedOutComponent;
};

App.propTypes = {
  toggleLoginModal: PropTypes.func.isRequired,
};

const mapDispatchToProps = dispatch => ({
  toggleLoginModal: open => dispatch(toggleLoginModalAction(open)),
});

export default connect(
  null,
  mapDispatchToProps,
)(App);
