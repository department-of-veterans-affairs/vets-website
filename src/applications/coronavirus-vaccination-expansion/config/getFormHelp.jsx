import React from 'react';
import Telephone, {
  CONTACTS,
  PATTERNS,
} from '@department-of-veterans-affairs/component-library/Telephone';

const GetFormHelp = () => (
  <p className="help-talk">
    If you have questions or need help filling out this form, call our MyVA411
    main information line at <Telephone contact="800-698-2411" /> (TTY:
    <Telephone contact={CONTACTS['711']} pattern={PATTERNS['911']} />
    ).
  </p>
);

export default GetFormHelp;
