import React from 'react';
import { claimsIntakeAddress } from './itfWrapper';

export const instructionalPart3Description = (
  <div>
    <h3 className="vads-u-font-size--h4">Fill in return address</h3>
    <p>
      Put the VA Claims Intake Center address listed below in{' '}
      <strong>Box 2.</strong> This is where your employer will return the form
      after they’ve completed their sections.
    </p>
    {claimsIntakeAddress}
    <img src="/img/part3-image.png" alt="Box 2" />
  </div>
);
