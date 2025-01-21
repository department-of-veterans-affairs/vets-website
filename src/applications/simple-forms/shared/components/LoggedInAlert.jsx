import React from 'react';
import PropTypes from 'prop-types';
import { fromUnixTime, isBefore } from 'date-fns';
import { format } from 'date-fns-tz';
import { VaAlert } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import {
  expiredMessage,
  inProgressMessage as getInProgressMessage,
} from 'platform/forms-system/src/js/utilities/save-in-progress-messages';
import { APP_ACTION_DEFAULT } from 'platform/forms-system/src/js/constants';

const LoggedInSavedActiveAlert = ({
  appType,
  children,
  continueMsg,
  expirationDate,
  formControls,
  Header,
  inProgressMessage,
  lastSavedDateTime,
  savedAt,
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
    {formControls}
  </VaAlert>
);

LoggedInSavedActiveAlert.propTypes = {
  Header: PropTypes.object.isRequired,
  appType: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
  continueMsg: PropTypes.node.isRequired,
  expirationDate: PropTypes.string.isRequired,
  inProgressMessage: PropTypes.string.isRequired,
  lastSavedDateTime: PropTypes.string.isRequired,
  savedAt: PropTypes.string.isRequired,
  savedForm: PropTypes.object.isRequired,
  formControls: PropTypes.any,
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

const LoggedInAlert = ({
  appType,
  children,
  formConfig,
  formControls,
  headingLevel,
  continueMsg,
  lastSavedDate,
  prefillAvailable,
  savedForm,
  verifiedPrefillAlert,
}) => {
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
    if (lastSavedDate) {
      savedAt = new Date(lastSavedDate);
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

    const Header = `h${headingLevel}`;
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
          continueMsg={continueMsg || ContinueMsg}
          expirationDate={expirationDate}
          formControls={formControls}
          inProgressMessage={inProgressMessage}
          lastSavedDateTime={lastSavedDateTime}
          savedAt={savedAt}
          savedForm={savedForm}
          Header={Header}
        >
          {children}
        </LoggedInSavedActiveAlert>
      );
    }

    return (
      <LoggedInSavedExpiredAlert appType={appType} formConfig={formConfig}>
        {children}
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

LoggedInAlert.propTypes = {
  appType: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
  formConfig: PropTypes.object.isRequired,
  formControls: PropTypes.func.isRequired,
  headingLevel: PropTypes.number.isRequired,
  continueMsg: PropTypes.node,
  lastSavedDate: PropTypes.string,
  prefillAvailable: PropTypes.bool,
  savedForm: PropTypes.object,
  verifiedPrefillAlert: PropTypes.node,
};

export default LoggedInAlert;
