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
        setChosenBot('sticky');
      } else {
        setChosenBot('default');
      }
    },
    [virtualAgentShowFloatingChatbot],
  );
}
