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

export const DownloadTsaLetter = ({ letter }) => {
  const ref = useRef(null);
  const [error, setError] = useState(false);
  const [hasFetched, setHasFetched] = useState(false);
  const [letterData, setLetterData] = useState(null);

  useEffect(
    () => {
      if (hasFetched) return;
      const getTsaLetterData = () => {
        return apiRequest(DOWNLOAD_TSA_LETTER_ENDPOINT(letter.document_id))
          .then(response => {
            response.blob().then(blob => {
              window.URL = window.URL || window.webkitURL;
              const downloadUrl = window.URL.createObjectURL(blob);
              setLetterData(downloadUrl);
              setHasFetched(true);
              recordEvent({
                event: 'api_call',
                'api-name': 'GET /v0/tsa_letter/:id',
                'api-status': 'successful',
              });
            });
          })
          .catch(() => {
            setHasFetched(true);
            setError(true);
            recordEvent({
              event: 'api_call',
              'api-name': 'GET /v0/tsa_letter/:id',
              'api-status': 'error',
            });
          });
      };
      const checkOpenState = () => {
        const isOpen = ref.current.hasAttribute('open');
        if (isOpen && !hasFetched) {
          getTsaLetterData();
        }
      };
      checkOpenState();
    },
    [hasFetched, letter],
  );

  const loading = ref.current?.hasAttribute('open') && !hasFetched;
  const letterTitle = 'TSA PreCheck Letter';

  return (
    <va-accordion-item key="tsa-letter" ref={ref}>
      <h3 slot="headline">{letterTitle}</h3>
      {error && (
        <VaAlert class="vads-u-margin-top--2" status="error" role="alert">
          <h4 slot="headline">{`Your ${letterTitle} is currently unavailable`}</h4>
          <p>
            If you need help accessing your letter, please <CallVBACenter />
          </p>
        </VaAlert>
      )}
      {loading && <VaLoadingIndicator message="Loading your letter..." />}
      {letterData && (
        <>
          <div>
            The TSA PreCheck Letter for Veterans shows that you qualify for free
            TSA PreCheck for life. You can use this letter instead of paying the
            application fee when you apply. The application process includes
            filling out an online form, going to an in-person appointment,
            getting fingerprinted, and passing a background check.
          </div>
          <div className="vads-u-margin-top--1">
            <VaLink
              href={letterData}
              filetype="PDF"
              filename={`${letterTitle}.pdf`}
              text={`Download ${letterTitle}`}
              download
            />
          </div>
        </>
      )}
    </va-accordion-item>
  );
};

DownloadTsaLetter.propTypes = {
  letter: PropTypes.object.isRequired,
};
