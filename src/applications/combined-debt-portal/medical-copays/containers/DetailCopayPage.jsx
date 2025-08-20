import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import { VaBreadcrumbs } from '@department-of-veterans-affairs/web-components/react-bindings';
import { CONTACTS } from '@department-of-veterans-affairs/component-library/contacts';
import { useFeatureToggle } from '~/platform/utilities/feature-toggles/useFeatureToggle';

import Modals from '../components/Modals';
import Alert from '../../combined/components/MCPAlerts';
import StatementTable from '../components/StatementTable';
import DownloadStatement from '../components/DownloadStatement';
import StatementCharges from '../components/StatementCharges';
import HTMLStatementList from '../components/HTMLStatementList';
import StatementAddresses from '../components/StatementAddresses';
import {
  formatDate,
  verifyCurrentBalance,
  setPageFocus,
} from '../../combined/utils/helpers';
import useHeaderPageTitle from '../../combined/hooks/useHeaderPageTitle';

const DetailCopayPage = ({ match }) => {
  const [alert, setAlert] = useState('status');
  const { useToggleValue, TOGGLE_NAMES } = useFeatureToggle();
  const showVHAPaymentHistory = useToggleValue(
    TOGGLE_NAMES.showVHAPaymentHistory,
  );
  const showCDPOneThingPerPage = useToggleValue(
    TOGGLE_NAMES.showCDPOneThingPerPage,
  );

  // Get the selected copay statement ID from the URL
  //  and the selected copay statement data from Redux
  const selectedId = match.params.id;
  const combinedPortalData = useSelector(state => state.combinedPortal);
  const statements = combinedPortalData.mcp.statements ?? [];
  const [selectedCopay] = statements?.filter(({ id }) => id === selectedId);

  // Get selected copay statement data
  const title = `Copay bill for ${selectedCopay?.station.facilityName}`;
  const isCurrentBalance = verifyCurrentBalance(
    selectedCopay?.pSStatementDateOutput,
  );
  const acctNum =
    selectedCopay?.accountNumber || selectedCopay?.pHAccountNumber;

  // get veteran name
  const userFullName = useSelector(({ user }) => user.profile.userFullName);
  const fullName = userFullName?.middle
    ? `${userFullName.first} ${userFullName.middle} ${userFullName.last}`
    : `${userFullName.first} ${userFullName.last}`;

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
        <h1
          data-testid="detail-copay-page-title-otpp"
          className="vads-u-margin-bottom--2"
        >
          {title}
        </h1>
        <Alert type={alert} copay={selectedCopay} />
        <div className="vads-u-margin-y--4">
          <h2 className="vads-u-margin-top--0 vads-u-font-size--h3">
            Copay details
          </h2>
          <dl className="vads-u-margin--0">
            <div className="vads-u-display--flex vads-u-flex-direction--row">
              <dt>Current balance:</dt>
              <dd className="vads-u-margin-left--1 vads-u-font-weight--bold">
                {formatCurrency(selectedCopay?.pHNewBalance)}
              </dd>
            </div>
            <div className="vads-u-display--flex vads-u-flex-direction--row">
              <dt>Payment due:</dt>
              <dd className="vads-u-margin-left--1 vads-u-font-weight--bold">
                {formatDate(getPaymentDueDate())}
              </dd>
            </div>
            {selectedCopay.pHTotCharges ? null : (
              <div className="vads-u-display--flex vads-u-flex-direction--row">
                <dt>New charges:</dt>
                <dd className="vads-u-margin-left--1 vads-u-font-weight--bold">
                  {formatCurrency(selectedCopay.pHTotCharges)}
                </dd>
              </div>
            )}
          </dl>
          <h2 className="vads-u-margin-top--2 vads-u-font-size--h3">
            Account number
          </h2>
          <p className="vads-u-margin--0">{acctNum}</p>
        </div>
        <div className="vads-u-margin-y--4">
          {/* Show VHA Lighthouse data | or Current CDW Statement */}
          {showVHAPaymentHistory ? (
            <StatementTable
              charges={charges}
              formatCurrency={formatCurrency}
              selectedCopay={selectedCopay}
            />
          ) : (
            <StatementCharges
              copay={selectedCopay}
              showCurrentStatementHeader
              showOneThingPerPage={showCDPOneThingPerPage}
            />
          )}
          <DownloadStatement
            key={selectedId}
            statementId={selectedId}
            statementDate={selectedCopay?.pSStatementDate}
            fullName={fullName}
          />
        </div>
        <HTMLStatementList
          selectedId={selectedId}
          oneThingPerPageActive={showCDPOneThingPerPage}
        />
        <StatementAddresses
          data-testid="statement-addresses"
          copay={selectedCopay}
        />
        <p>
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
              Health Resource Center at{' '}
              <va-telephone contact={CONTACTS.HEALTH_RESOURCE_CENTER} />. We’re
              here Monday through Friday, 8:00 a.m. to 8:00 p.m. ET.
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
