import React from 'react';
import Telephone from '@department-of-veterans-affairs/component-library/Telephone';

export default function GetHelpFooter(props) {
  const { currentLocation } = props;

  if (currentLocation?.pathname.replace(/\/$/, '').endsWith('confirmation')) {
    return null;
  }
  const HELP_NUMBER = '800-698-2411';
  const TTY_NUMBER = '711';
  return (
    <div className="row questionnaire-help-footer">
      <div className="usa-width-two-thirds medium-8 columns">
        <h2 className="help-heading">Need help?</h2>
        <p>
          If you have questions or need help filling out this form, please call
          our MyVA411 main information line at{' '}
          <Telephone contact={HELP_NUMBER} />. and select 0. We're here 24/7.
        </p>
        <p>
          If you have hearing loss, call{' '}
          <Telephone contact={TTY_NUMBER}>TTY: {TTY_NUMBER}</Telephone>
        </p>
      </div>
    </div>
  );
}
