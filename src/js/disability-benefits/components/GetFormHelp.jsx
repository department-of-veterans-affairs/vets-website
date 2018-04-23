import React from 'react';

function GetFormHelp() {
  return (
    <div>
      <p className="help-talk">
          For help filling out this form please call:</p>
      <p className="help-phone-number">
        <a className="help-phone-number-link" href="tel:+1-877-222-8387">1-877-222-VETS (<a className="help-phone-number-link" href="tel:+1-877-222-8387">1-877-222-8387</a>)</a><br/>
            Monday &#8211; Friday, 8:00 a.m. &#8211; 8:00 p.m. (ET)
      </p>
    </div>
  );
}

export default GetFormHelp;
