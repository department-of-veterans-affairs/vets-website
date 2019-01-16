import React from 'react';
import { VA_FORM4142_URL } from '../constants';
import { claimsIntakeAddress } from './itfWrapper';

export const download4192Notice = (
  <div>
    <p>
      <a href={VA_FORM4142_URL} target="_blank">
        Download VA Form 21-4142
      </a>
    </p>
    <p>
      Print and send a form to each of your employers from the last 12 months
      you worked.
    </p>
    <p>
      If your employer returns the form to you when it’s complete, you can
      return to this application and upload it. Or, mail the form to:
    </p>
    {claimsIntakeAddress}
    <p>Or fax them toll-free: 1-844-531-7818</p>
    <p>
      If you need help completing this form, they can call Veterans Benefits
      Assistance at 1-800-827-1000.
    </p>
  </div>
);
