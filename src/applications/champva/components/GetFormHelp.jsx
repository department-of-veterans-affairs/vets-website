import React from 'react';
import { CONTACTS } from '@department-of-veterans-affairs/component-library/contacts';
import { VaTelephone } from '@department-of-veterans-affairs/component-library/dist/react-bindings';

function GetFormHelp() {
  return (
    <div>
      <p className="help-talk">
        For help filling out this form, or if the form isn't working right,
        please call VA Benefits and Services at&nbsp;
        <VaTelephone contact={CONTACTS.VA_BENEFITS} />.<br />
        <br />
        If you have hearing loss, call TTY:&nbsp;
        <VaTelephone contact={CONTACTS['711']} />.
      </p>
    </div>
  );
}

export default GetFormHelp;
