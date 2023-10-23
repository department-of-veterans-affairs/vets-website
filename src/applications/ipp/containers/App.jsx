import React, { useState } from 'react';
import LocationConfirmation from './LocationConfirmation';
import LocationSelector from './LocationSelector';

import LandingScreen from './LandingScreen';
import CaseNumberScreen from './CaseNumberScreen';

export default function App() {
  const [pageNumber, setPageNumber] = useState(1);
  // console.log(pageNumber);

  switch (pageNumber) {
    case 1:
      return <LandingScreen onPageChange={setPageNumber} />;
    case 2:
      return <LocationSelector onPageChange={setPageNumber} />;
    case 3:
      return <LocationConfirmation onPageChange={setPageNumber} />;
    case 4:
      return <CaseNumberScreen />;
    default:
      return <LandingScreen onPageChange={setPageNumber} />;
  }
}
