import React from 'react';
import Telephone, {
  CONTACTS,
  PATTERNS,
} from '@department-of-veterans-affairs/component-library/Telephone';

const GetFormHelp = () => (
  <p className="help-talk">
    If you have questions about selecting a representative, please call our
    MYVA411 main information line at: <Telephone contact={'800-698-2411'} /> and
    select 0. We’re here 24/7. If you have hearing loss, call TTY:{' '}
    <Telephone contact={CONTACTS['711']} pattern={PATTERNS['3_DIGIT']} />.
  </p>
);

export default GetFormHelp;
