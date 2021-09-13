import React from 'react';
import Telephone, {
  CONTACTS,
  PATTERNS,
} from '@department-of-veterans-affairs/component-library/Telephone';

function GetFormHelp() {
  return (
    <>
      <p className="help-talk">
        Need help with your application or have questions about enrollment or
        eligibility?
        <br />
        Call our Education Call Center, toll-free:{' '}
        <a href="tel:">1-888-GIBILL-1 (1-888-442-4551)</a>
        <br />
        Outside the U.S.: <a href="tel:001-918-781-5678">001-918-781-5678</a>
        <br />
        If you have hearing loss, call TTY:
        <Telephone
          contact={CONTACTS[711]}
          pattern={PATTERNS['3_DIGIT']}
          className="vads-u-margin-left--0p5"
        />
        <br />
        Monday to Friday, 8:00 a.m. to 7:00 p.m. ET
      </p>
    </>
  );
}

export default GetFormHelp;
