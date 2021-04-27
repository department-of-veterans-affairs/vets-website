import React from 'react';
import LoadingIndicator from '@department-of-veterans-affairs/component-library/LoadingIndicator';
import { connect } from 'react-redux';
import WaitForVirtualAgentToken from './WaitForVirtualAgentToken';

function WaitForFeatureToggles({ featureTogglesLoading }) {
  if (featureTogglesLoading) {
    return <LoadingIndicator message={'Loading Virtual Agent'} />;
  }
  return <WaitForVirtualAgentToken />;
}

const mapStateToProps = state => {
  return {
    featureTogglesLoading: state.featureToggles.loading,
  };
};

export default connect(mapStateToProps)(WaitForFeatureToggles);
