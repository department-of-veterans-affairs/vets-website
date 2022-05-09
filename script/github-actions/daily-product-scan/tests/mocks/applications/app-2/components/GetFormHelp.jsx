import React from 'react';
import Telephone, {
  CONTACTS,
  PATTERNS,
} from '@department-of-veterans-affairs/component-library/Telephone';

const GetFormHelp = () => (
  <p className="help-talk">
    If you have trouble using this online form, call our MyVA411 main
    information line at <Telephone contact="800-698-2411" />. If you have
    hearing loss, call TTY:{' '}
    <Telephone contact={CONTACTS['711']} pattern={PATTERNS['3_DIGIT']} />.
  </p>
);

export default GetFormHelp;
