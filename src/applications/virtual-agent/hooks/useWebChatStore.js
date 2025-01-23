import { useMemo } from 'react';
import StartConvoAndTrackUtterances from '../utils/startConvoAndTrackUtterances';

export function getApiUrl(environment) {
  return process.env.VIRTUAL_AGENT_BACKEND_URL || environment.API_URL;
}

export function getUserFirstName(userFirstName) {
  return userFirstName === '' ? 'noFirstNameFound' : userFirstName;
}

export function getUserUuid(userUuid) {
  return userUuid === null ? 'noUserUuid' : userUuid;
}

export default function useWebChatStore({
  createStore,
  userFirstName,
  userUuid,
  environment,
  ...params
}) {
  return useMemo(
    () => {
      return createStore(
        {},
        StartConvoAndTrackUtterances.makeBotStartConvoAndTrackUtterances({
          apiURL: getApiUrl(environment),
          baseURL: environment.BASE_URL,
          userFirstName: getUserFirstName(userFirstName),
          userUuid: getUserUuid(userUuid),
          ...params,
        }),
      );
    },
    [createStore],
  );
}
