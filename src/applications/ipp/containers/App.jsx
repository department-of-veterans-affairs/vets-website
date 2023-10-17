import React, { useState } from 'react';
import LocationConfirmation from './LocationConfirmation';
import LandingScreen from './LandingScreen';
// import CaseNumberScreen from './CaseNumberScreen';

export default function App() {
  const [pageNumber, setPageNumber] = useState(1);
  // console.log(pageNumber);

  switch (pageNumber) {
    case 1:
      return <LandingScreen onPageChange={setPageNumber} />;
    case 2:
      return <LocationConfirmation />;
    // case 'Papayas':
    //   console.log('Mangoes and papayas are $2.79 a pound.');
    //   // Expected output: "Mangoes and papayas are $2.79 a pound."
    //   break;
    default:
      return <LandingScreen onPageChange={setPageNumber} />;
  }
}
