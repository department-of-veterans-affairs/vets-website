import React from 'react';
import PropTypes from 'prop-types';

import { CONTACTS } from '@department-of-veterans-affairs/component-library/contacts';
import HelpDeskContact from '../../HelpDeskContact';

const CustomMessaging = () => (
  <va-alert
    close-btn-aria-label="Close notification"
    status="warning"
    visible
    uswds
  >
    <h2 slot="headline">
      You can’t manage your direct deposit information online right now
    </h2>

    <p>
      We’re updating our systems for online direct deposit management. You can
      still manage your information by phone.
    </p>
    <p>
      <strong>
        For disability compensation, pension, or education benefits,
      </strong>{' '}
      call us at <HelpDeskContact />. We’re here Monday through Friday, 8:00
      a.m. to 9:00 p.m. ET.
    </p>
    <p className="vads-u-margin-bottom--0">
      <strong>For Post-9/11 GI Bill benefits,</strong>, call us at{' '}
      <va-telephone contact={CONTACTS.GI_BILL} /> (
      <va-telephone contact={CONTACTS['711']} tty />
      ). We’re here Monday through Friday, 8:00 a.m. to 7:00 p.m. ET.
    </p>
  </va-alert>
);

export const TemporaryOutage = ({ customMessaging = false }) => (
  <div className="vads-u-margin-bottom--2 medium-screen:vads-u-margin-bottom--4">
    {customMessaging ? (
      <CustomMessaging />
    ) : (
      <va-alert
        close-btn-aria-label="Close notification"
        status="warning"
        visible
        uswds
      >
        <h2 slot="headline">
          Direct deposit information isn’t available right now
        </h2>

        <p>
          We’re sorry. Direct deposit information isn’t available right now.
          We’re doing some maintenance work on this system.
        </p>
        <p className="vads-u-margin-bottom--0">
          Refresh this page or try again later.
        </p>
      </va-alert>
    )}
  </div>
);

TemporaryOutage.propTypes = {
  customMessaging: PropTypes.bool,
};
