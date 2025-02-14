import React from 'react';
import LetterList from './LetterList';
import NewAddressSection from './NewAddressSection';

export function LetterPage() {
  return (
    <div className="usa-width-three-fourths letters vads-u-margin-top--neg2 ">
      <NewAddressSection />
      <h2>Benefit letters and document</h2>
      <LetterList />
    </div>
  );
}

export default LetterPage;
