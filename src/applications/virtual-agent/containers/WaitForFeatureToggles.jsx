import React from 'react';
import LoadingIndicator from '@department-of-veterans-affairs/component-library/LoadingIndicator';
import { connect } from 'react-redux';
import WebChat from './WebChat';

function WaitForFeatureToggles({ featureTogglesLoading }) {
  if (featureTogglesLoading) {
    return <LoadingIndicator message={'Loading Chatbot'} />;
  }
  return <WebChat />;
}

const mapStateToProps = state => {
  return {
    featureTogglesLoading: state.featureToggles.loading,
  };
};

export default connect(mapStateToProps)(WaitForFeatureToggles);
