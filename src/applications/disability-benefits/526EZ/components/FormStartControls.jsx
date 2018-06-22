import React from 'react';
import PropTypes from 'prop-types';

import LoadingIndicator from '@department-of-veterans-affairs/formation/LoadingIndicator';
import SaveInProgressIntro from '../../../../platform/forms/save-in-progress/SaveInProgressIntro';
import backendServices from '../../../../platform/user/profile/constants/backendServices';

import { ITFErrorAlert, VerifiedAlert, UnauthenticatedAlert, UnverifiedAlert, ITFDescription } from '../helpers';
import formConfig from '../config/form';


export default function FormStartControls(props) {
  const { user: { login: { currentlyLoggedIn }, profile: { verified, services, savedForms } } } = props;
  const { EVSS_CLAIMS } = backendServices;

  const { formId } = formConfig;
  const hasSavedForm = !!(savedForms.find(form => form === formId));

  const somethingWentWrong = props.ITFStatus && props.ITFStatus === 'expired' || // This may not be possible
                             props.errors && props.errors.length;
  const hasEVSSClaimsService = !!(services.find(service => service === EVSS_CLAIMS));
  const gateAuthenticatedUser = !verified && currentlyLoggedIn;
  const gateVerifiedUser = !hasEVSSClaimsService && verified;
  const permitVerifiedUser = verified && hasEVSSClaimsService;
  return (
    <div>
      {!currentlyLoggedIn && <div>
        {UnauthenticatedAlert}
        <button className="usa-button-primary" onClick={props.authenticate}>Sign In and Verify Your Identity</button>
      </div>}
      {gateAuthenticatedUser && <div>
        {UnverifiedAlert}
        <a href={`/verify?next=${window.location.pathname}`} className="usa-button-primary verify-link">Verify Your Identity</a>
      </div>}
      {gateVerifiedUser && !hasSavedForm && <button disabled className="usa-button-primary verify-link">Start the Disability Compensation Application</button>}
      {gateVerifiedUser && hasSavedForm && <button disabled className="usa-button-primary verify-link">Continue the Disability Compensation Application</button>}
      {somethingWentWrong && ITFErrorAlert}
      {props.ITFStatus === 'pending' && <LoadingIndicator message="Please wait while we check that your intent to file has been submitted."/>}
      {!props.ITFStatus && permitVerifiedUser && <SaveInProgressIntro
        {...props}
        buttonOnly={props.buttonOnly}
        prefillAvailable
        afterButtonContent={ITFDescription}
        verifiedPrefillAlert={VerifiedAlert}
        unverifiedPrefillAlert={UnauthenticatedAlert}
        verifyRequiredPrefill={props.route.formConfig.verifyRequiredPrefill}
        prefillEnabled={props.route.formConfig.prefillEnabled}
        messages={props.route.formConfig.savedFormMessages}
        pageList={props.route.pageList}
        beforeStartForm={props.beforeStartForm}
        startText="Start the Disability Compensation Application"
        {...props.saveInProgressActions}
        {...props.saveInProgress}/>}
    </div>
  );
}

FormStartControls.PropTypes = {
  buttonOnly: PropTypes.boolean,
  prefillAlert: PropTypes.func.isRequired,
  verifyRequiredPrefill: PropTypes.func.isRequired,
  prefillEnabled: PropTypes.boolean,
  messages: PropTypes.array.isRequired,
  pageList: PropTypes.array.isRequired,
  handleLoadPrefill: PropTypes.func.isRequired,
  startText: PropTypes.string.isRequired
};

