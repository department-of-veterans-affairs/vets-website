import React from 'react';
import Telephone, {
  CONTACTS,
} from '@department-of-veterans-affairs/formation-react/Telephone';

function GetFormHelp() {
  return (
    <div>
      <p className="help-talk">
        If you have questions or need help filling out this form, please call
        the VA Help Line at <Telephone contact={CONTACTS['222_VETS']} />. We’re
        here Monday through Friday, 8:00 a.m. to 8:00 p.m. ET.
      </p>
      <p>
        If you have hearing loss, call TTY:{' '}
        <Telephone contact={CONTACTS.HELP_TTY} />
      </p>
    </div>
  );
}

export default GetFormHelp;
