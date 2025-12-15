import React from 'react';
import {
  CHAMPVA_CLAIMS_ADDRESS,
  CHAMPVA_PHONE_NUMBER,
  IVC_APPEALS_ADDRESS,
} from '../../../shared/constants';
import { CONTACTS } from '../../utils/imports';

const ConfirmationFAQ = () => (
  <>
    <section className="confirmation-faq">
      <h2>What to expect next</h2>
      <p>It takes about 90 days to process your claim.</p>
      <p>
        If we have any questions or need additional information, we’ll contact
        you.
      </p>

      <h3>If we decide we can cover this claim under CHAMPVA</h3>
      <p>
        We’ll send you an explanation of benefits. This document explains
        details about the amount we’ll cover.
      </p>

      <h3>If we decide we can’t cover this claim under CHAMPVA</h3>
      <p>If you disagree with our decision, you can request an appeal.</p>
      <p>Mail a letter requesting an appeal to this address:</p>

      {IVC_APPEALS_ADDRESS}
    </section>

    <section className="confirmation-faq">
      <h2>How to contact us about CHAMPVA claims</h2>
      <p>
        If you have any questions about your claim, call us at{' '}
        <va-telephone contact={CHAMPVA_PHONE_NUMBER} /> (
        <va-telephone contact={CONTACTS['711']} tty />
        ). We’re here Monday through Friday, 8:05 a.m. to 7:30 p.m. ET.
      </p>
      <p>
        Or you can send us a letter with questions about your claim to this
        address:
      </p>

      {CHAMPVA_CLAIMS_ADDRESS}

      <p>You can also contact us online through Ask VA.</p>
    </section>
  </>
);

export default ConfirmationFAQ;
