import React from 'react';
import { connect, useSelector } from 'react-redux';
import { toggleValues } from 'platform/site-wide/feature-toggles/selectors';
import FEATURE_FLAG_NAMES from '@department-of-veterans-affairs/platform-utilities/featureFlagNames';
import Disclaimer from './Disclaimer';
import ChatBox from '../chatbox/Chatbox';
import FloatingChatBox from '../floating-chatbox/FloatingChatBox';

function Page() {
  const canShowFloatingChatbot = useSelector(
    state =>
      toggleValues(state)[FEATURE_FLAG_NAMES.virtualAgentFloatingChatbot],
  );

  return (
    <div className="vads-l-grid-container large-screen:vads-u-padding-x--0">
      <div className="vads-l-row vads-u-margin-x--neg2p5 vads-u-margin-y--4">
        <div className="vads-l-col--12 vads-u-padding-x--2p5 medium-screen:vads-l-col--5 small-desktop-screen:vads-l-col--7">
          <Disclaimer />
        </div>
        <div className="vads-l-col--12 vads-u-padding-x--2p5 medium-screen:vads-l-col--7 small-desktop-screen:vads-l-col--5">
          {`can show floating chatbox value:${canShowFloatingChatbot}`}
          <ChatBox />
        </div>
        <div className="vads-l-col--12 vads-u-padding-x--2p5 medium-screen:vads-l-col--7 small-desktop-screen:vads-l-col--5">
          {canShowFloatingChatbot && <FloatingChatBox />}
        </div>
      </div>
    </div>
  );
}

function mapStateToProps(state) {
  return {
    canShowFloatingChatbot: FEATURE_FLAG_NAMES.virtualAgentFloatingChatbot(
      state,
    ),
  };
}

export default connect(mapStateToProps)(Page);
