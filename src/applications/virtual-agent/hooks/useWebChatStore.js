import { useMemo } from 'react';
import StartConvoAndTrackUtterances from '../utils/startConvoAndTrackUtterances';

export default function useWebChatStore({ createStore, ...params }) {
  return useMemo(
    () => {
      return createStore(
        {},
        StartConvoAndTrackUtterances.makeBotStartConvoAndTrackUtterances({
          ...params,
        }),
      );
    },
    [createStore, params],
  );
}
