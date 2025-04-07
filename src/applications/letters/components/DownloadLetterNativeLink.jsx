import React from 'react';
import { useSelector } from 'react-redux';
import { VaLink } from '@department-of-veterans-affairs/component-library/dist/react-bindings';

const DownloadLetterNativeLink = ({ letterTitle, letterType }) => {
  const lettersArr = useSelector(state => state.letters.enhancedLetters);
  const lettersStatus = useSelector(
    state => state.letters.enhancedLettersAvailability,
  );
  let resourceUrl = '';
  const isLettersArrPopulated = lettersStatus === 'success';

  if (isLettersArrPopulated) {
    lettersArr.forEach(letterObj => {
      if (letterObj.letterType === letterType) {
        resourceUrl = letterObj.downloadUrl;
      }
    });
  }

  return (
    <>
      {isLettersArrPopulated ? (
        <VaLink
          href={resourceUrl}
          filetype="PDF"
          filename={`${letterTitle}.pdf`}
          text={letterTitle}
          download
        />
      ) : (
        <p>Your letter will be ready in a moment</p>
      )}
    </>
  );
};

export default DownloadLetterNativeLink;
