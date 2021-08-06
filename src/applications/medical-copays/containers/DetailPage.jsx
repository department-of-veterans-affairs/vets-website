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
      <h1 className="vads-u-margin-bottom--1">
        Your $300.00 bill for James A. Haley Veterans' Hospital
      </h1>
      <p className="vads-u-font-size--h3 vads-u-margin-top--0 vads-u-margin-bottom--5">
        Updated on June 3, 2021
      </p>
      <va-alert background-only status="info">
        <h3 className="vads-u-margin-y--0">
          Pay your $300.00 balance or request help before July 2, 2021
        </h3>
        <p>
          To avoid late fees or collection action on your bill, you must pay
          your full balance or request financial help before July 2, 2021.
        </p>
        <p>
          <a className="vads-c-action-link--blue" href="#">
            Pay full balance
          </a>
        </p>
        <p>
          <a className="vads-c-action-link--blue" href="#">
            Request help with your bill
          </a>
        </p>
      </va-alert>
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
