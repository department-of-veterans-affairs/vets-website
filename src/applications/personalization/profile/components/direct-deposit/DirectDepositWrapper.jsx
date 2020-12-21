// Very simple component that decides which version of the DirectDeposit
// component to show based on the value of the Flipper feature flag
import React from 'react';

import { connect } from 'react-redux';

import { showDirectDepositV2 } from '../../selectors';
import DirectDepositV1 from './DirectDepositV1';
import DirectDepositV2 from './DirectDepositV2';

const DirectDepositWrapper = ({ showVersion2 }) => {
  if (showVersion2) {
    return <DirectDepositV2 />;
  }
  return <DirectDepositV1 />;
};
const mapStateToProps = state => ({
  showVersion2: showDirectDepositV2(state),
});

export default connect(mapStateToProps)(DirectDepositWrapper);
