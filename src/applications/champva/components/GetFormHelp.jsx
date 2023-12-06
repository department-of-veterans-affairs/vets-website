import React from 'react';
import { CONTACTS } from '@department-of-veterans-affairs/component-library/contacts';
import { VaTelephone } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import { VaButton } from '@department-of-veterans-affairs/web-components/react-bindings';

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
      <br />
      <hr className="help-heading vads-u-border-color--gray-lightest" />
      {/* TODO: Just use a link without button? */}
      <div className="vads-u-display--flex vads-u-justify-content--flex-end vads-u-flex-direction--row vads-u-width--full vads-u-text-decoration--none">
        <VaButton onClick={() => {}} text="Feedback" />
      </div>
    </div>
  );
}

export default GetFormHelp;
