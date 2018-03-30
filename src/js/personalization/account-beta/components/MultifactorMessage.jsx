import React from 'react';
import AlertBox from '../../../common/components/AlertBox';
import { mfa } from '../../../login/utils/helpers';

export default function MultifactorMessage({ multifactor }) {
  const headline = 'Add extra security to your account';
  const content = (
    <div>
      <p>For additional protection, we encourage you to add a second security step for signing in to your account.</p>
      <button className="usa-button-primary" onClick={mfa}>Add security step</button>
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
