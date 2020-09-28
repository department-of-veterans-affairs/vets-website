import React from 'react';
import Telephone, {
  CONTACTS,
} from '@department-of-veterans-affairs/formation-react/Telephone';

export default function GetHelpFooter() {
  return (
    <div className="row questionnaire-help-footer">
      <div className="usa-width-two-thirds medium-8 columns">
        <h2 className="help-heading">Need help?</h2>
        <p>
          For help filling out this form, you can contact your local
          coordinator, or call our main VA information line at{' '}
          <Telephone contact={CONTACTS.CAREGIVER} />.
        </p>
        <p>
          To report a problem with this form, please call the VA.gov Technical
          Help Desk at <Telephone contact={CONTACTS.HELP_DESK} />.
        </p>
        <p>
          <Telephone contact={CONTACTS.FEDERAL_RELAY_SERVICE}>
            TTY: 800-877-8339
          </Telephone>
        </p>
        <p>Monday — Friday, 8:00am — 7:00pm (ET)</p>
      </div>
    </div>
  );
}
