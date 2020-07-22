import React from 'react';
import CallHRC from 'platform/static-data/CallHRC';

function GetFormHelp() {
  return (
    <div>
      <p className="help-talk">
        For help filling out this form, or if the form isn't working right,
        please call VA Benefits and Services at{' '}
        <a href="tel:800-827-1000" aria-label="8 0 0. 8 2 7. 1 0 0 0.">
          800-827-1000
        </a>
        . If you have hearing loss, call{' '}
        <a href="tel:711" aria-label="TTY. 7 1 1.">
          TTY: 711
        </a>
      </p>
    </div>
  );
}

export default GetFormHelp;
