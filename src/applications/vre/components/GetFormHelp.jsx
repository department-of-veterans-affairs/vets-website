import React from 'react';
import { CONTACTS } from '@department-of-veterans-affairs/component-library/contacts';

const GetFormHelp = () => (
  <p className="help-talk">
    If you have trouble using this online form, call our MyVA411 main
    information line at <va-telephone contact="8006982411" />. If you have
    hearing loss, call <va-telephone contact={CONTACTS['711']} tty />.
  </p>
);

export default GetFormHelp;
