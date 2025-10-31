import React, { useEffect } from 'react';
import { focusElement } from 'platform/utilities/ui';
import { useFeatureToggle } from '~/platform/utilities/feature-toggles';

import Headline from '../ProfileSectionHeadline';

import AccountSecurityContent from './AccountSecurityContent';

const AccountSecurity = () => {
  const { TOGGLE_NAMES, useToggleValue } = useFeatureToggle();
  const profile2Enabled = useToggleValue(TOGGLE_NAMES.profile2Enabled);
  const headlineText = profile2Enabled
    ? 'Sign-in information'
    : 'Account security';

  useEffect(() => {
    focusElement('[data-focus-target]');
  }, []);

  useEffect(
    () => {
      document.title = `${headlineText} | Veterans Affairs`;
    },
    [headlineText],
  );

  return (
    <>
      <Headline>{headlineText}</Headline>
      <AccountSecurityContent />
    </>
  );
};

export default AccountSecurity;
