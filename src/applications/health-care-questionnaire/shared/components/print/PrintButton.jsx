import React, { useState } from 'react';

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
  questionnaireResponseId = 'cab5639d-04fe-4f3e-beb9-afefce91dba9',
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
      <button className="usa-button va-button view-and-print-button" disabled>
        Generating PDF
      </button>
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
