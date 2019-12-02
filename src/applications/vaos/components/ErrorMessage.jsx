import React from 'react';

import AlertBox from '@department-of-veterans-affairs/formation-react/AlertBox';

export default function ErrorMessage() {
  return (
    <AlertBox status="error" headline="Sorry, something went wrong">
      We're sorry, we ran into an error. Please try again later.
    </AlertBox>
  );
}
