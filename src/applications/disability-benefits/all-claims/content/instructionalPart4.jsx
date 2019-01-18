import React from 'react';

import AdditionalInfo from '@department-of-veterans-affairs/formation/AdditionalInfo';

export const instructionalPart4Description = (
  <div>
    <h4>Provide your details</h4>
    <p>
      Fill in your personal information in{' '}
      <strong>Section I, Boxes 3-6.</strong> This will help us match the form to
      your claim.
    </p>
    <img src="/img/part3-image.png" alt="Section I, Boxes 3-6" />
    <AdditionalInfo triggerText="What is a VA file number?">
      A VA file number helps us identify you when you file a claim. For most
      Veterans, your VA file number is your Social Security number without
      dashes. If you filed your first claim a long time ago, the number may be
      different than your Social Security number.
    </AdditionalInfo>
  </div>
);
