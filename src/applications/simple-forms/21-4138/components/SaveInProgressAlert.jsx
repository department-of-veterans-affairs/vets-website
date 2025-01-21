import React from 'react';
import { Link } from 'react-router';
import PropTypes from 'prop-types';
import { fromUnixTime, isBefore } from 'date-fns';
import { format } from 'date-fns-tz';
import {
  VaButton,
  VaAlert,
} from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import {
  expiredMessage,
  inProgressMessage as getInProgressMessage,
} from 'platform/forms-system/src/js/utilities/save-in-progress-messages';
import {
  APP_TYPE_DEFAULT,
  UNAUTH_SIGN_IN_DEFAULT_MESSAGE,
  APP_ACTION_DEFAULT,
} from 'platform/forms-system/src/js/constants';

const LoggedInSavedActiveAlert = ({
  appType,
  children,
  continueMsg,
  expirationDate,
  getFormControls,
  Header,
  inProgressMessage,
  lastSavedDateTime,
  savedAt,
  savedForm,
}) => (
  <VaAlert status="info" uswds visible>
    <Header slot="headline">
      {inProgressMessage} {savedAt && 'and was last saved on '}
      {lastSavedDateTime}
    </Header>
    <div className="saved-form-metadata-container">
      <div className="expires-container">
        {continueMsg}
        <p>
          Your {appType}{' '}
          <span className="expires">will expire on {expirationDate}.</span>
        </p>
      </div>
    </div>
    <div>{children}</div>
    {getFormControls(savedForm)}
  </VaAlert>
);

LoggedInSavedActiveAlert.propTypes = {
  Header: PropTypes.object.isRequired,
  appType: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
  continueMsg: PropTypes.node.isRequired,
  expirationDate: PropTypes.string.isRequired,
  getFormControls: PropTypes.func.isRequired,
  inProgressMessage: PropTypes.string.isRequired,
  lastSavedDateTime: PropTypes.string.isRequired,
  savedAt: PropTypes.string.isRequired,
  savedForm: PropTypes.object.isRequired,
};

const LoggedInSavedExpiredAlert = ({ appType, formConfig, children }) => (
  <div>
    <VaAlert status="warning" uswds visible>
      <Header slot="headline">Your {appType} has expired</Header>
      <div className="saved-form-metadata-container">
        <span className="saved-form-metadata">
          {expiredMessage(formConfig)}
        </span>
      </div>
      <div>{children}</div>
    </VaAlert>
    <br />
  </div>
);

LoggedInSavedExpiredAlert.propTypes = {
  appType: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
  formConfig: PropTypes.object.isRequired,
};

const LoggedInUnverifiedPrefillAlert = () => (
  <div>
    <VaAlert status="info" visible>
      <h3>We’ve prefilled some of your information</h3>
      Since you’re signed in, we can prefill part of your application based on
      your profile details. You can also save your application in progress and
      come back later to finish filling it out.
    </VaAlert>
    <br />
  </div>
);

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

const LoggedInDefaultAlert = ({ appType }) => (
  <div>
    <VaAlert status="info" uswds visible>
      <div className="usa-alert-body">
        You can save this {appType} in progress, and come back later to finish
        filling it out.
      </div>
    </VaAlert>
    <br />
  </div>
);

LoggedInDefaultAlert.propTypes = {
  appType: PropTypes.string.isRequired,
};

const ButtonOnlyAlert = ({
  appType,
  ariaDescribedby,
  ariaLabel,
  getStartPage,
  handleClick,
  hideUnauthedStartLink,
  unauthStartButton,
}) => (
  <>
    {unauthStartButton}
    {!hideUnauthedStartLink && (
      <p>
        <Link
          onClick={handleClick}
          to={getStartPage}
          className="schemaform-start-button"
          aria-label={ariaLabel}
          aria-describedby={ariaDescribedby}
        >
          Start your {appType} without signing in
        </Link>
      </p>
    )}
  </>
);

ButtonOnlyAlert.propTypes = {
  appType: PropTypes.string.isRequired,
  getStartPage: PropTypes.string.isRequired,
  handleClick: PropTypes.func.isRequired,
  unauthStartButton: PropTypes.node.isRequired,
  ariaDescribedby: PropTypes.string,
  ariaLabel: PropTypes.string,
  hideUnauthedStartLink: PropTypes.bool,
};

