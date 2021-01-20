import React from 'react';
import Telephone, {
  CONTACTS,
} from '@department-of-veterans-affairs/component-library/Telephone';

const NeedHelpFooter = () => {
  return (
    <footer>
      <p>Having trouble with the form? Call our toll-free number:</p>
      <p>
        <Telephone contact={CONTACTS['222_VETS']} />
        <br />
        TTY:
        <Telephone
          contact={CONTACTS.HELP_TTY}
          className="vads-u-margin-left--0p5"
        />
        <br />
        Monday - Friday, 8:00 a.m. - 8:00 p.m. ET
      </p>
    </footer>
  );
};

export default NeedHelpFooter;
