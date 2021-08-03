import React from 'react';
import FacilityContacts from '../components/FacilityContacts';
import StatusAlert from '../components/StatusAlert';
import Balances from '../components/Balances';
import BalanceQuestions from '../components/BalanceQuestions';
import Telephone from '@department-of-veterans-affairs/component-library/Telephone';
import { currency } from '../utils/helpers';

const OverviewPage = () => {
  const amount = currency(130);

  return (
    <>
      <h1>Your current copay balances</h1>
      <p className="vads-u-font-size--lg">
        Check your VA health care copay balances. Find out how to make payments
        or request financial help.
      </p>
      <StatusAlert
        status="warning"
        iconType="triangle"
        trackingPrefix="mcp"
        label={`Sent for collection: ${amount} of your overdue charges`}
        content={() => (
          <p>
            You have {amount} in unpaid charges that’s 120 days or more overdue.
            The U.S. Department of the Treasury has sent these charges for
            collection. To resolve this debt, you’ll need to call
            <Telephone
              className="vads-u-margin-x--0p5"
              contact={'800-304-3107'}
            />
          </p>
        )}
      />
      <Balances />
      <BalanceQuestions />
      <p>
        <strong>For questions about your treatment or your charges, </strong>
        contact the VA health care facility listed on your bill.
      </p>
      <FacilityContacts />
    </>
  );
};

export default OverviewPage;
