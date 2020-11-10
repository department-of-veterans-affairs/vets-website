import React from 'react';
import Telephone from '@department-of-veterans-affairs/formation-react/Telephone';

export default function GetHelpFooter() {
  const HELP_NUMBER = '844-698-2311';
  const TTY_NUMBER = '711';
  return (
    <div className="row questionnaire-help-footer">
      <div className="usa-width-two-thirds medium-8 columns">
        <h2 className="help-heading">Need help?</h2>
        <p>
          For help filling out this form, or if the form isn’t working right,
          please call the VA.gov Technical Help Desk at{' '}
          <Telephone contact={HELP_NUMBER} />.
        </p>
        <p>
          <Telephone contact={TTY_NUMBER}>TTY: {TTY_NUMBER}</Telephone>
        </p>
      </div>
    </div>
  );
}
