import React from 'react';
import AlertBox from '@department-of-veterans-affairs/component-library/AlertBox';

export default function PrefillAlert({ formContext }) {
  if (!formContext.prefilled) {
    return null;
  }

  return (
    <AlertBox
      status="info"
      content="This is the personal information we have on file for you."
    />
  );
}
