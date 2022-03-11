import React from 'react';
import Telephone from '@department-of-veterans-affairs/component-library/Telephone';

export const MoreQuestions = () => (
  <>
    <h2>What if I have more questions?</h2>
    <p>
      If you have any questions that your lender can’t answer, please call your
      VA regional loan center at <Telephone contact="877-827-3702" />. We’re
      here Monday through Friday, 8:00 a.m. to 6:00 p.m. ET.
      <br />
      <a
        target="_blank"
        rel="noopener noreferrer"
        href="https://www.benefits.va.gov/HOMELOANS/contact_rlc_info.asp"
      >
        Find your regional loan center
      </a>
    </p>
  </>
);
