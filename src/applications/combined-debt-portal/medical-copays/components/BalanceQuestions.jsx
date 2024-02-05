import React from 'react';
import { CONTACTS } from '@department-of-veterans-affairs/component-library/contacts';

const BalanceQuestions = () => (
  <article className="vads-u-padding--0" data-testid="balance-questions">
    <h2 id="balance-questions">
      What to do if you have questions about your balance
    </h2>
    <p>
      Contact the VA Health Resource Center at{' '}
      <va-telephone contact="8664001238" uswds /> (
      <va-telephone tty contact={CONTACTS[711]} uswds />
      ). We’re here Monday through Friday, 8:00 a.m. to 8:00 p.m. ET.
    </p>
  </article>
);

export default BalanceQuestions;
