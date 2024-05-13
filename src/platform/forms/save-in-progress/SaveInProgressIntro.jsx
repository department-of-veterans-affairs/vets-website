import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router';
import PropTypes from 'prop-types';
import { fromUnixTime, isBefore } from 'date-fns';
import { format } from 'date-fns-tz';
import {
  VaAlert,
  VaButton,
  VaLoadingIndicator,
} from '@department-of-veterans-affairs/component-library/dist/react-bindings';

import { getNextPagePath } from '~/platform/forms-system/src/js/routing';
import {
  expiredMessage,
  inProgressMessage as getInProgressMessage,
} from '~/platform/forms-system/src/js/utilities/save-in-progress-messages';
import recordEvent from '~/platform/monitoring/record-event';

import { toggleLoginModal } from '~/platform/site-wide/user-nav/actions';
import DowntimeNotification, {
  externalServiceStatus,
} from '~/platform/monitoring/DowntimeNotification';
import { fetchInProgressForm, removeInProgressForm } from './actions';
import FormStartControls from './FormStartControls';
import { getIntroState } from './selectors';
import DowntimeMessage from './DowntimeMessage';
import {
  APP_TYPE_DEFAULT,
  UNAUTH_SIGN_IN_DEFAULT_MESSAGE,
  APP_ACTION_DEFAULT,
} from '../../forms-system/src/js/constants';

const handleClick = () => recordEvent({ event: 'no-login-start-form' });
const openLoginModal = dispatch => dispatch(toggleLoginModal(true, 'cta-form'));

const getStartPage = ({ formData, pathname, pageList }) => {
  const data = formData || {};
  // pathname is only provided when the first page is conditional
  if (pathname) return getNextPagePath(pageList, data, pathname);
  return pageList[1].path;
};

const includesFormControls = (user, formId) => {
  const { login, profile } = user;
  const savedForm = profile && profile.savedForms.find(f => f.form === formId);

  return login.currentlyLoggedIn && savedForm;
};

const FormControls = (savedForm, props) => {
  const {
    ariaDescribedby,
    ariaLabel,
    formId,
    gaStartEventName,
    messages,
    migrations,
    prefillTransformer,
    resumeOnly,
    returnUrl,
    startText,
    user,
  } = props;
  const dispatch = useDispatch();
  const { profile } = user;
  const startPage = getStartPage();
  const prefillAvailable = !!(
    profile && profile.prefillsAvailable.includes(formId)
  );
  const isExpired = savedForm
    ? isBefore(fromUnixTime(savedForm.metadata.expiresAt), new Date())
    : false;
  return (
    <FormStartControls
      resumeOnly={resumeOnly}
      isExpired={isExpired}
      messages={messages}
      startText={startText}
      startPage={startPage}
      formId={formId}
      returnUrl={returnUrl}
      migrations={migrations}
      prefillTransformer={prefillTransformer}
      fetchInProgressForm={() => dispatch(fetchInProgressForm)}
      removeInProgressForm={() => dispatch(removeInProgressForm)}
      prefillAvailable={prefillAvailable}
      formSaved={!!savedForm}
      gaStartEventName={gaStartEventName}
      ariaLabel={ariaLabel}
      ariaDescribedby={ariaDescribedby}
    />
  );
};

