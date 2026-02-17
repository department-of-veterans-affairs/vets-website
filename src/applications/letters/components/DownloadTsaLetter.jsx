import React, { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import {
  VaAlert,
  VaLink,
  VaLoadingIndicator,
} from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import CallVBACenter from '@department-of-veterans-affairs/platform-static-data/CallVBACenter';
import recordEvent from 'platform/monitoring/record-event';
import { DOWNLOAD_TSA_LETTER_ENDPOINT } from '../utils/constants';
import { apiRequest } from '../utils/helpers';

export const DownloadTsaLetter = ({ documentId, documentVersion }) => {
  const ref = useRef(null);
  const [error, setError] = useState(false);
  const [hasFetched, setHasFetched] = useState(false);
  const [letterData, setLetterData] = useState(null);

  useEffect(() => {
    let hasFetchedLocal = false;

    const getTsaLetterData = () => {
      return apiRequest(
        DOWNLOAD_TSA_LETTER_ENDPOINT(documentId, documentVersion),
      )
        .then(response => {
          response.blob().then(blob => {
            window.URL = window.URL || window.webkitURL;
            const downloadUrl = window.URL.createObjectURL(blob);
            setLetterData(downloadUrl);
            recordEvent({
              event: 'api_call',
              'api-name': 'GET /v0/tsa_letter/:id/version/:version_id/download',
              'api-status': 'successful',
            });
          });
        })
        .catch(() => {
          setError(true);
          recordEvent({
            event: 'api_call',
            'api-name': 'GET /v0/tsa_letter/:id/version/:version_id/download',
            'api-status': 'error',
          });
        });
    };

    const checkOpenState = async () => {
      const isOpen = ref.current?.hasAttribute('open');
      if (isOpen && !hasFetchedLocal) {
        hasFetchedLocal = true;
        await getTsaLetterData();
        setHasFetched(true);
      }
    };

    checkOpenState();

    const observer = new MutationObserver(checkOpenState);
    observer.observe(ref.current, {
      attributes: true,
      attributeFilter: ['open'],
    });

    return () => {
      observer.disconnect();
    };
  }, [documentId, documentVersion]);

  useEffect(() => {
    return () => {
      if (letterData) {
        window.URL.revokeObjectURL(letterData);
      }
    };
  }, [letterData]);

  const loading = !hasFetched;
  const letterTitle = 'TSA PreCheck Application Fee Waiver Letter';
  const handleClick = () =>
    recordEvent({
      event: 'letter-download',
      'letter-type': letterTitle,
    });

  return (
    <va-accordion-item data-testid="tsa-letter-accordion" ref={ref}>
      <h3 slot="headline">{letterTitle}</h3>
      <p>
        The {letterTitle} shows you’re eligible for free enrollment in
        Transportation Security Administration (TSA) PreCheck.
      </p>
      <p>
        You’ll need to print this letter and bring it with you when completing
        your TSA PreCheck application.
      </p>
      {loading && <VaLoadingIndicator message="Loading your letter..." />}
      {error && (
        <VaAlert class="vads-u-margin-top--2" status="error" role="alert">
          <h4 slot="headline">{`Your ${letterTitle} is currently unavailable`}</h4>
          <p>
            If you need help accessing your letter, please <CallVBACenter />
          </p>
        </VaAlert>
      )}
      {letterData && (
        <div className="vads-u-margin-top--1">
          <VaLink
            href={letterData}
            filetype="PDF"
            filename={`${letterTitle}.pdf`}
            text={`Download ${letterTitle}`}
            download
            onClick={handleClick}
          />
        </div>
      )}
    </va-accordion-item>
  );
};

DownloadTsaLetter.propTypes = {
  documentId: PropTypes.string.isRequired,
  documentVersion: PropTypes.string.isRequired,
};
