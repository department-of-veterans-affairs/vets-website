import React, { useState, useEffect } from 'react';
import Breadcrumbs from '@department-of-veterans-affairs/component-library/Breadcrumbs';
import FacilityContacts from '../components/FacilityContacts';
import Balances from '../components/Balances';
import BalanceQuestions from '../components/BalanceQuestions';
import scrollToTop from 'platform/utilities/ui/scrollToTop';
import Alerts from '../components/Alerts';

const AlertView = ({ type }) => {
  switch (type) {
    case 1:
      return <Alerts.Error />;
    case 2:
      return <Alerts.NoHealthcare />;
    case 3:
      return <Alerts.NoHistory />;
    case 4:
      return <Alerts.Deceased />;
    default:
      return <Alerts.Error />;
  }
};

const OverviewPage = () => {
  const [alertType, setAlertType] = useState(0);

  useEffect(() => {
    scrollToTop();
    setAlertType(0);
  }, []);

  return (
    <>
      <Breadcrumbs className="vads-u-font-family--sans">
        <a href="/">Home</a>
        <a href="/health-care">Health care</a>
        <a href="/health-care/pay-copay-bill">Pay your VA copay bill</a>
        <a href="/health-care/pay-copay-bill/your-current-balances">
          Your current copay balances
        </a>
      </Breadcrumbs>
      <h1>Your current copay balances</h1>
      {alertType ? (
        <AlertView type={alertType} />
      ) : (
        <>
          <p className="vads-u-font-size--lg">
            Check your VA health care and prescription charges from each of your
            facilities. Find out how to make payments or request financial help.
          </p>
          <Balances />
          <BalanceQuestions
            contact={
              <span>
                contact the VA health care facility listed on your bill.
              </span>
            }
          />
          <FacilityContacts />
        </>
      )}
    </>
  );
};

export default OverviewPage;
