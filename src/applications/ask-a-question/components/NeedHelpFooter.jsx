import React from 'react';
import { CONTACTS } from '@department-of-veterans-affairs/component-library/contacts';

const NeedHelpFooter = () => {
  return (
    <footer>
      <p>Having trouble with the form? Call our toll-free number:</p>
      <p>
        <va-telephone contact={CONTACTS['222_VETS']} />
        <br />
        <va-telephone
          className="vads-u-margin-left--0p5"
          contact={CONTACTS.HELP_TTY}
          tty
        />
        <br />
        Monday - Friday, 8:00 a.m. - 8:00 p.m. ET
      </p>
    </footer>
  );
};

export default NeedHelpFooter;
