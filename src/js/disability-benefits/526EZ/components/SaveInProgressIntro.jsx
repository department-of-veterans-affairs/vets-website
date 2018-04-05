import React from 'react';

import SaveInProgressIntro from '../../../common/schemaform/save-in-progress/SaveInProgressIntro';

import { UnauthenticatedVerifyAlert, AuthenticatedVerifyAlert } from '../helpers';

export default function SIPIntro(props) {
  return (<SaveInProgressIntro
    buttonOnly={props.buttonOnly}
    hideButton={props.hideButton}
    UnauthenticatedVerifyAlert={UnauthenticatedVerifyAlert}
    AuthenticatedVerifyAlert={AuthenticatedVerifyAlert}
    toggleAuthLevel={props.toggleAuthLevel}
    verifyRequiredPrefill={props.route.formConfig.verifyRequiredPrefill}
    prefillEnabled={props.route.formConfig.prefillEnabled}
    messages={props.route.formConfig.savedFormMessages}
    pageList={props.route.pageList}
    handleLoadPrefill={props.handleLoadPrefill}
    startText="Start the Disability Compensation Application"
    {...props.saveInProgressActions}
    {...props.saveInProgress}/>);
}
