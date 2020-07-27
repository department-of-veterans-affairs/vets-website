import React from 'react';
import Telephone, {
  CONTACTS,
} from '@department-of-veterans-affairs/formation-react/Telephone';

export default function CallNCACenter({ startSentence }) {
  return (
    <span>
      {startSentence ? 'Call' : 'call'} the National Cemetery Scheduling Office
      at <a href="tel:18005351117">800-535-1117</a>.<br /> If you have hearing
      loss, call <Telephone contact={CONTACTS['711']} />.
    </span>
  );
}
