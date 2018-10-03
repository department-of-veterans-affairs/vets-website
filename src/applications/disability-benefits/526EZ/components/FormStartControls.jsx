import React from 'react';
import PropTypes from 'prop-types';

import SaveInProgressIntro from '../../../../platform/forms/save-in-progress/SaveInProgressIntro';

import {
  VerifiedAlert,
  UnauthenticatedAlert,
  UnverifiedAlert,
} from '../helpers';

export default function FormStartControls(props) {
  const { user } = props;

  return (
    <div>
      {!user.login.currentlyLoggedIn && (
        <div>
          {UnauthenticatedAlert}
          <button className="usa-button-primary" onClick={props.authenticate}>
            Sign In and Verify Your Identity
          </button>
        </div>
      )}
      {!user.profile.verified &&
        user.login.currentlyLoggedIn && (
          <div>
            {UnverifiedAlert}
            <a
              href={`/verify?next=${window.location.pathname}`}
              className="usa-button-primary verify-link"
            >
              Verify Your Identity
            </a>
          </div>
        )}
      {user.profile.verified && (
        <SaveInProgressIntro
          {...props}
          buttonOnly={props.buttonOnly}
          verifiedPrefillAlert={VerifiedAlert}
          unverifiedPrefillAlert={UnauthenticatedAlert}
          verifyRequiredPrefill={props.route.formConfig.verifyRequiredPrefill}
          prefillEnabled={props.route.formConfig.prefillEnabled}
          messages={props.route.formConfig.savedFormMessages}
          pageList={props.route.pageList}
          startText="Start the Disability Compensation Application"
          {...props.saveInProgressActions}
          {...props.saveInProgress}
        />
      )}
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
  startText: PropTypes.string.isRequired,
  user: PropTypes.object.isRequired,
};
