import React from 'react';
import PropTypes from 'prop-types';

import SaveInProgressIntro from '../../../common/schemaform/save-in-progress/SaveInProgressIntro';

import { VerifiedAlert } from '../helpers';

export default function SIPIntro(props) {
  return (<SaveInProgressIntro
    buttonOnly={props.buttonOnly}
    prefillAlert={VerifiedAlert}
    verifyRequiredPrefill={props.route.formConfig.verifyRequiredPrefill}
    prefillEnabled={props.route.formConfig.prefillEnabled}
    messages={props.route.formConfig.savedFormMessages}
    pageList={props.route.pageList}
    handleLoadPrefill={props.handleLoadPrefill}
    startText="Start the Disability Compensation Application"
    {...props.saveInProgressActions}
    {...props.saveInProgress}/>);
}

SIPIntro.PropTypes = {
  buttonOnly: PropTypes.boolean,
  prefillAlert: PropTypes.func.isRequired,
  verifyRequiredPrefill: PropTypes.func.isRequired,
  prefillEnabled: PropTypes.boolean,
  messages: PropTypes.array.isRequired,
  pageList: PropTypes.array.isRequired,
  handleLoadPrefill: PropTypes.func.isRequired,
  startText: PropTypes.string.isRequired
};

