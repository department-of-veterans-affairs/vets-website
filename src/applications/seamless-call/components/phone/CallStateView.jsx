import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { callErrorStateDisplay } from '../../utils/CallErrorState';
import {
  callStateDisplay,
  isActive,
  isEnded,
  isFailed,
  isInitializing,
  isInitiated,
} from '../../utils/CallState';
import ElapsedCallTime from './ElapsedCallTime';
import RemoteStreamAudio from './RemoteStreamAudio';

const CallStateView = () => {
  const { state, errorState } = useSelector(({ call }) => call);
  const [elapsedCallTimeInSeconds, setElapsedCallTimeInSeconds] = useState(0);

  useEffect(
    () => {
      if (isInitiated(state)) {
        setElapsedCallTimeInSeconds(0);
      }
    },
    [state],
  );

  if (!state) {
    return null;
  }

  return (
    <div>
      {isInitializing(state) && callStateDisplay(state)}
      {isActive(state) && (
        <>
          <ElapsedCallTime
            elapsedCallTimeInSeconds={elapsedCallTimeInSeconds}
          />
          <RemoteStreamAudio onTimeUpdate={setElapsedCallTimeInSeconds} />
        </>
      )}
      {isEnded(state) && (
        <>
          <span>Call ended • </span>
          <ElapsedCallTime
            elapsedCallTimeInSeconds={elapsedCallTimeInSeconds}
          />
        </>
      )}
      {isFailed(state) && callErrorStateDisplay(errorState)}
    </div>
  );
};

export default CallStateView;
