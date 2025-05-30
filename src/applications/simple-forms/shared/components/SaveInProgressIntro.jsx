import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { fromUnixTime, isBefore } from 'date-fns';

import { getNextPagePath } from '~/platform/forms-system/src/js/routing';
import environment from 'platform/utilities/environment';
import recordEvent from '~/platform/monitoring/record-event';

import { toggleLoginModal } from '~/platform/site-wide/user-nav/actions';
import DowntimeNotification, {
  externalServiceStatus,
} from '~/platform/monitoring/DowntimeNotification';
import {
  fetchInProgressForm,
  removeInProgressForm,
} from 'platform/forms/save-in-progress/actions';
import FormStartControls from 'platform/forms/save-in-progress/FormStartControls';
import { getIntroState } from 'platform/forms/save-in-progress/selectors';
import DowntimeMessage from 'platform/forms/save-in-progress/DowntimeMessage';
import { APP_TYPE_DEFAULT } from 'platform/forms-system/src/js/constants';
import SaveInProgressAlert from './SaveInProgressAlert';

const SaveInProgressIntro = ({
  afterButtonContent,
  ariaDescribedby,
  ariaLabel,
  buttonOnly,
  customLink,
  devOnly,
  downtime,
  formConfig,
  formData,
  formId,
  gaStartEventName,
  isLoggedIn,
  messages,
  migrations,
  pageList,
  pathname,
  prefillEnabled,
  prefillTransformer,
  renderSignInMessage,
  resumeOnly,
  returnUrl,
  startMessageOnly,
  startText,
  unverifiedPrefillAlert,
  user,
  verifiedPrefillAlert,
  verifyRequiredPrefill,
}) => {
  const devOnlyForceShowFormControls =
    environment.isLocalhost() &&
    !window.Cypress &&
    devOnly?.forceShowFormControls;
  const appType = formConfig?.customText?.appType || APP_TYPE_DEFAULT;
  const { profile, login } = user;
  const savedForm = profile && profile.savedForms.find(f => f.form === formId);

  const getStartPage = () => {
    const data = formData || {};
    // pathname is only provided when the first page is conditional
    if (pathname) return getNextPagePath(pageList, data, pathname);
    return pageList[1]?.path;
  };

  const getFormControls = () => {
    const startPage = getStartPage();
    const prefillAvailable = !!(
      profile && profile.prefillsAvailable.includes(formId)
    );
    const isExpired = savedForm
      ? isBefore(fromUnixTime(savedForm.metadata.expiresAt), new Date())
      : false;
    return (
      <FormStartControls
        fetchInProgressForm={fetchInProgressForm}
        formId={formId}
        formSaved={!!savedForm}
        prefillAvailable={prefillAvailable}
        removeInProgressForm={removeInProgressForm}
        startPage={startPage}
        ariaDescribedby={ariaDescribedby}
        ariaLabel={ariaLabel}
        customStartLink={customLink}
        gaStartEventName={gaStartEventName}
        isExpired={isExpired}
        messages={messages}
        migrations={migrations}
        prefillTransformer={prefillTransformer}
        resumeOnly={resumeOnly}
        returnUrl={returnUrl}
        startText={startText}
      />
    );
  };

  const openLoginModal = () => {
    toggleLoginModal(true, 'cta-form');
  };

  const handleClick = () => {
    recordEvent({ event: 'no-login-start-form' });
  };

  const renderDowntime = children => {
    if (downtime.status === externalServiceStatus.down) {
      const Message = downtime.message || DowntimeMessage;

      return (
        <Message
          isAfterSteps={buttonOnly}
          downtime={downtime}
          formConfig={formConfig}
          headerLevel={2}
        />
      );
    }

    return children;
  };

  const shouldShowFormControls = () => {
    if (savedForm) {
      const expiresAt = fromUnixTime(savedForm.metadata.expiresAt);
      const isExpired = isBefore(expiresAt, new Date());

      if (!isExpired) {
        return true;
      }
    }

    return false;
  };

  const formControls = getFormControls();

  if (profile.loading && !resumeOnly) {
    return (
      <div>
        <va-loading-indicator
          message={`Checking to see if you have a saved version of this ${appType} ...`}
        />
        <br />
        {devOnlyForceShowFormControls && (
          <>
            <div>dev only:</div>
            <div>{formControls}</div>
          </>
        )}
      </div>
    );
  }

  if (resumeOnly && !savedForm) {
    return null;
  }

  const alert = (
    <SaveInProgressAlert
      ariaDescribedby={ariaDescribedby}
      ariaLabel={ariaLabel}
      formConfig={formConfig}
      formId={formId}
      formControls={formControls}
      getStartPage={getStartPage}
      handleClick={handleClick}
      openLoginModal={openLoginModal}
      prefillEnabled={prefillEnabled}
      renderSignInMessage={renderSignInMessage}
      savedForm={savedForm}
      unverifiedPrefillAlert={unverifiedPrefillAlert}
      user={user}
      verifiedPrefillAlert={verifiedPrefillAlert}
      verifyRequiredPrefill={verifyRequiredPrefill}
    />
  );

  if (startMessageOnly && !savedForm) {
    return <div>{alert}</div>;
  }

  const includeFormControls = shouldShowFormControls();
  const showFormControls = !includeFormControls && login.currentlyLoggedIn;

  const content = (
    <div>
      {!buttonOnly && alert}
      {buttonOnly && !login.currentlyLoggedIn && alert}
      {showFormControls && formControls}
      {!showFormControls &&
        devOnlyForceShowFormControls && (
          <>
            <div>dev only:</div>
            <div>{formControls}</div>
          </>
        )}
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
        render={renderDowntime}
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
  customLink: PropTypes.any,
  devOnly: PropTypes.shape({
    forceShowFormControls: PropTypes.bool,
  }),
  displayNonVeteranMessaging: PropTypes.bool,
  downtime: PropTypes.object,
  formConfig: PropTypes.shape({
    prefillEnabled: PropTypes.bool.isRequired,
    savedFormMessages: PropTypes.object.isRequired,
    hideUnauthedStartLink: PropTypes.bool,
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
  customLink: null,
};

function mapStateToProps(state) {
  return {
    ...getIntroState(state),
  };
}

const mapDispatchToProps = {
  fetchInProgressForm,
  removeInProgressForm,
  toggleLoginModal,
};

/**
 * @type {React.FC<{
 *   fetchInProgressForm: any,
 *   formId: string,
 *   pageList: any[],
 *   removeInProgressForm: any,
 *   toggleLoginModal: any,
 *   user: any,
 *   afterButtonContent: any,
 *   alertTitle: string,
 *   ariaDescribedby: string,
 *   ariaLabel: string,
 *   buttonOnly: boolean,
 *   children: any,
 *   customLink: any,
 *   devOnly: {
 *     forceShowFormControls: boolean,
 *   },
 *   displayNonVeteranMessaging: boolean,
 *   downtime: any,
 *   formConfig: {
 *     signInHelpList: any,
 *     customText: {
 *       appType: string,
 *       appAction: string,
 *       appContinuing: string,
 *     },
 *   },
 *   formData: any,
 *   gaStartEventName: string,
 *   headingLevel: number,
 *   hideUnauthedStartLink: boolean,
 *   isLoggedIn: boolean,
 *   lastSavedDate: number,
 *   messages: any,
 *   migrations: any[],
 *   pathname: string,
 *   prefillEnabled: bullion,
 *   prefillTransformer: any,
 *   renderSignInMessage: any,
 *   resumeOnly: boolean,
 *   retentionPeriod: string,
 *   retentionPeriodStart: string,
 *   returnUrl: string,
 *   startMessageOnly: boolean,
 *   startText: string,
 *   unauthStartText: string,
 *   unverifiedPrefillAlert: any,
 *   verifiedPrefillAlert: any,
 *   verifyRequiredPrefill: boolean,
 * }>}
 */
export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(SaveInProgressIntro);

export { SaveInProgressIntro };
