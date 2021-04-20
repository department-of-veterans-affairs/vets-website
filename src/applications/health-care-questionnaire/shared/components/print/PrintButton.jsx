import React, { useState } from 'react';

import LoadingButton from 'platform/site-wide/loading-button/LoadingButton';

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
      const qrId =
        sessionStorage.getItem('mock-questionnaire-response-id') ||
        questionnaireResponseId;
      const resp = await loadPdfData(qrId);
      const blob = await resp.blob();
      openPdfInNewWindow(window, blob);
      recordEvent({
        event: `${TRACKING_PREFIX}pdf-generation-success`,
      });
      setisLoading(false);
    } catch (error) {
      // console.log({ error });
      recordEvent({
        event: `${TRACKING_PREFIX}pdf-generation-failed`,
      });
      setIsError(true);
    }
  };
  if (isError) {
    return <PrintErrorMessage CallToAction={ErrorCallToAction} />;
  }
  if (isLoading) {
    return (
      <LoadingButton
        isLoading={isLoading}
        disabled
        loadingText="Generating PDF"
      />
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
