import React, { useState } from 'react';

import ViewAndPrint from './ViewAndPrint';
import PrintErrorMessage from './PrintErrorMessage';

export default function PrintButton({
  displayArrow = true,
  ErrorCallToAction = () => <>Please refresh this page or try again later.</>,
}) {
  const [isError, setIsError] = useState(false);
  const handleClick = () => {
    setIsError(true);
  };
  if (isError) {
    return <PrintErrorMessage CallToAction={ErrorCallToAction} />;
  }
  return <ViewAndPrint displayArrow={displayArrow} onClick={handleClick} />;
}
