import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import HTMLStatementList from '../components/HTMLStatementList';
import BalanceQuestions from '../components/BalanceQuestions';
import DisputeCharges from '../components/DisputeCharges';
import HowToPay from '../components/HowToPay';
import FinancialHelp from '../components/FinancialHelp';
import Modals from '../components/Modals';
import Alert from '../../combined/components/MCPAlerts';
import { OnThisPageDetails } from '../components/OnThisPageDetails';
import {
  formatDate,
  verifyCurrentBalance,
  setPageFocus,
} from '../../combined/utils/helpers';
import '../sass/medical-copays.scss';

const DetailPage = ({ match }) => {
  const selectedId = match.params.id;
  const [alert, setAlert] = useState('status');
  const combinedPortalData = useSelector(state => state.combinedPortal);
  const statements = combinedPortalData.mcp.statements ?? [];
  const [selectedCopay] = statements?.filter(({ id }) => id === selectedId);
  const title = `Copay bill for ${selectedCopay?.station.facilityName}`;
  const statementDate = formatDate(selectedCopay?.pSStatementDateOutput);
  const isCurrentBalance = verifyCurrentBalance(selectedCopay?.pSStatementDate);
  const acctNum = selectedCopay?.pHAccountNumber
    ? selectedCopay?.pHAccountNumber.toString()
    : selectedCopay?.pHCernerAccountNumber.toString();

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
      <va-breadcrumbs className="vads-u-font-family--sans no-wrap">
        <a href="/">Home</a>
        <a href="/manage-va-debt">Manage your VA debt</a>
        <a href="/manage-va-debt/summary/">Your VA debt and bills</a>
        <a href="/manage-va-debt/summary/copay-balances">
          Current copay balances
        </a>
        <a href={`/manage-va-debt/summary/copay-balances/${selectedId}/detail`}>
          Copay bill for {selectedCopay?.station.facilityName}
        </a>
      </va-breadcrumbs>
      <div className="medium-screen:vads-l-col--10 small-desktop-screen:vads-l-col--8">
        <h1 data-testid="detail-page-title">{title}</h1>
        <p className="vads-u-font-size--h3 vads-u-margin-top--0 vads-u-margin-bottom--5">
          Updated on
          <time
            dateTime={statementDate}
            className="vads-u-margin-x--0p5"
            data-testid="updated-date"
          >
            {statementDate}
          </time>
        </p>
        <Alert type={alert} copay={selectedCopay} />
        <OnThisPageDetails />
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
