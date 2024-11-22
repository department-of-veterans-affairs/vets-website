import { useEffect, useMemo } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';

export const useBroadcastChannel = (channelName, initialValue = null) => {
  const [message, setMessage, clearMessage] = useLocalStorage(
    channelName,
    initialValue,
  );

  const channel = useMemo(() => new BroadcastChannel(channelName), [
    channelName,
  ]);

  useEffect(
    () => {
      const handleMessage = event => {
        setMessage(event.data);
      };

      channel.onmessage = handleMessage;

      // Clean up the channel when the component unmounts
      return () => {
        channel.close();
      };
    },
    [channel, setMessage],
  );

  const sendMessage = msg => {
    channel.postMessage(msg);
    setMessage(msg);
  };

  return [message, sendMessage, clearMessage];
};
