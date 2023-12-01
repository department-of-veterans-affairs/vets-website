import React from 'react';
import { CONTACTS } from '@department-of-veterans-affairs/component-library/contacts';

const GetFormHelp = () => (
  <div className="help-footer-box">
    <h2 className="help-heading" style={{ margin: 0 }}>
      Need help?
    </h2>
    <p className="help-talk">
      If you have questions about selecting an accredited representative, please
      call our MYVA411 main information line at:{' '}
      <va-telephone contact={CONTACTS.VA_411} /> select 0. We’re here 24/7. If
      you have hearing loss, call <va-telephone contact={CONTACTS['711']} tty />
      .
    </p>
  </div>
);

export default GetFormHelp;
