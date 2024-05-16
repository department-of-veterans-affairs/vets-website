import React from 'react';
import { useDispatch } from 'react-redux';
import PropTypes from 'prop-types';
import { fromUnixTime, isBefore } from 'date-fns';
import { format } from 'date-fns-tz';
import {
  expiredMessage,
  inProgressMessage as getInProgressMessage,
} from '~/platform/forms-system/src/js/utilities/save-in-progress-messages';
import { VaAlert } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import {
  fetchInProgressForm,
  removeInProgressForm,
} from '~/platform/forms/save-in-progress/actions';
import FormControls from './FormControls';

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
    formId,
    headingLevel,
    lastSavedDate,
    profile,
    savedForm,
    startPage,
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
  const dispatch = useDispatch();

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
        <FormControls
          formId={formId}
          profile={profile}
          savedForm={savedForm}
          startPage={startPage}
          fetchInProgressForm={() => dispatch(fetchInProgressForm())}
          removeInProgressForm={() => dispatch(removeInProgressForm())}
        />
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

SavedFormAlert.propTypes = {
  formId: PropTypes.string.isRequired,
  profile: PropTypes.object.isRequired,
  startPage: PropTypes.string.isRequired,
  appAction: PropTypes.any,
  appContinuing: PropTypes.any,
  appType: PropTypes.string,
  children: PropTypes.any,
  continueMsg: PropTypes.string,
  formConfig: PropTypes.object,
  headingLevel: PropTypes.number,
  lastSavedDate: PropTypes.number,
  savedForm: PropTypes.any,
};

export default SavedFormAlert;
