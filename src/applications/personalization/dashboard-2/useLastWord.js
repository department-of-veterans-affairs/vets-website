import React from 'react';

function useLastWord(text) {
  const textWords = React.useMemo(
    () => {
      return text.split(' ');
    },
    [text],
  );

  const firstWords = React.useMemo(
    () => {
      return textWords.slice(0, -1).join(' ');
    },
    [textWords],
  );

  const lastWord = React.useMemo(
    () => {
      return textWords.slice(-1);
    },
    [textWords],
  );

  return [lastWord, firstWords];
}
export default useLastWord;
