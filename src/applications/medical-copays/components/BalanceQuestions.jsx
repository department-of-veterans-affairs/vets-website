import React from 'react';
import Telephone, {
  CONTACTS,
  PATTERNS,
} from '@department-of-veterans-affairs/component-library/Telephone';

const BalanceQuestions = () => {
  return (
    <>
      <h2>What if I have questions about my balance?</h2>
      <p>
        <strong className="vads-u-margin-x--0p5">
          For questions about your payment or relief options,
        </strong>
        contact the VA Health Resource Center at
        <Telephone contact={'866-400-1238'} className="vads-u-margin-x--0p5" />
        (TTY:
        <Telephone
          contact={CONTACTS[711]}
          pattern={PATTERNS['3_DIGIT']}
          className="vads-u-margin-left--0p5"
        />
        ). We’re here Monday through Friday, 8:00 a.m. to 8:00 p.m. ET.
      </p>
      <p>
        <strong>For questions about your treatment or your charges, </strong>
        contact the James A. Haley Veterans’ Hospital at
        <Telephone contact={'813-972-2000'} className="vads-u-margin-x--0p5" />.
      </p>
    </>
  );
};

export default BalanceQuestions;
