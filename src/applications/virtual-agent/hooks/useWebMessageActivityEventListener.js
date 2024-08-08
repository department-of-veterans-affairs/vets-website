import { useEffect } from 'react';
import { storeUtterances } from '../utils/sessionStorage';

export default function useWebMessageActivityEventListener() {
  useEffect(() => {
    // initiate the event handler
    window.addEventListener('webchat-message-activity', storeUtterances);

    // this will clean up the event every time the component is re-rendered
    return function cleanup() {
      window.removeEventListener('webchat-message-activity', storeUtterances);
    };
  });
}
