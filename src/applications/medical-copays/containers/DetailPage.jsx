import React from 'react';
import Telephone from '@department-of-veterans-affairs/component-library/Telephone';
import Breadcrumbs from '@department-of-veterans-affairs/component-library/Breadcrumbs';
import BalanceQuestions from '../components/BalanceQuestions';
import HowToPay from '../components/HowToPay';

const DetailPage = () => {
  return (
    <>
      <Breadcrumbs className="vads-u-font-family--sans">
        <a href="/">Home</a>
        <a href="/health-care">Health care</a>
        <a href="/health-care/pay-copay-bill">Pay your VA copay bill</a>
        <a href="/health-care/pay-copay-bill/your-current-balances">
          Your current copay balances
        </a>
        <a href="/health-care/pay-copay-bill/your-current-balances/balance-details">
          Your copay details
        </a>
      </Breadcrumbs>
      <h1>Your copay details</h1>
      <HowToPay />
      <BalanceQuestions />
      <p>
        <strong>For questions about your treatment or your charges, </strong>
        contact the James A. Haley Veterans’ Hospital at
        <Telephone contact={'813-972-2000'} className="vads-u-margin-x--0p5" />.
      </p>
    </>
  );
};

export default DetailPage;
