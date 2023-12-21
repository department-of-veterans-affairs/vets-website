import { CONTACTS } from '@department-of-veterans-affairs/component-library/contacts';
import React from 'react';

const NeedHelp = () => {
  return (
    <div>
      <h2 className="vads-u-margin-top--4 vads-u-padding-bottom--1p5 vads-u-border-bottom--3px vads-u-border-color--primary">
        Need help?
      </h2>
      <p className="vads-u-padding-bottom--3">
        You can call us at <va-telephone contact={CONTACTS['222_VETS']} /> (TTY:
        <span className="vads-u-padding-left--0p5">
          <va-telephone contact={CONTACTS.HELP_TTY} />
        </span>
        ). We’re here Monday through Friday, 8:00 a.m to 9:00 p.m. ET.
      </p>
    </div>
  );
};

export default NeedHelp;
