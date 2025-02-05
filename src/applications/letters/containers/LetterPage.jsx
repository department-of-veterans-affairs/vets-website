import React from 'react';
import VAProfileWrapper from './VAProfileWrapper';
import LetterList from './LetterList';

export function LetterPage() {
  return (
    <div className="usa-width-three-fourths letters">
      <VAProfileWrapper />
      <LetterList />
    </div>
  );
}

export default LetterPage;
