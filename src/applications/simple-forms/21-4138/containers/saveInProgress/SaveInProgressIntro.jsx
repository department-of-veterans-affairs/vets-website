import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import PropTypes from 'prop-types';
import { VaLoadingIndicator } from '@department-of-veterans-affairs/component-library/dist/react-bindings';

import { getNextPagePath } from '~/platform/forms-system/src/js/routing';
import recordEvent from '~/platform/monitoring/record-event';

import { toggleLoginModal } from '~/platform/site-wide/user-nav/actions';
import DowntimeNotification, {
  externalServiceStatus,
} from '~/platform/monitoring/DowntimeNotification';
import { getIntroState } from '~/platform/forms/save-in-progress/selectors';
import {
  fetchInProgressForm,
  removeInProgressForm,
} from '~/platform/forms/save-in-progress/actions';
import DowntimeMessage from '~/platform/forms/save-in-progress/DowntimeMessage';
import {
  APP_TYPE_DEFAULT,
  APP_ACTION_DEFAULT,
} from '~/platform/forms-system/src/js/constants';
import FormControls from './FormControls';
import { DefaultAlert } from './StaticAlerts';
import {
  LoggedInAlert,
  VerificationOptionalAlert,
} from './AuthenticationAlerts';

const determineAlert = props => {
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
    login,
    prefillEnabled,
    profile,
    renderSignInMessage,
    retentionPeriod,
    retentionPeriodStart,
    savedForm,
    startPage,
    unauthStartText,
    unverifiedPrefillAlert,
    verifiedPrefillAlert,
    verifyRequiredPrefill,
  } = props;
  const { signInHelpList } = formConfig;
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
    const handleLinkClick = () => recordEvent({ event: 'no-login-start-form' });
    const openLoginModal = dispatch =>
      dispatch(toggleLoginModal(true, 'cta-form'));

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
        onButtonClick={openLoginModal}
        onLinkClick={handleLinkClick}
        retentionPeriod={retentionPeriod}
        retentionPeriodStart={retentionPeriodStart}
        signInHelpList={signInHelpList}
        startPage={startPage}
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
      ariaDescribedby={ariaDescribedby}
      ariaLabel={ariaLabel}
    />
  );
};

const renderDowntime = ({ downtime, buttonOnly, children }) => {
  if (downtime.status === externalServiceStatus.down) {
    const Message = downtime.message || DowntimeMessage;

    return <Message isAfterSteps={buttonOnly} downtime={downtime} />;
  }

  return children;
};

const SaveInProgressIntro = ({
  afterButtonContent,
  buttonOnly,
  children,
  downtime,
  formConfig,
  formData,
  pageList,
  pathname,
  resumeOnly,
  startMessageOnly,
}) => {
  const { formId, user, isLoggedIn, lastSavedDate } = useSelector(
    getIntroState,
  );
  const { profile, login } = user;
  const dispatch = useDispatch();

  const appType = formConfig?.customText?.appType || APP_TYPE_DEFAULT;

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

  const savedForm = profile?.savedForms?.find(f => f.form === formId);
  const startPage = pathname
    ? getNextPagePath(pageList, formData || {}, pathname)
    : pageList[1].path;
  const alert = determineAlert({
    afterButtonContent,
    buttonOnly,
    children,
    downtime,
    formConfig,
    formData,
    pageList,
    pathname,
    resumeOnly,
    startMessageOnly,
    lastSavedDate,
    login,
    profile,
    startPage,
  });

  if (resumeOnly && !savedForm) return null;
  if (startMessageOnly && !savedForm) return <div>{alert}</div>;

  const content = (
    <div>
      {!buttonOnly && alert}
      {buttonOnly && !login.currentlyLoggedIn && alert}
      {!savedForm &&
        login.currentlyLoggedIn && (
          <FormControls
            savedForm={savedForm}
            startPage={startPage}
            fetchInProgressForm={() => dispatch(fetchInProgressForm())}
            removeInProgressForm={() => dispatch(removeInProgressForm())}
          />
        )}
      {!buttonOnly && afterButtonContent}
      <br />
    </div>
  );

  if (
    downtime &&
    (!isLoggedIn || (downtime.requiredForPrefill && !savedForm))
  ) {
    return (
      <DowntimeNotification
        appTitle={formId}
        render={renderDowntime({ downtime, buttonOnly, children })}
        dependencies={downtime.dependencies}
        customText={formConfig.customText}
      >
        {content}
      </DowntimeNotification>
    );
  }

  return content;
};

export default SaveInProgressIntro;

SaveInProgressIntro.propTypes = {
  pageList: PropTypes.array.isRequired,
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
