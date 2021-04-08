import React, { useState } from 'react';

import ViewAndPrint from './ViewAndPrint';
import PrintErrorMessage from './PrintErrorMessage';
import recordEvent from 'platform/monitoring/record-event';
import { TRACKING_PREFIX } from '../../constants/analytics';

export default function PrintButton({
  displayArrow = true,
  ErrorCallToAction = () => <>Please refresh this page or try again later.</>,
  facilityName,
  appointmentTime,
}) {
  const [isError, setIsError] = useState(false);
  const handleClick = () => {
    recordEvent({
      event: `${TRACKING_PREFIX}pdf-printed`,
    });
    setIsError(true);
  };
  if (isError) {
    return <PrintErrorMessage CallToAction={ErrorCallToAction} />;
  }
  return (
    <ViewAndPrint
      displayArrow={displayArrow}
      onClick={handleClick}
      facilityName={facilityName}
      appointmentTime={appointmentTime}
    />
  );
}
