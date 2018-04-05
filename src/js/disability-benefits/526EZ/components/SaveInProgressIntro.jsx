import React from 'react';

import SaveInProgressIntro from '../../../common/schemaform/save-in-progress/SaveInProgressIntro';

export default function SIPIntro(props) {
  return (<SaveInProgressIntro
    buttonOnly={props.buttonOnly}
    hideButton={props.hideButton}
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
