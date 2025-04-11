import React from 'react';

function useLastWord(text) {
  const words = React.useMemo(() => {
    return text.split(' ');
  }, [text]);

  return React.useMemo(() => {
    return [words.slice(-1), [words.slice(0, -1).join(' ')]];
  }, [words]);
}
export default useLastWord;
