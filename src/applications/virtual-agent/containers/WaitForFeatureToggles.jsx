import React from 'react';
import LoadingIndicator from '@department-of-veterans-affairs/component-library/LoadingIndicator';
import { useSelector } from 'react-redux';
import WaitForVirtualAgentToken from './WaitForVirtualAgentToken';

function useWaitForFeatureToggles() {
  const loading = useSelector(state => state.featureToggles.loading);

  return { loading };
}

export default function WaitForFeatureToggles() {
  const { loading } = useWaitForFeatureToggles();

  if (loading) {
    return <LoadingIndicator message={'Loading Virtual Agent'} />;
  }
  return <WaitForVirtualAgentToken />;
}
