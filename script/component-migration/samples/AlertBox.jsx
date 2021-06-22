import React from 'react';
import AlertBox from '@department-of-veterans-affairs/component-library/AlertBox';

export function Sample() {
  const myStatus = 'info';
  const someContent = 'Testing Testing';
  const myHeadline = 'Pay attention!';

  return (
    <AlertBox status={myStatus} headline={myHeadline} content={someContent} />
  );
}
