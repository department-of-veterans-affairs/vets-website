import React from 'react';
import {
  MailDescription,
  InPersonDescription,
  ConfirmationDescription,
} from './Descriptions';
import {
  MAILING_ADDRESS,
  CONTACT_INFO,
  LINKS,
  ANCHOR_LINKS,
} from '../../constants';

const OtherWaysToSendYourDocuments = () => {
  return (
    <div
      id="other-ways-to-send-documents"
      className="other-ways-to-send-your-documents scroll-anchor"
      data-testid="other-ways-to-send-documents"
    >
      <h2
        id={ANCHOR_LINKS.otherWaysToSendDocuments}
        className="vads-u-margin-top--0 vads-u-margin-bottom--3"
      >
        Other ways to send your documents
      </h2>
      <div>
        <p>
          Print a copy of each document and write your Social Security number on
          the first page. Then resubmit by mail or in person.
        </p>
      </div>
      <div className="other-ways-mail-section">
        <h3>Option 1: By mail</h3>
        <MailDescription address={MAILING_ADDRESS} />
      </div>
      <div className="other-ways-in-person-section">
        <h3>Option 2: In person</h3>
        <InPersonDescription findVaLocations={LINKS.findVaLocations} />
      </div>
      <div className="other-ways-confirmation-section">
        <h3>How to confirm we’ve received your documents</h3>
        <ConfirmationDescription contactInfo={CONTACT_INFO} />
      </div>
    </div>
  );
};

export default OtherWaysToSendYourDocuments;
