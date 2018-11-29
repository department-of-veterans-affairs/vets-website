import React from 'react';
import CallVBACenter from '../../../platform/brand-consolidation/components/CallVBACenter';

function GetFormHelp() {
  return (
    <div>
      <p className="help-talk">For help filling out this form, please call:</p>
      <p className="help-phone-number">
        <a className="help-phone-number-link" href="tel:+1-877-222-8387">
          1-877-222-VETS
        </a>{' '}
        (
        <a className="help-phone-number-link" href="tel:+1-877-222-8387">
          1-877-222-8387
        </a>
        )<br />
        Monday &#8211; Friday, 8:00 a.m. &#8211; 8:00 p.m. (ET)
      </p>
      <p className="help-talk">
        If this form isn't working right for you, please <CallVBACenter />
      </p>
    </div>
  );
}

export default GetFormHelp;
