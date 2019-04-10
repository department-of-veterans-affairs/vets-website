import React from 'react';
import CallVBACenter from '../../static-data/CallVBACenter';

function GetFormHelp() {
  return (
    <div>
      <p className="help-talk">
        For benefit related questions, or if the form isn’t working right,
        <br />
        please <CallVBACenter />
      </p>
    </div>
  );
}

export default GetFormHelp;
