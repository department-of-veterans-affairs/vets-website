import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom-v5-compat';
import {
  VaAlert,
  VaButton,
} from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import { UNAUTH_SIGN_IN_DEFAULT_MESSAGE } from '~/platform/forms-system/src/js/constants';
import SavedFormAlert from './SavedFormAlert';
import {
  ButtonOnlyAlert,
  PrefillUnavailableAlert,
  UnverifiedPrefillAlert,
} from './StaticAlerts';

export const LoggedOutAlert = props => {
  const {
    alertTitle,
    appType,
    ariaDescribedby,
    ariaLabel,
    displayNonVeteranMessaging,
    headingLevel,
    hideUnauthedStartLink,
    onClick,
    retentionPeriod,
    retentionPeriodStart,
    signInHelpList,
    startPage,
    unauthStartButton,
  } = props;
  const CustomHeader = `h${headingLevel}`;

  return (
    <VaAlert status="info" uswds visible>
      <div className="usa-alert-body">
        <CustomHeader className="usa-alert-heading">{alertTitle}</CustomHeader>
        <div className="usa-alert-text">
          {displayNonVeteranMessaging ? (
            <p>
              By signing in, you can save your work in progress. You&rsquo;ll
              have {retentionPeriod} from {retentionPeriodStart} your {appType}{' '}
              to come back and finish it.
            </p>
          ) : (
            <>
              <p>Here&rsquo;s how signing in now helps you:</p>
              {signInHelpList ? (
                signInHelpList()
              ) : (
                <ul>
                  <li>
                    We can fill in some of your information for you to save you
                    time.
                  </li>
                  <li>
                    You can save your work in progress. You&rsquo;ll have{' '}
                    {retentionPeriod} from {retentionPeriodStart} your {appType}{' '}
                    to come back and finish it.
                  </li>
                </ul>
              )}
            </>
          )}
          <p>
            {!hideUnauthedStartLink && (
              <>
                <strong>Note:</strong> You can sign in after you start your{' '}
                {appType}. But you&rsquo;ll lose any information you already
                filled in.
              </>
            )}
          </p>
          {unauthStartButton}
          {!hideUnauthedStartLink && (
            <p>
              <Link
                onClick={onClick}
                to={startPage}
                className="schemaform-start-button"
                aria-label={ariaLabel}
                aria-describedby={ariaDescribedby}
              >
                Start your {appType} without signing in
              </Link>
            </p>
          )}
        </div>
      </div>
    </VaAlert>
  );
};

LoggedOutAlert.propTypes = {
  alertTitle: PropTypes.string.isRequired,
  startPage: PropTypes.string.isRequired,
  unauthStartButton: PropTypes.any.isRequired,
  onClick: PropTypes.func.isRequired,
  appType: PropTypes.string,
  ariaDescribedby: PropTypes.string,
  ariaLabel: PropTypes.string,
  displayNonVeteranMessaging: PropTypes.bool,
  headingLevel: PropTypes.number,
  hideUnauthedStartLink: PropTypes.bool,
  retentionPeriod: PropTypes.any,
  retentionPeriodStart: PropTypes.any,
  signInHelpList: PropTypes.any,
};

export const LoggedInAlert = props => {
  const {
    appAction,
    appContinuing,
    appType,
    children,
    continueMsg,
    formConfig,
    formId,
    headingLevel,
    lastSavedDate,
    prefillAvailable,
    profile,
    savedForm,
    startPage,
    verifiedPrefillAlert,
  } = props;
  if (savedForm) {
    return (
      <SavedFormAlert
        appAction={appAction}
        appContinuing={appContinuing}
        appType={appType}
        continueMsg={continueMsg}
        formConfig={formConfig}
        formId={formId}
        headingLevel={headingLevel}
        lastSavedDate={lastSavedDate}
        profile={profile}
        savedForm={savedForm}
        startPage={startPage}
      >
        {children}
      </SavedFormAlert>
    );
  }

  if (prefillAvailable && !verifiedPrefillAlert) {
    return <UnverifiedPrefillAlert appType={appType} />;
  }

  if (prefillAvailable && verifiedPrefillAlert) {
    return verifiedPrefillAlert;
  }

  return <PrefillUnavailableAlert appType={appType} />;
};

LoggedInAlert.propTypes = {
  formId: PropTypes.string.isRequired,
  profile: PropTypes.object.isRequired,
  startPage: PropTypes.string.isRequired,
  appAction: PropTypes.string,
  appContinuing: PropTypes.any,
  appType: PropTypes.string,
  children: PropTypes.any,
  continueMsg: PropTypes.any,
  formConfig: PropTypes.object,
  headingLevel: PropTypes.number,
  lastSavedDate: PropTypes.any,
  prefillAvailable: PropTypes.any,
  savedForm: PropTypes.any,
  verifiedPrefillAlert: PropTypes.any,
};

export const VerificationOptionalAlert = props => {
  const {
    alertTitle,
    appType,
    ariaDescribedby,
    ariaLabel,
    buttonOnly,
    displayNonVeteranMessaging,
    headingLevel,
    hideUnauthedStartLink,
    onButtonClick,
    onLinkClick,
    retentionPeriod,
    retentionPeriodStart,
    signInHelpList,
    startPage,
    unauthStartText,
  } = props;
  const unauthStartButton = (
    <VaButton
      onClick={onButtonClick}
      label={ariaLabel}
      // aria-describedby={ariaDescribedby}
      uswds
      text={unauthStartText || UNAUTH_SIGN_IN_DEFAULT_MESSAGE}
    />
  );

  if (buttonOnly) {
    return (
      <ButtonOnlyAlert
        appType={appType}
        ariaDescribedby={ariaDescribedby}
        ariaLabel={ariaLabel}
        hideUnauthedStartLink={hideUnauthedStartLink}
        onClick={onButtonClick}
        startPage={startPage}
        unauthStartButton={unauthStartButton}
      />
    );
  }

  return (
    <LoggedOutAlert
      alertTitle={alertTitle}
      appType={appType}
      ariaDescribedby={ariaDescribedby}
      ariaLabel={ariaLabel}
      displayNonVeteranMessaging={displayNonVeteranMessaging}
      headingLevel={headingLevel}
      hideUnauthedStartLink={hideUnauthedStartLink}
      retentionPeriod={retentionPeriod}
      retentionPeriodStart={retentionPeriodStart}
      signInHelpList={signInHelpList}
      startPage={startPage}
      onClick={onLinkClick}
      unauthStartButton={unauthStartButton}
    />
  );
};

VerificationOptionalAlert.propTypes = {
  startPage: PropTypes.string.isRequired,
  alertTitle: PropTypes.string,
  appType: PropTypes.string,
  ariaDescribedby: PropTypes.string,
  ariaLabel: PropTypes.string,
  buttonOnly: PropTypes.bool,
  displayNonVeteranMessaging: PropTypes.bool,
  headingLevel: PropTypes.number,
  hideUnauthedStartLink: PropTypes.bool,
  retentionPeriod: PropTypes.any,
  retentionPeriodStart: PropTypes.any,
  signInHelpList: PropTypes.any,
  unauthStartText: PropTypes.string,
  onButtonClick: PropTypes.func,
  onLinkClick: PropTypes.func,
};
