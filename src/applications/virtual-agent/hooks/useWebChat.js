import useChatbotToken from './useChatbotToken';
import { combineLoadingStatus } from '../utils/loadingStatus';

import WebChatFramework from '../utils/webChatFrameworkBase';

export const getLoadingStatus = (
  tokenLoadingStatus,
  paramLoadingStatus,
  featureFlag,
) => {
  if (featureFlag) {
    // we combine token and param loading status
    return combineLoadingStatus(tokenLoadingStatus, paramLoadingStatus);
  }
  // we only need token loading status if feature flag is off
  return tokenLoadingStatus;
};

export default function useWebChat(
  virtualAgentEnableParamErrorDetection,
  paramLoadingStatus,
) {
  const token = useChatbotToken();

  const loadingStatus = getLoadingStatus(
    token.loadingStatus,
    paramLoadingStatus,
    virtualAgentEnableParamErrorDetection,
  );

  return {
    token: token.token,
    code: token.code,
    expired: token.expired,
    webChatFramework: WebChatFramework,
    loadingStatus,
  };
}
