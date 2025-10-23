import React from 'react';
import { CONTACTS } from '@department-of-veterans-affairs/component-library/contacts';

export default function CallNCACenter({ startSentence }) {
  return (
    <span>
      {startSentence ? 'Call' : 'call'} the National Cemetery Scheduling Office
      at <va-telephone contact={CONTACTS.NCA} />.<br /> If you have hearing
      loss, call <va-telephone contact={CONTACTS['711']} tty />.
    </span>
  );
}
