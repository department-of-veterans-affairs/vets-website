import React, { useEffect } from 'react';
import { focusElement } from 'platform/utilities/ui';

export const ConfirmationPage = () => {
  // Set focus
  useEffect(() => {
    focusElement('#confirmation-content');
  }, []);

  return (
    <>
      <div id="confirmation-content" className="vads-u-margin-bottom--4">
        <va-alert
          status="success"
          id="welcome-va-setup-review-information-confirmation-alert"
        >
          <h2 slot="headline">Contact information added to your profile</h2>
          <p className="vads-u-margin-y--2">
            If you apply for VA benefits, we’ll use this information to contact
            you with important information about your benefits and how to manage
            them.
          </p>
          <p className="vads-u-margin-y--3">
            You can change your email and text notification settings in your
            profile.
          </p>
          <va-link-action
            href="/profile/notifications/"
            text="Go to your notification settings in your VA.gov profile"
          />
        </va-alert>
      </div>
      <div className="vads-u-display--block">
        <va-link-action
          href="/my-va/"
          text="Go back to My VA"
          type="secondary"
        />
      </div>
      <div className="vads-u-display--block vads-u-margin-bottom--9">
        <va-link-action
          href="/profile/"
          text="Go back to your profile"
          type="secondary"
        />
      </div>
    </>
  );
};

export default ConfirmationPage;
