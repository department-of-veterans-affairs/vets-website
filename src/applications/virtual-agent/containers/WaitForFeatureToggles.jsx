import React from 'react';
import LoadingIndicator from '@department-of-veterans-affairs/component-library/LoadingIndicator';
import WaitForVirtualAgentToken from './WaitForVirtualAgentToken';
import useWaitForFeatureToggles from './useWaitForFeatureToggles';

export default function WaitForFeatureToggles() {
  const { loading } = useWaitForFeatureToggles();

  if (loading) {
    return <LoadingIndicator message={'Loading Virtual Agent'} />;
  }
  return <WaitForVirtualAgentToken />;
}
