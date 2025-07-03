import React from 'react';
import { useLocation } from 'react-router-dom-v5-compat';
import LetterList from './LetterList';
import NewAddressSection from './NewAddressSection';

export function LetterPage() {
  const location = useLocation();
  const success = location.state?.success;

  return (
    <div className="letters vads-u-margin-top--neg2 ">
      <NewAddressSection success={success} />
      <h2>Benefit letters and documents</h2>
      <LetterList />
    </div>
  );
}

export default LetterPage;
