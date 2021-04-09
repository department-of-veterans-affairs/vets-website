import React, { useState } from 'react';

import ViewAndPrint from './ViewAndPrint';
import PrintErrorMessage from './PrintErrorMessage';
import recordEvent from 'platform/monitoring/record-event';
import { TRACKING_PREFIX } from '../../constants/analytics';

import { loadPdfData } from '../../api';

export default function PrintButton({
  displayArrow = true,
  ErrorCallToAction = () => <>Please refresh this page or try again later.</>,
  facilityName,
  appointmentTime,
  questionnaireResponseId,
}) {
  const [isError, setIsError] = useState(false);
  const [pdfLink, setPdfLink] = useState(null);
  const handleClick = async () => {
    try {
      const resp = await loadPdfData(questionnaireResponseId);
      const blob = await resp.blob();
      // console.log({ blob, resp });
      const url = URL.createObjectURL(new Blob([blob]), {
        type: 'application/pdf',
      });
      // console.log({ url });
      setPdfLink(url);
      recordEvent({
        event: `${TRACKING_PREFIX}pdf-printed-success`,
      });
    } catch (error) {
      // console.log({ error });
      recordEvent({
        event: `${TRACKING_PREFIX}pdf-printed-failed`,
      });
      setIsError(true);
    }
  };
  if (isError) {
    return <PrintErrorMessage CallToAction={ErrorCallToAction} />;
  }
  return (
    <>
      <ViewAndPrint
        displayArrow={displayArrow}
        onClick={handleClick}
        facilityName={facilityName}
        appointmentTime={appointmentTime}
      />
      <a href={pdfLink} className="href" download="pdfName">
        Download now?
      </a>
    </>
  );
}
