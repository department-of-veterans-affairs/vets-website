import React from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';

import SaveInProgressIntro from 'platform/forms/save-in-progress/SaveInProgressIntro';
import { VaButton } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import { selectAuthStatus } from '../../utils/selectors/auth-status';
import VerifiedPrefillAlert from './alerts/VerifiedPrefillAlert';
import content from '../locales/en/content.json';
import { getTaskFromUrl } from '../../utils/helpers/task';
import { TASKS } from '../../utils/constants';

const SaveInProgressInfo = ({ formConfig, pageList }) => {
  const { isLoggedOut } = useSelector(selectAuthStatus);

  const {
    downtime,
    prefillEnabled,
    savedFormMessages,
    customText,
  } = formConfig;

  const task = getTaskFromUrl(formConfig.urlPrefix);

  const buttonOnly = isLoggedOut || task === TASKS.YELLOW;

  // set the props to use for the SaveInProgressIntro components
  const sipProps = {
    startText: content['sip-start-form-text'],
    unauthStartText: content['sip-sign-in-to-start-text'],
    messages: savedFormMessages,
    formConfig: { customText },
    headingLevel: 3,
    verifiedPrefillAlert: VerifiedPrefillAlert,
    buttonOnly,
    hideUnauthedStartLink: true,
    prefillEnabled,
    downtime,
    pageList,
    devOnly: { forceShowFormControls: false },
  };

  const sipIntro = <SaveInProgressIntro {...sipProps} />;

  // set the correct alert to render based on enrollment status
  const LoggedInAlertToRender = () => {
    return sipIntro;
  };

  const onSignInButtonClick = () => {
    const redirectLocation = `${formConfig.rootUrl}${
      formConfig.urlPrefix
    }introduction?loggedIn=true`;

    window.location = redirectLocation;
  };

  return isLoggedOut ? (
    <>
      <va-alert
        status="info"
        class="vads-u-margin-y--4"
        data-testid="ezr-login-alert"
        uswds
      >
        <h3 slot="headline">{content['sip-alert-title']}</h3>
        <div>
          <ul>
            <li>
              We can fill in some of your information for you to save you time.
            </li>
            <li>
              You can save your work in progress. You’ll have 60 days from when
              you start or make updates to your form to come back and finish it.
            </li>
          </ul>
          <VaButton
            onClick={onSignInButtonClick}
            text="Sign in to start your form"
          />
        </div>
      </va-alert>
    </>
  ) : (
    <div className="vads-u-margin-y--4">{LoggedInAlertToRender()}</div>
  );
};

SaveInProgressInfo.propTypes = {
  formConfig: PropTypes.object,
  pageList: PropTypes.array,
};

export default SaveInProgressInfo;
