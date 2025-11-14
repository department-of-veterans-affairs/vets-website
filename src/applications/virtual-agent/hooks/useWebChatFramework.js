import * as WebChat from 'botframework-webchat';
import { COMPLETE } from '../utils/loadingStatus';

export default function useWebChatFramework() {
  return { loadingStatus: COMPLETE, webChatFramework: WebChat };
}
