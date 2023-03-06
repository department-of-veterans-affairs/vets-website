import React from 'react';
import { connect, useSelector } from 'react-redux';
import { toggleValues } from 'platform/site-wide/feature-toggles/selectors';
import FEATURE_FLAG_NAMES from 'platform/utilities/feature-toggles/featureFlagNames';
import Disclaimer from './Disclaimer';
import ChatBox from '../chatbox/Chatbox';
import FloatingChatBox from '../floating-chatbox/FloatingChatBox';

const virtualAgentShowFloatingChatbot = state =>
  toggleValues(state)[FEATURE_FLAG_NAMES.virtualAgentShowFloatingChatbot];

function Page() {
  return (
    <div className="vads-l-grid-container large-screen:vads-u-padding-x--0">
      <div className="vads-l-row vads-u-margin-x--neg2p5 vads-u-margin-y--4">
        <div className="vads-l-col--12 vads-u-padding-x--2p5 medium-screen:vads-l-col--5 small-desktop-screen:vads-l-col--7">
          <Disclaimer />
        </div>
        <div className="vads-l-col--12 vads-u-padding-x--2p5 medium-screen:vads-l-col--7 small-desktop-screen:vads-l-col--5">
          {FEATURE_FLAG_NAMES.virtualAgentShowFloatingChatbot && (
            <FloatingChatBox />
          )}
          {!FEATURE_FLAG_NAMES.virtualAgentShowFloatingChatbot && <ChatBox />}
        </div>
      </div>
    </div>
  );
}

const mapStateToProps = state => ({
  virtualAgentShowFloatingChatbot: virtualAgentShowFloatingChatbot(state),
});

export default connect(mapStateToProps)(Page);
