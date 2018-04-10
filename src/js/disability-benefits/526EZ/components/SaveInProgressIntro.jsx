import React from 'react';
import PropTypes from 'prop-types';

import LoadingIndicator from '../../../common/components/LoadingIndicator';
import SaveInProgressIntro from '../../../common/schemaform/save-in-progress/SaveInProgressIntro';

import { ITFErrorAlert, VerifiedAlert, UnauthenticatedAlert, ITFDescription } from '../helpers';

export default function SIPIntro(props) {

  const somethingWentWrong = props.isDataAvailable === false ||
                             props.ITFStatus && props.ITFStatus === 'expired' ||// This may not be possible
                             props.errors && props.errors.length;
  return (
    <div>
      {somethingWentWrong && ITFErrorAlert}
      {props.ITFStatus === 'pending' && <LoadingIndicator message="Please wait while we check that your intent to file has been submitted."/>}
      {!props.ITFStatus && <SaveInProgressIntro
        {...props}
        buttonOnly={props.buttonOnly}
        afterButtonContent={ITFDescription}
        verifiedPrefillAlert={VerifiedAlert}
        unverifiedPrefillAlert={UnauthenticatedAlert}
        verifyRequiredPrefill={props.route.formConfig.verifyRequiredPrefill}
        prefillEnabled={props.route.formConfig.prefillEnabled}
        messages={props.route.formConfig.savedFormMessages}
        pageList={props.route.pageList}
        handleLoadPrefill={props.handleLoadPrefill}
        startText="Start the Disability Compensation Application"
        {...props.saveInProgressActions}
        {...props.saveInProgress}/>}
    </div>
  );
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

