import React from 'react';

export default function Validate() {
  const goToIntroductionPage = () => {
    window.location.href = '/pre-check-in/introduction';
  };
  return (
    <div>
      <button onClick={goToIntroductionPage}>Validate</button>
    </div>
  );
}
