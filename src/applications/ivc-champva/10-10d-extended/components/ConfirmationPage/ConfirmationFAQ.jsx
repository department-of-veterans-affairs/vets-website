import React from 'react';
import { CHAMPVA_PHONE_NUMBER } from '../../../shared/constants';
import { CONTACTS } from '../../utils/imports';

const ConfirmationFAQ = () => (
  <>
    <section className="confirmation-faq">
      <h2>What to expect next</h2>
      <p>It takes about 14 days to process your application.</p>
      <p>
        If we have any questions or need additional information, we’ll contact
        you.
      </p>
    </section>

    <section className="confirmation-faq">
      <h2>How to contact us about your application</h2>
      <p>
        If you have any questions about your application, call us at{' '}
        <va-telephone contact={CHAMPVA_PHONE_NUMBER} /> (
        <va-telephone contact={CONTACTS['711']} tty />
        ). We’re here Monday through Friday, 8:05 a.m. to 7:30 p.m. ET.
      </p>

      <p>You can also contact us online through our Ask VA tool.</p>
    </section>
  </>
);

export default ConfirmationFAQ;
