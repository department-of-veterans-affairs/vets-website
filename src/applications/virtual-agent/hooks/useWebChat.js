import useWebChatFramework from './useWebChatFramework';
import useVirtualAgentToken from './useVirtualAgentToken';
import { combineLoadingStatus } from '../utils/loadingStatus';

const getLoadingStatus = (
  webchatLoadingStatus,
  tokenLoadingStatus,
  paramLoadingStatus,
  featureFlag,
) => {
  const preliminaryCombinedLoadingStatus = combineLoadingStatus(
    webchatLoadingStatus,
    tokenLoadingStatus,
  );
  if (featureFlag) {
    // we run this again to add a 3rd status to the mix
    return combineLoadingStatus(
      preliminaryCombinedLoadingStatus,
      paramLoadingStatus,
    );
  }
  // the original logic only combined 2 statuses
  return preliminaryCombinedLoadingStatus;
};

export default function useWebChat(props, paramLoadingStatus) {
  const webChatFramework = useWebChatFramework(props);
  const token = useVirtualAgentToken(props);

  const loadingStatus = getLoadingStatus(
    webChatFramework.loadingStatus,
    token.loadingStatus,
    paramLoadingStatus,
    props.virtualAgentEnableParamErrorDetection,
  );

  return {
    token: token.token,
    webChatFramework: webChatFramework.webChatFramework,
    loadingStatus,
    apiSession: token.apiSession,
  };
}
