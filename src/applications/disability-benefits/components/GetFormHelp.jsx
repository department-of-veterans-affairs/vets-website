import React from 'react';
import CallVBACenter from 'platform/static-data/CallVBACenter';

function GetFormHelp() {
  return (
    <div>
      <p className="help-talk">
        For help filling out this form, or if the form isn’t working right,
        please <CallVBACenter />
      </p>
    </div>
  );
}

export default GetFormHelp;
