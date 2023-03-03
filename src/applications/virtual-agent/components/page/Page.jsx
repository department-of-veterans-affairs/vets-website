import React from 'react';
import { toggleValues } from 'platform/site-wide/feature-toggles/selectors';
import FEATURE_FLAG_NAMES from 'platform/utilities/feature-toggles/featureFlagNames';
import Disclaimer from './Disclaimer';
import Chatbox from '../chatbox/Chatbox';

export default function Page() {
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
          <Chatbox />
        </div>
      </div>
    </div>
  );
}
