import React from 'react';

import Telephone, {
  CONTACTS,
} from '@department-of-veterans-affairs/formation-react/Telephone';

import { VA_FORM4192_URL } from '../constants';
import { claimsIntakeAddress } from './itfWrapper';

export const download4192Notice = (
  <div>
    <p>
      <a href={VA_FORM4192_URL} target="_blank" rel="noopener noreferrer">
        Download VA Form 21-4192
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
    <p>Or fax them toll-free: 844-531-7818</p>
    <p>
      If they need help completing this form, they can call Veterans Benefits
      Assistance at <Telephone contact={CONTACTS.VA_BENEFITS} />.
    </p>
  </div>
);
