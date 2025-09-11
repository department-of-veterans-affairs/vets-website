import React from 'react';
import { CONTACTS } from '@department-of-veterans-affairs/component-library/contacts';

const MedsByMailContent = () => (
  <>
    <h2
      className="vads-u-margin-top--3 medium-screen:vads-u-font-size--h3"
      data-testid="meds-by-mail-header"
    >
      If you use Meds by Mail
    </h2>
    <p data-testid="meds-by-mail-top-level-text">
      We may not have your allergy records in our My HealtheVet tools. But the
      Meds by Mail servicing center keeps a record of your allergies and
      reactions to medications.
    </p>
    <div className="vads-u-margin-bottom--4">
      <va-additional-info
        data-testId="meds-by-mail-additional-info"
        trigger="How to update your allergies and reactions if you use Meds by Mail"
      >
        <p>
          If you have a new allergy or reaction, tell your provider. Or you can
          call us at{' '}
          <va-telephone
            className="help-phone-number-link"
            contact="8662297389"
          />{' '}
          or{' '}
          <va-telephone
            className="help-phone-number-link"
            contact="8883850235"
          />{' '}
          (<va-telephone contact={CONTACTS[711]} tty />) and ask us to update
          your records. We’re here Monday through Friday, 8:00 a.m. to 7:30 p.m.
          ET.
        </p>
      </va-additional-info>
    </div>
  </>
);

export default MedsByMailContent;
