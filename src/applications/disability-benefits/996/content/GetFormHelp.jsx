import React from 'react';
import Telephone, {
  CONTACTS,
} from '@department-of-veterans-affairs/component-library/Telephone';

const GetFormHelp = () => (
  <>
    <p className="help-talk">
      If you have questions or need help filling out this form, please call our{' '}
      <span aria-label="My. VA. 4 1 1.">MYVA411</span> main information line at{' '}
      <Telephone contact={CONTACTS.HELP_DESK} /> and select 0. We’re here{' '}
      <abbr title="24 hours a day, 7 days a week">24/7</abbr>.
    </p>
    <p className="u-vads-margin-bottom--0">
      If you have hearing loss, call TTY:{' '}
      <Telephone
        contact={CONTACTS['711']}
        pattern={'###'}
        ariaLabel={'7 1 1.'}
      />
      .
    </p>
  </>
);

export default GetFormHelp;
