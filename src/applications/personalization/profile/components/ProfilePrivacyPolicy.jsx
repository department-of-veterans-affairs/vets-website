import React from 'react';
import { useFeatureToggle } from '~/platform/utilities/feature-toggles';

export const ProfilePrivacyPolicy = () => {
  const { TOGGLE_NAMES, useToggleValue } = useFeatureToggle();

  const showProfilePrivacyPolicy = useToggleValue(
    TOGGLE_NAMES.profileShowPrivacyPolicy,
  );

  return showProfilePrivacyPolicy ? (
    <>
      <h2 className="vads-u-font-size--h3">Privacy policy</h2>
      <p>
        To learn how we collect, store, and use your profile information, read
        our privacy policy.
      </p>
      <va-link href="/privacy-policy" text="Go to our privacy policy" />
    </>
  ) : null;
};
