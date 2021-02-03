import React, { useState } from 'react';

import ViewAndPrint from '../Buttons/ViewAndPrint';
import PrintErrorMessage from '../../Messages/PrintErrorMessage';

export default function PrintButton() {
  const [isError, setIsError] = useState(false);
  const handleClick = () => {
    setIsError(true);
  };
  if (isError) {
    return <PrintErrorMessage />;
  }
  return <ViewAndPrint onClick={handleClick} />;
}
