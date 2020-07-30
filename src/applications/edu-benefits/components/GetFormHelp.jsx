import React from 'react';
import CallHRC from 'platform/static-data/CallHRC';

function GetFormHelp() {
  return (
    <div>
      <p className="help-talk">
        Call us at{' '}
        <a href="tel:800-827-1000" aria-label="8 0 0. 8 2 7. 1 0 0 0.">
          800-827-1000
        </a>
        . We’re here Monday through Friday, 8:00 am to 9:00 pm ET. If you have
        hearing loss, call{' '}
        <a href="tel:711" aria-label="TTY. 7 1 1.">
          TTY: 711
        </a>
      </p>
    </div>
  );
}

export default GetFormHelp;