const SavedFormAlert = props => {
  /**
   * lastSavedDate = JS time (ms) - always undefined?
   * savedForms.lastUpdated = unix time (seconds)
   * savedForms.metadata.expiresAt = unix time
   * savedForms.metadata.lastUpdated = unix time
   * savedForms.metadata.savedAt = JS time (ms)
   */

  const {
    appAction,
    appContinuing,
    appType,
    children,
    continueMsg,
    formConfig,
    headingLevel,
    lastSavedDate,
    savedForm,
  } = props;
  const { metadata = {} } = savedForm;
  const lastUpdated = savedForm.lastUpdated || metadata.lastUpdated;

  let savedAt;
  if (lastSavedDate) {
    savedAt = new Date(lastSavedDate);
  } else if (lastUpdated) {
    savedAt = fromUnixTime(lastUpdated);
  }

  const expiresAt = fromUnixTime(savedForm.metadata.expiresAt);
  const expirationDate = format(expiresAt, 'MMMM d, yyyy');
  const isExpired = isBefore(expiresAt, new Date());
  const inProgressMessage = getInProgressMessage(formConfig);

  if (!isExpired) {
    const lastSavedDateTime =
      savedAt && format(savedAt, "MMMM d, yyyy', at' h:mm aaaa z");

    const CustomHeader = `h${headingLevel}`;
    const ContinueMsg = (
      <p>
        You can continue {appAction} now
        {appContinuing && ` ${appContinuing}`}, or come back later to finish
        your {appType}.
      </p>
    );

    return (
      <VaAlert status="info" uswds visible>
        <div className="schemaform-sip-alert-title">
          <CustomHeader className="usa-alert-heading vads-u-font-size--h3">
            {inProgressMessage} {savedAt && 'and was last saved on '}
            {lastSavedDateTime}
          </CustomHeader>
        </div>
        <div className="saved-form-metadata-container">
          <div className="expires-container">
            {continueMsg || ContinueMsg}
            <p>
              Your {appType}{' '}
              <span className="expires">will expire on {expirationDate}.</span>
            </p>
          </div>
        </div>
        <div>{children}</div>
        <FormControls savedForm={savedForm} />
      </VaAlert>
    );
  }

  return (
    <div>
      <VaAlert status="warning" uswds visible>
        <div className="schemaform-sip-alert-title">
          <strong>Your {appType} has expired</strong>
        </div>
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
};

const UnverifiedPrefillAlert = ({ appType }) => (
  <div>
    <VaAlert status="info" uswds visible>
      <div className="usa-alert-body">
        <strong>Note:</strong> Since you’re signed in to your account, we can
        prefill part of your {appType} based on your account details. You can
        also save your {appType} in progress and come back later to finish
        filling it out.
      </div>
    </VaAlert>
    <br />
  </div>
);

const PrefillUnavailableAlert = ({ appType }) => (
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

const ButtonOnlyAlert = props => {
  const {
    appType,
    ariaDescribedby,
    ariaLabel,
    hideUnauthedStartLink,
    unauthStartButton,
  } = props;
  return (
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
};

const LoggedOutAlert = props => {
  const {
    alertTitle,
    appType,
    ariaDescribedby,
    ariaLabel,
    displayNonVeteranMessaging,
    headingLevel,
    hideUnauthedStartLink,
    retentionPeriod,
    retentionPeriodStart,
    signInHelpList,
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
};

const LoggedInAlert = props => {
  const {
    appAction,
    appContinuing,
    appType,
    children,
    continueMsg,
    formConfig,
    headingLevel,
    lastSavedDate,
    prefillAvailable,
    savedForm,
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
        headingLevel={headingLevel}
        lastSavedDate={lastSavedDate}
        savedForm={savedForm}
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

const VerificationOptionalAlert = props => {
  const {
    alertTitle,
    appType,
    ariaDescribedby,
    ariaLabel,
    buttonOnly,
    displayNonVeteranMessaging,
    headingLevel,
    hideUnauthedStartLink,
    retentionPeriod,
    retentionPeriodStart,
    signInHelpList,
    unauthStartText,
  } = props;
  const dispatch = useDispatch();
  const unauthStartButton = (
    <VaButton
      onClick={openLoginModal(dispatch)}
      label={ariaLabel}
      // aria-describedby={ariaDescribedby}
      uswds
      text={unauthStartText || UNAUTH_SIGN_IN_DEFAULT_MESSAGE}
    />
  );
  return buttonOnly ? (
    <ButtonOnlyAlert
      appType={appType}
      ariaDescribedby={ariaDescribedby}
      ariaLabel={ariaLabel}
      getStartPage={getStartPage}
      hideUnauthedStartLink={hideUnauthedStartLink}
      unauthStartButton={unauthStartButton}
    />
  ) : (
    <LoggedOutAlert
      alertTitle={alertTitle}
      appType={appType}
      ariaDescribedby={ariaDescribedby}
      ariaLabel={ariaLabel}
      displayNonVeteranMessaging={displayNonVeteranMessaging}
      getStartPage={getStartPage}
      headingLevel={headingLevel}
      hideUnauthedStartLink={hideUnauthedStartLink}
      retentionPeriod={retentionPeriod}
      retentionPeriodStart={retentionPeriodStart}
      signInHelpList={signInHelpList}
      unauthStartButton={unauthStartButton}
    />
  );
};

const DefaultAlert = ({ appType, ariaLabel, ariaDescribedby }) => {
  return (
    <div>
      <VaAlert status="info" uswds visible>
        <div className="usa-alert-body">
          You can save this {appType} in progress, and come back later to finish
          filling it out.
          <br />
          <VaButton
            className="va-button-link"
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
};

const Alert = props => {
  const {
    alertTitle,
    ariaDescribedby = null,
    ariaLabel = null,
    buttonOnly,
    children,
    continueMsg,
    displayNonVeteranMessaging,
    formConfig,
    formId,
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
    user,
    verifiedPrefillAlert,
    verifyRequiredPrefill,
  } = props;
  const { signInHelpList } = formConfig;
  const { profile, login } = user;
  const prefillAvailable = !!(
    profile && profile.prefillsAvailable.includes(formId)
  );

  // e.g. appType = 'application'
  const appType = formConfig?.customText?.appType || APP_TYPE_DEFAULT;
  // e.g. appAction = 'applying'
  const appAction = formConfig?.customText?.appAction || APP_ACTION_DEFAULT;
  // e.g. appContinuing = 'for planning and career guidance' =>
  // You can continue applying now for planning and career guidance, or...
  const appContinuing = formConfig?.customText?.appContinuing || '';

  if (login.currentlyLoggedIn) {
    return (
      <LoggedInAlert
        appAction={appAction}
        appContinuing={appContinuing}
        appType={appType}
        continueMsg={continueMsg}
        formConfig={formConfig}
        headingLevel={headingLevel}
        lastSavedDate={lastSavedDate}
        prefillAvailable={prefillAvailable}
        savedForm={savedForm}
        verifiedPrefillAlert={verifiedPrefillAlert}
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
      <VerificationOptionalAlert
        alertTitle={alertTitle}
        appType={appType}
        ariaDescribedby={ariaDescribedby}
        ariaLabel={ariaLabel}
        buttonOnly={buttonOnly}
        displayNonVeteranMessaging={displayNonVeteranMessaging}
        headingLevel={headingLevel}
        hideUnauthedStartLink={hideUnauthedStartLink}
        retentionPeriod={retentionPeriod}
        retentionPeriodStart={retentionPeriodStart}
        signInHelpList={signInHelpList}
        unauthStartText={unauthStartText}
      />
    );
  }

  if (prefillEnabled && unverifiedPrefillAlert) {
    return unverifiedPrefillAlert;
  }

  return (
    <DefaultAlert
      appType={appType}
      ariaLabel={ariaLabel}
      ariaDescribedby={ariaDescribedby}
    />
  );
};

const Downtime = ({ downtime, buttonOnly, children }) => {
  if (downtime.status === externalServiceStatus.down) {
    const Message = downtime.message || DowntimeMessage;

    return <Message isAfterSteps={buttonOnly} downtime={downtime} />;
  }

  return children;
};

const SaveInProgressIntro = props => {
  const {
    afterButtonContent,
    alertTitle,
    ariaDescribedby,
    ariaLabel,
    buttonOnly,
    children,
    continueMsg,
    displayNonVeteranMessaging,
    downtime,
    formConfig,
    headingLevel,
    hideUnauthedStartLink,
    prefillEnabled,
    renderSignInMessage,
    resumeOnly,
    retentionPeriod,
    retentionPeriodStart,
    startMessageOnly,
    unauthStartText,
    unverifiedPrefillAlert,
    verifiedPrefillAlert,
    verifyRequiredPrefill,
  } = props;

  const { formId, user, isLoggedIn, lastSavedDate } = useSelector(state =>
    getIntroState(state),
  );
  const appType = formConfig?.customText?.appType || APP_TYPE_DEFAULT;
  const { profile, login } = user;
  const savedForm = profile && profile.savedForms.find(f => f.form === formId);

  if (profile.loading && !resumeOnly) {
    return (
      <div>
        <VaLoadingIndicator
          message={`Checking to see if you have a saved version of this ${appType} ...`}
        />
        <br />
      </div>
    );
  }

  if (resumeOnly && !savedForm) return null;

  const alert = (
    <Alert
      alertTitle={alertTitle}
      ariaDescribedby={ariaDescribedby}
      ariaLabel={ariaLabel}
      buttonOnly={buttonOnly}
      continueMsg={continueMsg}
      displayNonVeteranMessaging={displayNonVeteranMessaging}
      formConfig={formConfig}
      formId={formId}
      headingLevel={headingLevel}
      hideUnauthedStartLink={hideUnauthedStartLink}
      lastSavedDate={lastSavedDate}
      prefillEnabled={prefillEnabled}
      renderSignInMessage={renderSignInMessage}
      retentionPeriod={retentionPeriod}
      retentionPeriodStart={retentionPeriodStart}
      savedForm={savedForm}
      unauthStartText={unauthStartText}
      unverifiedPrefillAlert={unverifiedPrefillAlert}
      user={user}
      verifiedPrefillAlert={verifiedPrefillAlert}
      verifyRequiredPrefill={verifyRequiredPrefill}
    >
      {children}
    </Alert>
  );

  if (startMessageOnly && !savedForm) return <div>{alert}</div>;

  const content = (
    <div>
      {!buttonOnly && alert}
      {buttonOnly && !login.currentlyLoggedIn && alert}
      {!includesFormControls(user, formId) &&
        login.currentlyLoggedIn && <FormControls savedForm={savedForm} />}
      {!buttonOnly && afterButtonContent}
      <br />
    </div>
  );

  // If the dependencies aren't required for pre-fill (but are required for submit),
  // only render the downtime notification if the user isn't logged in.
  //   If the user is logged in, they can at least save their form.
  // If the dependencies _are_ required for pre-fill, render the downtime notification
  // _unless_ the user has a form saved (so they don't need pre-fill).

  if (
    downtime &&
    (!isLoggedIn || (downtime.requiredForPrefill && !savedForm))
  ) {
    return (
      <DowntimeNotification
        appTitle={formId}
        render={
          <Downtime downtime={downtime} buttonOnly={buttonOnly}>
            {children}
          </Downtime>
        }
        dependencies={downtime.dependencies}
        customText={formConfig.customText}
      >
        {content}
      </DowntimeNotification>
    );
  }

  return content;
};

SaveInProgressIntro.propTypes = {
  fetchInProgressForm: PropTypes.func.isRequired,
  formId: PropTypes.string.isRequired,
  pageList: PropTypes.array.isRequired,
  removeInProgressForm: PropTypes.func.isRequired,
  toggleLoginModal: PropTypes.func.isRequired,
  user: PropTypes.object.isRequired,
  afterButtonContent: PropTypes.element,
  alertTitle: PropTypes.string,
  ariaDescribedby: PropTypes.string,
  ariaLabel: PropTypes.string,
  buttonOnly: PropTypes.bool,
  children: PropTypes.any,
  continueMsg: PropTypes.string,
  displayNonVeteranMessaging: PropTypes.bool,
  downtime: PropTypes.object,
  formConfig: PropTypes.shape({
    signInHelpList: PropTypes.func,
    customText: PropTypes.shape({
      appType: PropTypes.string,
      appAction: PropTypes.string,
      appContinuing: PropTypes.string,
    }),
  }),
  formData: PropTypes.object,
  gaStartEventName: PropTypes.string,
  headingLevel: PropTypes.number,
  hideUnauthedStartLink: PropTypes.bool,
  isLoggedIn: PropTypes.bool,
  lastSavedDate: PropTypes.number,
  messages: PropTypes.object,
  migrations: PropTypes.array,
  pathname: PropTypes.string,
  prefillEnabled: PropTypes.bool,
  prefillTransformer: PropTypes.func,
  renderSignInMessage: PropTypes.func,
  resumeOnly: PropTypes.bool,
  retentionPeriod: PropTypes.string,
  retentionPeriodStart: PropTypes.string,
  returnUrl: PropTypes.string,
  startMessageOnly: PropTypes.bool,
  startText: PropTypes.string,
  unauthStartText: PropTypes.string,
  unverifiedPrefillAlert: PropTypes.element,
  verifiedPrefillAlert: PropTypes.element,
  verifyRequiredPrefill: PropTypes.bool,
};

SaveInProgressIntro.defaultProps = {
  alertTitle: 'Sign in now to save your work in progress',
  retentionPeriod: '60 days', // from
  retentionPeriodStart: 'when you start or make updates to', // your {appType}
  unauthStartText: '',
  formConfig: {
    customText: {
      appType: '',
    },
  },
  headingLevel: 2,
  ariaLabel: null,
  ariaDescribedby: null,
};

export { SaveInProgressIntro };
