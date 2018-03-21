import React from 'react';
import AlertBox from '../../../common/components/AlertBox';

export default function MultifactorMessage({ multifactor, handleMultifactorRequest }) {
  const headline = 'Add extra security to your account';
  const content = (
    <div>
      <p>For additional protection, we encourage you to add a second security step for signing in to your account.</p>
      <button className="usa-button usa-button-secondary" onClick={handleMultifactorRequest}>Add security step</button>
    </div>
  );

  return (
    <AlertBox
      headline={headline}
      content={content}
      isVisible={!multifactor}
      status="info"/>
  );
}
