import React from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';

import SaveInProgressIntro from 'platform/forms/save-in-progress/SaveInProgressIntro';
import { VaButton } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import { selectAuthStatus } from '../../utils/selectors/auth-status';
import VerifiedPrefillAlert from '../FormAlerts/VerifiedPrefillAlert';
import UpdatedFormAlertDescription from '../FormDescriptions/UpdatedFormAlertDescription';
import content from '../../locales/en/content.json';
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

  const sipIntro = (
    <SaveInProgressIntro {...sipProps}>
      <UpdatedFormAlertDescription />
    </SaveInProgressIntro>
  );

  // set the correct alert to render based on enrollment status
  const LoggedInAlertToRender = () => {
    return sipIntro;
  };

  const onSignInButtonClick = () => {
    window.location = `${formConfig.rootUrl}${
      formConfig.urlPrefix
    }introduction?loggedIn=true`;
  };

  return isLoggedOut ? (
    <>
      <va-alert
        status="info"
        class="vads-u-margin-y--4"
        data-testid="ezr-login-alert"
        uswds
      >
        <h3 slot="headline">
          Sign in with a verified account to update your information online
        </h3>

        <p>
          You’ll need to sign in with an identity-verified account through one
          of our account providers. Identity verification helps us protect all
          Veterans’ information and prevent scammers from stealing your
          benefits.
        </p>

        <p>
          <strong>Don’t yet have a verified account?</strong> Create a{' '}
          <strong>Login.gov</strong> or <strong>ID.me</strong> account now. Then
          come back here and sign in. We’ll help you verify your identity for
          your account.
        </p>

        <p>
          <strong>Not sure if your account is verified?</strong> Sign in here.
          We’ll tell you if you need to verify.
        </p>

        <VaButton
          onClick={onSignInButtonClick}
          text="Sign in to start your form"
        />
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
