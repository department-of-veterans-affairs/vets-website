import { useEffect, useMemo, useState } from 'react';

export const useBroadcastChannel = channelName => {
  const [message, setMessage] = useState(null);

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

  return [message, sendMessage];
};
