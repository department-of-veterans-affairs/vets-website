import React, { useState } from 'react';

import LoadingIndicator from '@department-of-veterans-affairs/component-library/LoadingIndicator';

import ViewAndPrint from './ViewAndPrint';
import PrintErrorMessage from './PrintErrorMessage';
import recordEvent from 'platform/monitoring/record-event';
import { TRACKING_PREFIX } from '../../constants/analytics';

import { loadPdfData } from '../../api';

import { openPdfInNewWindow } from './utils';

export default function PrintButton({
  displayArrow = true,
  ErrorCallToAction = () => <>Please refresh this page or try again later.</>,
  facilityName,
  appointmentTime,
  questionnaireResponseId,
}) {
  const [isError, setIsError] = useState(false);
  const [isLoading, setisLoading] = useState(false);
  const handleClick = async () => {
    try {
      setisLoading(true);
      const resp = await loadPdfData(questionnaireResponseId);
      const blob = await resp.blob();
      openPdfInNewWindow(window, blob);
      recordEvent({
        event: `${TRACKING_PREFIX}-pdf-generation-success`,
      });
      setisLoading(false);
    } catch (error) {
      // console.log({ error });
      recordEvent({
        event: `${TRACKING_PREFIX}-pdf-generation-failed`,
        'error-key': error.message,
      });
      setIsError(true);
    }
  };
  if (isError) {
    return <PrintErrorMessage CallToAction={ErrorCallToAction} />;
  }
  if (isLoading) {
    const className = `usa-button va-button view-and-print-button`;
    return (
      <>
        <section className="load-message">
          <LoadingIndicator />
          <p>
            We're creating a PDF of your completed questionnaire. Please don't
            refresh your browser.
          </p>
          <p>When your PDF is ready, it will open in a new browser tab.</p>
        </section>
        <button
          className={className}
          disabled
          data-testid="print-button"
          aria-label={`Creating your PDF`}
        >
          Creating PDF...
        </button>
      </>
    );
  }
  return (
    <>
      <ViewAndPrint
        displayArrow={displayArrow}
        onClick={handleClick}
        facilityName={facilityName}
        appointmentTime={appointmentTime}
      />
    </>
  );
}
