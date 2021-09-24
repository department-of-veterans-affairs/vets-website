import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import Breadcrumbs from '@department-of-veterans-affairs/component-library/Breadcrumbs';
import DownloadStatements from '../components/DownloadStatements';
import BalanceQuestions from '../components/BalanceQuestions';
import DisputeCharges from '../components/DisputeCharges';
import HowToPay from '../components/HowToPay';
import Telephone from '@department-of-veterans-affairs/component-library/Telephone';
import FinancialHelp from '../components/FinancialHelp';
import scrollToTop from 'platform/utilities/ui/scrollToTop';
import { Link, Redirect } from 'react-router-dom';
import Modals from '../components/Modals';
import Alert from '../components/Alerts';
import { currency } from '../utils/helpers';
import moment from 'moment';

const DetailPage = ({ match }) => {
  const selectedId = match.params.id;
  const errors = useSelector(({ mcp }) => mcp.errors);
  const statementData = useSelector(({ mcp }) => mcp.statements);
  const [selectedCopay] = statementData.filter(({ id }) => selectedId === id);
  const [alertType, setAlertType] = useState(null);

  useEffect(
    () => {
      scrollToTop();
      if (errors) {
        setAlertType('error');
      }
    },
    [errors],
  );

  if (!errors && !selectedCopay) {
    return <Redirect to="/" />;
  }

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
        Your copay bill for {selectedCopay?.station.facilitYDesc}
      </h1>
      {alertType ? (
        <Alert type={alertType} />
      ) : (
        <>
          <p className="vads-u-font-size--h3 vads-u-margin-top--0 vads-u-margin-bottom--5">
            Updated on
            <span className="vads-u-margin-x--0p5">
              {moment(selectedCopay?.pSProcessDate, 'MM-DD-YYYY').format(
                'MMMM D, YYYY',
              )}
            </span>
          </p>
          <va-alert background-only status="info">
            <h3 className="vads-u-margin-y--0">
              Pay your {currency(selectedCopay?.pHAmtDue)} balance or request
              help before July 2, 2021
            </h3>
            <p>
              To avoid late fees or collection action on your bill, you must pay
              your full balance or request financial help before July 2, 2021.
            </p>
            <p>
              <a className="vads-c-action-link--blue" href="#">
                Learn how to pay your copay bill
              </a>
            </p>
            <p>
              <a className="vads-c-action-link--blue" href="#">
                Request help with your bill
              </a>
            </p>
            <h4>What if I’ve already requested financial help with my bill?</h4>
            <p>
              You may need to continue making payments while we review your
              request. Call us at
              <Telephone
                contact={'866-400-1238'}
                className="vads-u-margin-x--0p5"
              />
              , Monday through Friday, 8:00 a.m. to 8:00 p.m. ET.
            </p>
          </va-alert>
          <va-on-this-page />
          <DownloadStatements />
          <HowToPay acctNum={selectedCopay.pHCernerAccountNumber} />
          <FinancialHelp />
          <DisputeCharges />
          <BalanceQuestions
            contact={
              <span>
                contact the James A. Haley Veterans’ Hospital at
                <Telephone
                  contact={'813-972-2000'}
                  className="vads-u-margin-x--0p5"
                />
                .
              </span>
            }
          />
          <Modals title="Notice of rights and responsibilities">
            <Modals.Rights />
          </Modals>
          <Link className="vads-u-font-size--sm" to="/">
            <i
              className="fa fa-chevron-left vads-u-margin-right--1"
              aria-hidden="true"
            />
            <strong>Return to copay balances</strong>
          </Link>
        </>
      )}
    </>
  );
};

export default DetailPage;
