import { useEffect } from 'react';
import { postRecordDatadogAction } from '../api/MrApi';

export const useTrackAction = action => {
  useEffect(
    () => {
      postRecordDatadogAction(action);
    },
    [action],
  );
};
