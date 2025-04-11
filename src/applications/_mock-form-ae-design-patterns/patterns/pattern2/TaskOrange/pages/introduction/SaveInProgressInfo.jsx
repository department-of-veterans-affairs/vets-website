import React from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import { Link } from 'react-router';

import { VaButton } from '@department-of-veterans-affairs/component-library/dist/react-bindings';

import { selectAuthStatus } from 'applications/_mock-form-ae-design-patterns/utils/selectors/auth-status';
import { getTaskFromUrl } from 'applications/_mock-form-ae-design-patterns/utils/helpers/task';
import { TASKS } from 'applications/_mock-form-ae-design-patterns/utils/constants';
import content from 'applications/_mock-form-ae-design-patterns/shared/locales/en/content.json';

import SaveInProgressIntro from './SaveInProgressIntro';

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
    startText: 'Start the education application',
    unauthStartText: content['sip-sign-in-to-start-text'],
    messages: savedFormMessages,
    formConfig: { customText },
    headingLevel: 3,
    // verifiedPrefillAlert: VerifiedPrefillAlert,
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
    const redirectLocation = `${formConfig.rootUrl}${formConfig.urlPrefix}introduction?loggedIn=true`;

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
        <h2 className="vads-u-font-size--h3" slot="headline">
          Sign in now to save time and save your work in progress
        </h2>
        <p>Here&rsquo;s how signing in now helps you:</p>
        <ul>
          <li>
            We can fill in some of your information for you to save you time.
          </li>
          <li>
            You can save your work in progress. You’ll have 60 days from when
            you start or make updates to your application to come back and
            finish it.
          </li>
        </ul>
        <p>
          <strong>Note:</strong> You can sign in after you start your
          application. But you&rsquo;ll lose any information you already filled
          in.
        </p>
        <VaButton
          onClick={onSignInButtonClick}
          text="Sign in to start your application"
        />
        <p>
          <Link
            to="/2/task-orange/introduction?loggedIn=false"
            className="schemaform-start-button"
          >
            Start your application without signing in
          </Link>
        </p>
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
