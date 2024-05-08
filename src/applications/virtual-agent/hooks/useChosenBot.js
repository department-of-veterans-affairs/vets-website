import { useEffect } from 'react';

export default function useChosenBot(
  virtualAgentShowFloatingChatbot,
  setIsLoading,
  setChosenBot,
) {
  useEffect(
    () => {
      setIsLoading(false);
      if (virtualAgentShowFloatingChatbot) {
        setChosenBot('default');
      } else {
        setChosenBot('sticky');
      }
    },
    [virtualAgentShowFloatingChatbot],
  );
}
