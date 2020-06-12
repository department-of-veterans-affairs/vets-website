// libs
import React from 'react';

// platform - forms - actions
import { saveErrors } from 'platform/forms/save-in-progress/actions';

// platform - forms components
import FailureAlert from 'platform/forms/components/common/alerts/FailureAlert';

// platform - forms containers
import SaveFormLink from 'platform/forms/save-in-progress/SaveFormLink';

// platform
import CallHRC from 'platform/static-data/CallHRC';

function ErrorMessage(props) {
  const {
    active,
    form,
    location,
    route,
    saveAndRedirectToReturnUrl,
    showLoginModal,
    toggleLoginModal,
    user,
  } = props;

  if (!active) return;

  const errorText = route?.formConfig?.errorText;
  const hasSavedErrors = true; // saveErrors.has(form?.savedStatus);

  const saveLink = (
    <SaveFormLink
      locationPathname={location.pathname}
      form={form}
      user={user}
      showLoginModal={showLoginModal}
      saveAndRedirectToReturnUrl={saveAndRedirectToReturnUrl}
      toggleLoginModal={toggleLoginModal}
    >
      Save your form
    </SaveFormLink>
  );

  let InlineErrorComponent;
  if (typeof errorText === 'function') {
    InlineErrorComponent = errorText;
  } else if (typeof errorText === 'string') {
    InlineErrorComponent = () => <p>{errorText}</p>;
  } else {
    InlineErrorComponent = () => (
      <p>
        If it still doesn’t work, please <CallHRC />
      </p>
    );
  }

  let returnObj;
  if (hasSavedErrors) {
    returnObj = saveLink;
  } else {
    returnObj = (
      <FailureAlert
        isLoggedIn={user?.login?.currentlyLoggedIn}
        title="We’re sorry. We can't submit your form right now."
      >
        <p>
          We’re working to fix the problem. Please make sure you’re connected to
          the Internet, and then try saving your form again. {saveLink}.
        </p>
        <InlineErrorComponent />
      </FailureAlert>
    );
  }

  return returnObj;
}

export default ErrorMessage;
