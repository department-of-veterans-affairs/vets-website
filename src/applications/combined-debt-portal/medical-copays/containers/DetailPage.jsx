import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import { VaBreadcrumbs } from '@department-of-veterans-affairs/web-components/react-bindings';
import HTMLStatementList from '../components/HTMLStatementList';
import BalanceQuestions from '../components/BalanceQuestions';
import DisputeCharges from '../components/DisputeCharges';
import HowToPay from '../components/HowToPay';
import FinancialHelp from '../components/FinancialHelp';
import Modals from '../../combined/components/Modals';
import CopayAlertContainer from '../components/CopayAlertContainer';
import {
  formatDate,
  verifyCurrentBalance,
  setPageFocus,
} from '../../combined/utils/helpers';
import useHeaderPageTitle from '../../combined/hooks/useHeaderPageTitle';

const DetailPage = ({ match }) => {
  const selectedId = match.params.id;
  const [alert, setAlert] = useState('status');
  const combinedPortalData = useSelector(state => state.combinedPortal);
  const statements = combinedPortalData.mcp.statements ?? [];
  const [selectedCopay] = statements?.filter(({ id }) => id === selectedId);
  const title = `Copay bill for ${selectedCopay?.station.facilityName}`;
  const statementDate = formatDate(selectedCopay?.pSStatementDateOutput);
  // using statementDateOutput since it has delimiters ('/') unlike pSStatementDate
  const isCurrentBalance = verifyCurrentBalance(
    selectedCopay?.pSStatementDateOutput,
  );
  const acctNum =
    selectedCopay?.accountNumber || selectedCopay?.pHAccountNumber;

  useHeaderPageTitle(title);

  useEffect(() => {
    setPageFocus('h1');
  }, []);

  useEffect(
    () => {
      if (!isCurrentBalance) {
        setAlert('past-due-balance');
      }
    },
    [isCurrentBalance],
  );

  return (
    <>
      <VaBreadcrumbs
        breadcrumbList={[
          {
            href: '/',
            label: 'VA.gov Home',
          },
          {
            href: '/manage-va-debt/summary',
            label: 'Overpayments and copay bills',
          },
          {
            href: '/manage-va-debt/summary/copay-balances',
            label: 'Current copay balances',
          },
          {
            href: `/manage-va-debt/summary/copay-balances/${selectedId}`,
            label: `${title}`,
          },
        ]}
        label="Breadcrumb"
        wrapping
      />
      <div className="medium-screen:vads-l-col--10 small-desktop-screen:vads-l-col--8">
        <h1 data-testid="detail-page-title" className="vads-u-margin-bottom--2">
          {title}
        </h1>
        <p className="va-introtext">
          Updated on
          <time
            dateTime={statementDate}
            className="vads-u-margin-x--0p5"
            data-testid="updated-date"
          >
            {statementDate}
          </time>
          . Payments after this date will not be reflected here.
        </p>
        <CopayAlertContainer type={alert} copay={selectedCopay} />{' '}
        <va-on-this-page class="vads-u-margin-top--2 medium-screen:vads-u-margin-top--0" />
        <HTMLStatementList selectedId={selectedId} />
        <HowToPay acctNum={acctNum} facility={selectedCopay?.station} />
        <FinancialHelp />
        <DisputeCharges />
        <BalanceQuestions
          facilityLocation={selectedCopay?.station.facilityName}
          facilityPhone={selectedCopay?.station.teLNum}
        />
        <Modals title="Notice of rights and responsibilities">
          <Modals.Rights />
        </Modals>
      </div>
    </>
  );
};

DetailPage.propTypes = {
  match: PropTypes.shape({
    params: PropTypes.shape({
      id: PropTypes.string,
    }),
  }),
};

export default DetailPage;
