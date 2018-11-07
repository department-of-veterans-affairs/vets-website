import React from 'react';
import CallNCACenter from '../../../platform/brand-consolidation/components/CallNCACenter';

export default function GetFormHelp() {
  return (
    <div>
      <p className="help-talk">
        For questions about eligibility for burial in a VA national cemetery,
        please <CallNCACenter />
        <br />7 days a week, 8:00 a.m. - 7:30 p.m. (ET)
        <br />
        Select option 3 to speak to someone in Eligibility
      </p>

      <p className="help-talk">
        For other benefit-related questions, please call VA Benefits and
        Services:
      </p>
      <p className="help-phone-number">
        <a className="help-phone-number-link" href="tel:+1-800-827-1000">
          1-800-827-1000
        </a>
        <br />
        Monday - Friday, 8:00 a.m. - 9:00 p.m. (ET)
        <br />
        For Telecommunications Relay Service (TRS): dial{' '}
        <a className="help-phone-number-link" href="tel:711">
          711
        </a>
      </p>
    </div>
  );
}
