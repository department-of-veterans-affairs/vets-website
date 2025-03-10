import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import { VaBreadcrumbs } from '@department-of-veterans-affairs/web-components/react-bindings';

import Modals from '../components/Modals';
import Alert from '../../combined/components/MCPAlerts';
import StatementTable from '../components/StatementTable';
import DownloadStatement from '../components/DownloadStatement';
import {
  formatDate,
  verifyCurrentBalance,
  setPageFocus,
} from '../../combined/utils/helpers';
import useHeaderPageTitle from '../../combined/hooks/useHeaderPageTitle';

const DetailCopayPage = ({ match }) => {
  const selectedId = match.params.id;
  const [alert, setAlert] = useState('status');
  const combinedPortalData = useSelector(state => state.combinedPortal);
  const statements = combinedPortalData.mcp.statements ?? [];
  const userFullName = useSelector(({ user }) => user.profile.userFullName);
  const [selectedCopay] = statements?.filter(({ id }) => id === selectedId);
  const title = `Copay bill for ${selectedCopay?.station.facilityName}`;
  const fullName = userFullName?.middle
    ? `${userFullName.first} ${userFullName.middle} ${userFullName.last}`
    : `${userFullName.first} ${userFullName.last}`;
  const isCurrentBalance = verifyCurrentBalance(
    selectedCopay?.pSStatementDateOutput,
  );
  const acctNum =
    selectedCopay?.accountNumber || selectedCopay?.pHAccountNumber;

  const getPaymentDueDate = () => {
    if (!selectedCopay?.pSStatementDateOutput) return null;

    // Statement date is in MM/DD/YYYY format
    const [month, day, year] = selectedCopay.pSStatementDateOutput.split('/');

    // Create date and add 30 days
    const date = new Date(year, parseInt(month, 10) - 1, parseInt(day, 10));
    date.setDate(date.getDate() + 30);

    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(
      2,
      '0',
    )}-${String(date.getDate()).padStart(2, '0')}`;
  };

  const charges = selectedCopay?.details?.filter(
    charge => !charge.pDTransDescOutput.startsWith('&nbsp;'),
  );

  const formatCurrency = amount => {
    if (!amount) return '$0.00';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const getStatementDateRange = () => {
    if (
      !selectedCopay?.statementStartDate ||
      !selectedCopay?.statementEndDate
    ) {
      return 'This statement shows your current charges.';
    }

    const startDate = formatDate(selectedCopay.statementStartDate);
    const endDate = formatDate(selectedCopay.statementEndDate);
    return `This statement shows charges you received between ${startDate} and ${endDate}.`;
  };

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
            label: 'Your VA debt and bills',
          },
          {
            href: '/manage-va-debt/summary/copay-balances',
            label: 'Current copay balances',
          },
          {
            href: `/manage-va-debt/summary/copay-balances/${selectedId}/detail`,
            label: title,
          },
        ]}
        label="Breadcrumb"
        wrapping
      />
      <div className="medium-screen:vads-l-col--10 small-desktop-screen:vads-l-col--8">
        <h1 data-testid="detail-page-title" className="vads-u-margin-bottom--2">
          {title}
        </h1>

        <Alert type={alert} copay={selectedCopay} />

        <div className="vads-u-padding--3 vads-u-margin-y--3">
          <div className="vads-l-row">
            <div className="vads-l-col--12 medium-screen:vads-l-col--4">
              <h2 className="vads-u-font-size--h3 vads-u-margin-top--0">
                Copay details
              </h2>
              <dl className="vads-u-margin--0">
                <dt className="vads-u-font-weight--bold">Current balance</dt>
                <dd className="vads-u-margin-left--0">
                  {formatCurrency(selectedCopay?.pHNewBalance)}
                </dd>
                <dt className="vads-u-font-weight--bold vads-u-margin-top--2">
                  Payment due
                </dt>
                <dd className="vads-u-margin-left--0">
                  {formatDate(getPaymentDueDate())}
                </dd>
                <dt className="vads-u-font-weight--bold vads-u-margin-top--2">
                  Account number
                </dt>
                <dd className="vads-u-margin-left--0">{acctNum}</dd>
              </dl>
            </div>
          </div>
        </div>

        <h2 id="current-statement" className="vads-u-margin-bottom--2">
          Current statement
        </h2>
        <p>{getStatementDateRange()}</p>

        <StatementTable
          charges={charges}
          formatCurrency={formatCurrency}
          selectedCopay={selectedCopay}
        />

        <div className="vads-u-margin-y--3">
          <DownloadStatement
            key={selectedId}
            statementId={selectedId}
            statementDate={selectedCopay?.pSStatementDate}
            fullName={fullName}
          />
        </div>

        <h2 className="vads-u-margin-y--4">Previous statements</h2>
        <p>
          Review your charges and download your mailed statements from the past
          6 months for this facility.
        </p>
        {statements
          ?.filter(statement => statement.id !== selectedId)
          ?.map(statement => (
            <div key={statement.id} className="vads-u-margin-y--2">
              <DownloadStatement
                key={statement.id}
                statementId={statement.id}
                statementDate={statement.pSStatementDate}
                fullName={fullName}
              />
            </div>
          ))}

        <h2 className="vads-u-margin-y--4">Statement addresses</h2>
        <div>
          <h3 className="vads-u-font-size--h4 vads-u-margin-top--0">
            Sender address
          </h3>
          <p className="vads-u-margin-top--0">
            {selectedCopay?.station.facilityName}
            <br />
            {selectedCopay?.station.staTAddress1}
            <br />
            {`${selectedCopay?.station.city}, ${selectedCopay?.station.state} ${
              selectedCopay?.station.ziPCdeOutput
            }`}
          </p>

          <h3 className="vads-u-font-size--h4 vads-u-margin-top--4">
            Recipient address
          </h3>
          <p className="vads-u-margin-top--0">
            {selectedCopay?.pHAddress1}
            <br />
            {selectedCopay?.pHCity}, {selectedCopay?.pHState}{' '}
            {selectedCopay?.pHZipCdeOutput}
          </p>
        </div>
        <p className="vads-u-margin-top--2">
          <strong>Note:</strong> If your address has changed, call{' '}
          <va-telephone contact="8662602614" />.
        </p>
        <Modals title="Notice of rights and responsibilities">
          <Modals.Rights />
        </Modals>
        <va-need-help className="vads-u-margin-top--4">
          <div slot="content">
            <p>
              You can contact us online through{' '}
              <va-link text="Ask VA" href="https://ask.va.gov" /> or call the VA
              Health Resource Center at <va-telephone contact="8664001238" />.
              We’re here Monday through Friday, 8:00 a.m. to 8:00 p.m. ET.
            </p>
          </div>
        </va-need-help>
      </div>
    </>
  );
};

DetailCopayPage.propTypes = {
  match: PropTypes.shape({
    params: PropTypes.shape({
      id: PropTypes.string,
    }),
  }),
};

export default DetailCopayPage;
