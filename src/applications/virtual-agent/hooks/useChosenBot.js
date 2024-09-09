import { useEffect } from 'react';

export default function useChosenBot(
  virtualAgentShowFloatingChatbot,
  setIsLoading,
  setChosenBot,
) {
  useEffect(
    () => {
      if (virtualAgentShowFloatingChatbot !== null) {
        setIsLoading(false);
        setChosenBot(virtualAgentShowFloatingChatbot ? 'default' : 'sticky');
      }
    },
    [virtualAgentShowFloatingChatbot],
  );
}
