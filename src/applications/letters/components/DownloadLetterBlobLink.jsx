import React from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import {
  VaAlert,
  VaLink,
  VaLoadingIndicator,
} from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import CallVBACenter from '@department-of-veterans-affairs/platform-static-data/CallVBACenter';
import { DOWNLOAD_STATUSES } from '../utils/constants';

const DownloadLetterBlobLink = ({ letterTitle, letterType }) => {
  const lettersArr = useSelector(state => state.letters.enhancedLetters);
  const lettersStatus = useSelector(
    state => state.letters.enhancedLettersAvailability,
  );

  switch (lettersStatus) {
    case DOWNLOAD_STATUSES.downloading:
      return <VaLoadingIndicator message="Loading your letter..." />;
    case DOWNLOAD_STATUSES.success: {
      const enhancedLetter = lettersArr.find(
        letter => letter.letterType === letterType,
      );

      return (
        <div className="vads-u-margin-top--1">
          <VaLink
            href={enhancedLetter.downloadUrl}
            filetype="PDF"
            filename={`${letterTitle}.pdf`}
            text={`Download ${letterTitle}`}
            download
          />
        </div>
      );
    }
    case DOWNLOAD_STATUSES.failure:
      return (
        <VaAlert class="vads-u-margin-top--2" status="error" role="alert">
          <h4 slot="headline">{`Your ${letterTitle} is currently unavailable`}</h4>
          <p>
            If you need help accessing your letter, please <CallVBACenter />
          </p>
        </VaAlert>
      );
    default:
      return <div>Refresh the browser to download your letter.</div>;
  }
};

DownloadLetterBlobLink.propTypes = {
  letterTitle: PropTypes.string,
  letterType: PropTypes.string,
};

export default DownloadLetterBlobLink;
