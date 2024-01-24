import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import moment from 'moment';
import { setPageFocus } from '../../combined/utils/helpers';
import Modals from '../components/Modals';
import StatementAddresses from '../components/StatementAddresses';
import AccountSummary from '../components/AccountSummary';
import StatementCharges from '../components/StatementCharges';
import DownloadStatement from '../components/DownloadStatement';
import { OnThisPageStatements } from '../components/OnThisPageStatements';
import '../sass/medical-copays.scss';

const HTMLStatementPage = ({ match }) => {
  const selectedId = match.params.id;
  const combinedPortalData = useSelector(state => state.combinedPortal);
  const statements = combinedPortalData.mcp.statements ?? [];
  const userFullName = useSelector(({ user }) => user.profile.userFullName);
  const [selectedCopay] = statements.filter(({ id }) => id === selectedId);
  const statementDate = moment(selectedCopay.pSStatementDate, 'MM-DD').format(
    'MMMM D',
  );
  const title = `${statementDate} statement`;
  const prevPage = `Copay bill for ${selectedCopay.station.facilityName}`;
  const fullName = userFullName.middle
    ? `${userFullName.first} ${userFullName.middle} ${userFullName.last}`
    : `${userFullName.first} ${userFullName.last}`;

  useEffect(() => {
    setPageFocus('h1');
  }, []);

  return (
    <>
      <div className="vads-l-col--12 small-desktop-screen:vads-l-col--10">
        <va-breadcrumbs className="vads-u-font-family--sans no-wrap" uswds>
          <a href="/">Home</a>
          <a href="/manage-va-debt">Manage your VA debt</a>
          <a href="/manage-va-debt/summary/">Your VA debt and bills</a>
          <a href="/manage-va-debt/summary/copay-balances">
            Current copay balances
          </a>
          <a
            href={`/manage-va-debt/summary/copay-balances/${selectedId}/detail`}
          >
            {prevPage}
          </a>
          <a href={`/copay-balances/${selectedId}/detail/statement`}>{title}</a>
        </va-breadcrumbs>
      </div>
      <article className="vads-u-padding--0 medium-screen:vads-l-col--10 small-desktop-screen:vads-l-col--8">
        <h1 data-testid="statement-page-title">{title}</h1>
        <p
          className="vads-u-font-size--h3 vads-u-margin-top--0 vads-u-font-family--sarif"
          data-testid="facility-name"
        >
          {`${selectedCopay?.station.facilityName}`}
        </p>
        <OnThisPageStatements />
        <AccountSummary
          currentBalance={selectedCopay.pHNewBalance}
          newCharges={selectedCopay.pHTotCharges}
          paymentsReceived={selectedCopay.pHTotCredits}
          previousBalance={selectedCopay.pHPrevBal}
          statementDate={statementDate}
        />
        <StatementCharges
          data-testid="statement-charges"
          copay={selectedCopay}
        />
        <div className="vads-u-margin-top--3">
          <DownloadStatement
            key={selectedId}
            statementId={selectedId}
            statementDate={selectedCopay.pSStatementDate}
            fullName={fullName}
          />
        </div>
        <StatementAddresses
          data-testid="statement-addresses"
          copay={selectedCopay}
        />
        <h2 id="what-do-questions">
          What to do if you have questions about your statement
        </h2>
        <p>
          Contact the VA Health Resource Center at{' '}
          <va-telephone contact="8664001238" /> (
          <va-telephone tty contact="711" />
          ). We’re here Monday through Friday, 8:00 a.m. to 8:00 p.m. ET.
        </p>
        <Modals title="Notice of rights and responsibilities">
          <Modals.Rights />
        </Modals>
      </article>
    </>
  );
};

HTMLStatementPage.propTypes = {
  match: PropTypes.shape({
    params: PropTypes.shape({
      id: PropTypes.string,
    }),
  }),
};

export default HTMLStatementPage;
