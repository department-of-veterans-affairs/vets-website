import React, { useState } from 'react';

import ViewAndPrint from '../Buttons/ViewAndPrint';
import PrintErrorMessage from '../../Messages/PrintErrorMessage';

export default function PrintButton({ displayArrow = true }) {
  const [isError, setIsError] = useState(false);
  const handleClick = () => {
    setIsError(true);
  };
  if (isError) {
    return <PrintErrorMessage />;
  }
  return <ViewAndPrint onClick={handleClick} displayArrow={displayArrow} />;
}
