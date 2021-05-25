import React, { useState } from 'react';

import { focusElement } from 'platform/utilities/ui';

import LoadingMessage from './LoadingMessage';
import PrintErrorMessage from './PrintErrorMessage';
import ViewAndPrint from './ViewAndPrint';
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
      focusElement('#loading-message');

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
    return <LoadingMessage />;
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
