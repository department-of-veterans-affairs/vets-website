import React from 'react';
import PropTypes from 'prop-types';
import {
  VaButton,
  VaAlert,
} from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import { APP_TYPE_DEFAULT } from 'platform/forms-system/src/js/constants';
import LoggedInAlert from './LoggedInAlert';
import UnverifiedPrefillAlert from './UnverifiedPrefillAlert';

const DefaultAlert = ({
  appType,
  ariaDescribedby,
  ariaLabel,
  openLoginModal,
}) => (
  <div>
    <VaAlert status="info" uswds visible>
      <div className="usa-alert-body">
        You can save this {appType} in progress, and come back later to finish
        filling it out.
        <br />
        <VaButton
          className="VaAutton-link"
          onClick={openLoginModal}
          aria-label={ariaLabel}
          aria-describedby={ariaDescribedby}
          text="Sign in to your account."
        />
      </div>
    </VaAlert>
    <br />
  </div>
);

DefaultAlert.propTypes = {
  appType: PropTypes.string.isRequired,
  openLoginModal: PropTypes.func.isRequired,
  ariaDescribedby: PropTypes.string,
  ariaLabel: PropTypes.string,
};

const SaveInProgressAlert = ({
  formConfig,
  formId,
  handleClick,
  openLoginModal,
  user,
  alertTitle,
  ariaDescribedby,
  ariaLabel,
  buttonOnly,
  children,
  continueMsg,
  customLink,
  displayNonVeteranMessaging,
  formControls,
  getStartPage,
  headingLevel,
  hideUnauthedStartLink,
  lastSavedDate,
  prefillEnabled,
  renderSignInMessage,
  retentionPeriod,
  retentionPeriodStart,
  savedForm,
  unauthStartText,
  unverifiedPrefillAlert,
  verifyRequiredPrefill,
}) => {
  const { profile, login } = user;
  const prefillAvailable = !!(
    profile && profile.prefillsAvailable.includes(formId)
  );
  const appType = formConfig?.customText?.appType || APP_TYPE_DEFAULT;

  if (login.currentlyLoggedIn) {
    return (
      <LoggedInAlert
        appType={appType}
        formConfig={formConfig}
        formControls={formControls}
        headingLevel={headingLevel}
        continueMsg={continueMsg}
        lastSavedDate={lastSavedDate}
        prefillAvailable={prefillAvailable}
        savedForm={savedForm}
      >
        {children}
      </LoggedInAlert>
    );
  }

  if (renderSignInMessage) {
    return renderSignInMessage(prefillEnabled);
  }

  if (prefillEnabled && !verifyRequiredPrefill) {
    return (
      <UnverifiedPrefillAlert
        alertTitle={alertTitle}
        appType={appType}
        buttonOnly={buttonOnly}
        customLink={customLink}
        formConfig={formConfig}
        getStartPage={getStartPage}
        handleClick={handleClick}
        openLoginModal={openLoginModal}
        retentionPeriod={retentionPeriod}
        retentionPeriodStart={retentionPeriodStart}
        ariaDescribedby={ariaDescribedby}
        ariaLabel={ariaLabel}
        displayNonVeteranMessaging={displayNonVeteranMessaging}
        hideUnauthedStartLink={hideUnauthedStartLink}
        headingLevel={headingLevel}
        unauthStartText={unauthStartText}
      />
    );
  }

  if (prefillEnabled && unverifiedPrefillAlert) {
    return unverifiedPrefillAlert;
  }

  return <DefaultAlert appType={appType} />;
};

SaveInProgressAlert.propTypes = {
  formConfig: PropTypes.object.isRequired,
  formId: PropTypes.string.isRequired,
  handleClick: PropTypes.func.isRequired,
  openLoginModal: PropTypes.func.isRequired,
  user: PropTypes.object.isRequired,
  alertTitle: PropTypes.string,
  ariaDescribedby: PropTypes.string,
  ariaLabel: PropTypes.string,
  buttonOnly: PropTypes.bool,
  children: PropTypes.any,
  continueMsg: PropTypes.string,
  customLink: PropTypes.any,
  displayNonVeteranMessaging: PropTypes.bool,
  formControls: PropTypes.object,
  getStartPage: PropTypes.string,
  headingLevel: PropTypes.number,
  hideUnauthedStartLink: PropTypes.bool,
  lastSavedDate: PropTypes.number,
  prefillEnabled: PropTypes.bool,
  renderSignInMessage: PropTypes.func,
  retentionPeriod: PropTypes.string,
  retentionPeriodStart: PropTypes.string,
  savedForm: PropTypes.object,
  unauthStartText: PropTypes.string,
  unverifiedPrefillAlert: PropTypes.node,
  verifyRequiredPrefill: PropTypes.bool,
};

export default SaveInProgressAlert;