const UnverifiedPrefillAlert = ({
  alertTitle,
  appType,
  ariaDescribedby,
  ariaLabel,
  displayNonVeteranMessaging,
  getStartPage,
  handleClick,
  Header,
  hideUnauthedStartLink,
  retentionPeriod,
  retentionPeriodStart,
  signInHelpList,
  unauthStartButton,
}) => (
  <VaAlert status="info" uswds visible>
    <div className="usa-alert-body">
      <Header className="usa-alert-heading">{alertTitle}</Header>
      <div className="usa-alert-text">
        {displayNonVeteranMessaging ? (
          <p>
            By signing in, you can save your work in progress. You&rsquo;ll have{' '}
            {retentionPeriod} from {retentionPeriodStart} your {appType} to come
            back and finish it.
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
              onClick={handleClick}
              to={getStartPage}
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

UnverifiedPrefillAlert.propTypes = {
  alertTitle: PropTypes.string.isRequired,
  appType: PropTypes.string.isRequired,
  ariaDescribedby: PropTypes.string,
  ariaLabel: PropTypes.string,
  displayNonVeteranMessaging: PropTypes.bool,
  getStartPage: PropTypes.func.isRequired,
  handleClick: PropTypes.func.isRequired,
  hideUnauthedStartLink: PropTypes.bool,
  retentionPeriod: PropTypes.string.isRequired,
  retentionPeriodStart: PropTypes.string.isRequired,
  signInHelpList: PropTypes.func.isRequired,
  unauthStartButton: PropTypes.node.isRequired,
};

const SaveInProgressAlert = props => {
  // let includesFormControls = false;
  const {
    alertTitle,
    ariaDescribedby = null,
    ariaLabel = null,
    formConfig,
    formId,
    getFormControls,
    getStartPage,
    handleClick,
    openLoginModal,
    prefillEnabled,
    renderSignInMessage,
    savedForm,
    unverifiedPrefillAlert,
    verifiedPrefillAlert,
    verifyRequiredPrefill,
  } = props;
  const { profile, login } = props.user;
  const prefillAvailable = !!(
    profile && profile.prefillsAvailable.includes(formId)
  );
  const appType = formConfig?.customText?.appType || APP_TYPE_DEFAULT;

  const getLoggedInAlert = () => {
    if (savedForm) {
      /**
       * lastSavedDate = JS time (ms) - always undefined?
       * savedForms.lastUpdated = unix time (seconds)
       * savedForms.metadata.expiresAt = unix time
       * savedForms.metadata.lastUpdated = unix time
       * savedForms.metadata.savedAt = JS time (ms)
       */
      const { metadata = {} } = savedForm;
      const lastUpdated = savedForm.lastUpdated || metadata.lastUpdated;

      let savedAt = '';
      if (props.lastSavedDate) {
        savedAt = new Date(props.lastSavedDate);
      } else if (lastUpdated) {
        savedAt = fromUnixTime(lastUpdated);
      }

      const expiresAt = fromUnixTime(savedForm.metadata.expiresAt);
      const expirationDate = format(expiresAt, 'MMMM d, yyyy');
      const isExpired = isBefore(expiresAt, new Date());
      const inProgressMessage = getInProgressMessage(formConfig);
      // e.g. appAction = 'applying'
      const appAction = formConfig?.customText?.appAction || APP_ACTION_DEFAULT;
      // e.g. appContinuing = 'for planning and career guidance' =>
      // You can continue applying now for planning and career guidance, or...
      const appContinuing = formConfig?.customText?.appContinuing || '';

      const Header = `h${props.headingLevel}`;
      if (!isExpired) {
        const lastSavedDateTime =
          savedAt && format(savedAt, "MMMM d, yyyy', at' h:mm aaaa z");

        const ContinueMsg = (
          <p>
            You can continue {appAction} now
            {appContinuing && ` ${appContinuing}`}, or come back later to finish
            your {appType}.
          </p>
        );

        // includesFormControls = true;
        return (
          <LoggedInSavedActiveAlert
            appType={appType}
            continueMsg={props.continueMsg || ContinueMsg}
            expirationDate={expirationDate}
            getFormControls={getFormControls}
            inProgressMessage={inProgressMessage}
            lastSavedDateTime={lastSavedDateTime}
            savedAt={savedAt}
            savedForm={savedForm}
            Header={Header}
          >
            {props.children}
          </LoggedInSavedActiveAlert>
        );
      }

      return (
        <LoggedInSavedExpiredAlert appType={appType} formConfig={formConfig}>
          {props.children}
        </LoggedInSavedExpiredAlert>
      );
    }

    if (prefillAvailable && !verifiedPrefillAlert) {
      return <LoggedInUnverifiedPrefillAlert />;
    }

    if (prefillAvailable && verifiedPrefillAlert) {
      return verifiedPrefillAlert;
    }

    return <LoggedInDefaultAlert appType={appType} />;
  };

  const getUnverifiedPrefillAlert = () => {
    const Header = `h${props.headingLevel}`;
    const { signInHelpList } = formConfig;
    const {
      buttonOnly,
      retentionPeriod,
      retentionPeriodStart,
      unauthStartText,
    } = props;
    const CustomLink = props.customLink;
    const unauthStartButton = CustomLink ? (
      <CustomLink
        href="#start"
        onClick={event => {
          event.preventDefault();
          openLoginModal();
        }}
      >
        {unauthStartText || UNAUTH_SIGN_IN_DEFAULT_MESSAGE}
      </CustomLink>
    ) : (
      <VaButton
        onClick={openLoginModal}
        label={ariaLabel}
        aria-describedby={ariaDescribedby}
        uswds
        text={unauthStartText || UNAUTH_SIGN_IN_DEFAULT_MESSAGE}
      />
    );

    if (buttonOnly) {
      return (
        <ButtonOnlyAlert {...props} unauthStartButton={unauthStartButton} />
      );
    }

    return (
      <UnverifiedPrefillAlert
        alertTitle={alertTitle}
        appType={appType}
        ariaDescribedby={ariaDescribedby}
        ariaLabel={ariaLabel}
        displayNonVeteranMessaging={props.displayNonVeteranMessaging}
        getStartPage={getStartPage}
        handleClick={handleClick}
        Header={Header}
        hideUnauthedStartLink={props.hideUnauthedStartLink}
        retentionPeriod={retentionPeriod}
        retentionPeriodStart={retentionPeriodStart}
        signInHelpList={signInHelpList}
        unauthStartButton={unauthStartButton}
      />
    );
  };

  if (login.currentlyLoggedIn) {
    return getLoggedInAlert();
  }

  if (renderSignInMessage) {
    return renderSignInMessage(prefillEnabled);
  }

  if (prefillEnabled && !verifyRequiredPrefill) {
    return getUnverifiedPrefillAlert();
  }

  if (prefillEnabled && unverifiedPrefillAlert) {
    return unverifiedPrefillAlert;
  }

  return <DefaultAlert appType={appType} />;
};

SaveInProgressAlert.propTypes = {
  alertTitle: PropTypes.string,
  appType: PropTypes.string,
  ariaDescribedby: PropTypes.string,
  ariaLabel: PropTypes.string,
  buttonOnly: PropTypes.bool,
  children: PropTypes.node,
  continueMsg: PropTypes.node,
  customLink: PropTypes.any,
  displayNonVeteranMessaging: PropTypes.bool,
  expirationDate: PropTypes.string,
  formConfig: PropTypes.object,
  formId: PropTypes.string.isRequired,
  getFormControls: PropTypes.func,
  getStartPage: PropTypes.func,
  handleClick: PropTypes.func,
  headingLevel: PropTypes.number,
  hideUnauthedStartLink: PropTypes.bool,
  inProgressMessage: PropTypes.string,
  lastSavedDate: PropTypes.number,
  openLoginModal: PropTypes.func,
  prefillEnabled: PropTypes.bool,
  retentionPeriod: PropTypes.string,
  retentionPeriodStart: PropTypes.string,
  savedForm: PropTypes.object,
  signInHelpList: PropTypes.func,
  unauthStartText: PropTypes.string,
  unverifiedPrefillAlert: PropTypes.node,
  user: PropTypes.shape({
    profile: PropTypes.object,
    login: PropTypes.object,
  }),
  verifiedPrefillAlert: PropTypes.node,
  verifyRequiredPrefill: PropTypes.bool,
};

export default SaveInProgressAlert;
