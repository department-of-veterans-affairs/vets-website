import React from 'react';
import Telephone, {
  CONTACTS,
  PATTERNS,
} from '@department-of-veterans-affairs/component-library/Telephone';

function GetFormHelp() {
  return (
    <div>
      <p className="help-talk">
        Call us at <Telephone contact={CONTACTS.VA_BENEFITS} />. We’re here
        Monday through Friday, 8:00 a.m to 9:00 p.m ET. If you have hearing
        loss, call TTY:{' '}
        <Telephone contact={CONTACTS[711]} pattern={PATTERNS[911]} />.
      </p>
    </div>
  );
}

export default GetFormHelp;
