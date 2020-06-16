// libs
import React from 'react';

// platform - forms containers
import SaveFormLink from 'platform/forms/save-in-progress/SaveFormLink';

// platform
import CallHRC from 'platform/static-data/CallHRC';

// TODO: evaluate extract as common component?
function DefaultError() {
  return (
    <p>
      If it still doesn’t work, please <CallHRC />
    </p>
  );
}

// TODO: evaluate extract as common component?
function InlineErrorComponent(props) {
  const { errorText } = props;

  return (
    (errorText === 'function' && errorText) || (
      <p>{errorText || <DefaultError />}</p>
    )
  );
}

function FailureAlert(props) {
  const {
    errorText,
    form,
    hasSavedErrors,
    isLoggedIn,
    locationPathname,
    saveAndRedirectToReturnUrl,
    showLoginModal,
    title = "We’re sorry. We can't submit your form right now.",
    toggleLoginModal,
    user,
  } = props;

  const saveLink = (
    <SaveFormLink
      locationPathname={locationPathname}
      form={form}
      user={user}
      showLoginModal={showLoginModal}
      saveAndRedirectToReturnUrl={saveAndRedirectToReturnUrl}
      toggleLoginModal={toggleLoginModal}
    >
      Save your form
    </SaveFormLink>
  );

  return (
    (hasSavedErrors && saveLink) || (
      <React.Fragment>
        <p className="schemaform-warning-header">
          <strong>{title}</strong>
        </p>
        <p>
          We’re working to fix the problem. Please make sure you’re connected to
          the Internet, and then try saving your form again. {saveLink}.
        </p>
        {!isLoggedIn && (
          <p>
            If you don’t have an account, you’ll have to start over. Try
            submitting your form again tomorrow.
          </p>
        )}
        <InlineErrorComponent errorText={errorText} />
      </React.Fragment>
    )
  );
}

export default FailureAlert;
