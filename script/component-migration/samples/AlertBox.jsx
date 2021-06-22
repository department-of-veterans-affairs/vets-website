import React from 'react';
import AlertBox from '@department-of-veterans-affairs/component-library/AlertBox';

export function Sample() {
  const myStatus = 'info';
  const someContent = 'Testing Testing';

  return <AlertBox status={myStatus} headline="4" content={someContent} />;
}
