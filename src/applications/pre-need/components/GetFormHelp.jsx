import React from 'react';
import CallNCACenter from 'platform/static-data/CallNCACenter';
import CallVBACenter from 'platform/static-data/CallVBACenter';

export default function GetFormHelp() {
  return (
    <div>
      <p className="help-talk">
        For questions about eligibility for burial in a VA national cemetery,
        please <CallNCACenter />
        <br />7 days a week, 8:00 a.m. - 7:30 p.m. ET. To speak to someone in
        Eligibility, select option 3.
      </p>
      <p className="help-talk">
        For other benefit-related questions, please <CallVBACenter />
      </p>
    </div>
  );
}
