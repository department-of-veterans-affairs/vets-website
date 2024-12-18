import React, { useEffect } from 'react';

import scrollToTop from 'platform/utilities/ui/scrollToTop';
import { focusElement } from 'platform/utilities/ui';
import {
  BTSSS_PORTAL_URL,
  FIND_FACILITY_TP_CONTACT_LINK,
  FORM_103542_LINK,
} from '../../../constants';

const CantFilePage = ({ pageIndex, setPageIndex, setCantFile }) => {
  useEffect(() => {
    focusElement('h2');
    scrollToTop('topScrollElement');
  }, []);

  const onBack = e => {
    e.preventDefault();
    setCantFile(false);
    setPageIndex(pageIndex);
  };

  return (
    <div className="vads-u-margin--3">
      <h1 tabIndex="-1">
        We can’t file this type of travel reimbursement claim
      </h1>
      <p>
        You can still file a claim within 30 days of this appointment these
        other ways:
        <ul>
          <li>
            <p>
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
            <p>VA Form 10-3542 by mail, fax, email, or in person</p>
            <va-link
              href={FORM_103542_LINK}
              text="Learn more about VA Form 10-3542"
            />
          </li>
        </ul>
      </p>
      <h2 className="vads-u-font-size--h4">
        How can I get help with my claim?
      </h2>
      <p>
        Call the BTSSS call center at <va-telephone contact="8555747292" />.
        We’re here Monday through Friday, 8:00 a.m. to 8:00 p.m. ET.
      </p>
      <p>Or call your VA health facility’s Beneficiary Travel contact.</p>
      <va-link
        href={FIND_FACILITY_TP_CONTACT_LINK}
        text="Find the travel contact for your facility"
      />
      <br />
      <va-button
        className="vads-u-margin-top--3"
        text="Back"
        onClick={e => onBack(e)}
      />
    </div>
  );
};

export default CantFilePage;
