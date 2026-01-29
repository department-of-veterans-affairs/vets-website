import React from 'react';
import PropTypes from 'prop-types';

import {
  BTSSS_PORTAL_URL,
  FORM_103542_LINK,
  FIND_FACILITY_TP_CONTACT_LINK,
} from '../constants';

export const HelpTextManage = () => {
  return (
    <div>
      <p>
        To manage your travel claims or file a new claim, go to our{' '}
        <va-link
          external
          href={BTSSS_PORTAL_URL}
          text="Beneficiary Travel Self Service System (BTSSS) portal"
        />
        .
      </p>
      <p className="vads-u-margin-top--2">
        Or call the BTSSS call center at <va-telephone contact="8555747292" /> (
        <va-telephone tty contact="711" />) Monday through Friday, 8:00 a.m. to
        8:00 p.m. ET. Have your claim number ready to share when you call.
      </p>
    </div>
  );
};

export const HelpTextGeneral = () => {
  return (
    <div>
      <p>
        Call the BTSSS call center at <va-telephone contact="8555747292" /> (
        <va-telephone tty contact="711" />
        ). We’re here Monday through Friday, 8:00 a.m. to 8:00 p.m. ET.
      </p>
      <p className="vads-u-margin-top--2">
        Or call your VA health facility’s Beneficiary Travel contact.
      </p>
      <va-link
        href={FIND_FACILITY_TP_CONTACT_LINK}
        text="Find the travel contact for your facility"
      />
    </div>
  );
};

export const HelpTextModalities = () => {
  return (
    <div>
      <p>You can still file a claim for this appointment these other ways:</p>
      <ul>
        <li>
          <p className="vads-u-margin-y--2">
            Online 24/7 through the Beneficiary Travel Self Service System
            (BTSSS)
          </p>
          <va-link
            external
            href={BTSSS_PORTAL_URL}
            text="File a travel claim online"
          />
        </li>
        <li>
          <p className="vads-u-margin-y--2">
            By mail, fax, email, or in person with the VA Form 10-3542
          </p>
          <va-link
            href={FORM_103542_LINK}
            text="Learn more about VA Form 10-3542"
          />
        </li>
      </ul>
    </div>
  );
};

export const HelpTextOptions = ({ trigger, headline, dataTestId }) => (
  <va-additional-info
    class="vads-u-margin-y--3"
    trigger={trigger}
    data-testid={dataTestId}
  >
    <p>
      <strong>{headline}</strong> But you can file your claim online through the
      <va-link
        external
        href={BTSSS_PORTAL_URL}
        text="Beneficiary Travel Self Service System (BTSSS)"
      />
      .
    </p>
    <br />
    <p>
      Or you can use VA Form 10-3542 to submit a claim by mail or in person.
    </p>
    <br />
    <va-link href={FORM_103542_LINK} text="Learn more about VA Form 10-3542" />
  </va-additional-info>
);

HelpTextOptions.propTypes = {
  dataTestId: PropTypes.string,
  headline: PropTypes.string,
  trigger: PropTypes.string,
};

export const ComplexClaimsHelpSection = ({ className }) => {
  return (
    <div
      className={`complex-claim-help-section ${className ||
        'vads-u-margin--2'}`}
    >
      <h2 className="complex-claim-help-heading">Need help?</h2>
      <p className="vads-u-margin-top--0">
        You can call the Beneficiary Travel Self Service System (BTSSS) call
        center at <va-telephone contact="8555747292" /> (
        <va-telephone tty contact="711" />
        ). We’re here Monday through Friday, 8:00 a.m. to 8:00 p.m. ET. Have
        your claim number ready to share when you call.
      </p>
      <p>Or call your VA health facility’s Beneficiary Travel contact.</p>
      <va-link
        href={FIND_FACILITY_TP_CONTACT_LINK}
        text="Find the travel contact for your facility"
      />
    </div>
  );
};

ComplexClaimsHelpSection.propTypes = {
  className: PropTypes.string,
};
