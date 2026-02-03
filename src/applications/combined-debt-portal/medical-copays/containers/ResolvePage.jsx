import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import { VaBreadcrumbs } from '@department-of-veterans-affairs/web-components/react-bindings';
import { getMedicalCenterNameByID } from 'platform/utilities/medical-centers/medical-centers';
import DisputeCharges from '../components/DisputeCharges';
import HowToPay from '../components/HowToPay';
import DownloadStatement from '../components/DownloadStatement';
import FinancialHelp from '../components/FinancialHelp';
import NeedHelpCopay from '../components/NeedHelpCopay';
import {
  setPageFocus,
  showVHAPaymentHistory,
  formatISODateToMMDDYYYY,
} from '../../combined/utils/helpers';
import useHeaderPageTitle from '../../combined/hooks/useHeaderPageTitle';

const ResolvePage = ({ match }) => {
  const shouldShowVHAPaymentHistory = showVHAPaymentHistory(
    useSelector(state => state),
  );

  // Get the selected copay statement ID from the URL
  //  and the selected copay statement data from Redux
  const selectedStatement =
    useSelector(state => state.combinedPortal.mcp.selectedStatement) || {};
  const allStatements =
    useSelector(state => state.combinedPortal.mcp.statements) || [];

  const selectedId = match.params.id;
  const selectedCopay = shouldShowVHAPaymentHistory
    ? selectedStatement
    : allStatements?.find(({ id }) => id === selectedId);
  const title = `Resolve your copay bill`;

  const facilityName = shouldShowVHAPaymentHistory
    ? selectedCopay.attributes.facility.name ||
      getMedicalCenterNameByID(selectedCopay.attributes.facility.name)
    : selectedCopay.station.facilityName ||
      getMedicalCenterNameByID(selectedCopay.station.facilityNum);

  const acctNum = shouldShowVHAPaymentHistory
    ? selectedCopay?.attributes.accountNumber
    : selectedCopay?.accountNumber || selectedCopay?.pHAccountNumber;

  const amtDue = shouldShowVHAPaymentHistory
    ? selectedCopay?.attributes.principalBalance
    : selectedCopay?.pHAmtDueOutput.replace(/&nbsp;/g, '');

  // get veteran name
  const userFullName = useSelector(({ user }) => user.profile.userFullName);
  const fullName = userFullName?.middle
    ? `${userFullName.first} ${userFullName.middle} ${userFullName.last}`
    : `${userFullName.first} ${userFullName.last}`;

  useHeaderPageTitle(title);

  useEffect(() => {
    setPageFocus('h1');
  }, []);

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
            label: 'Copay balances',
          },
          {
            href: `/manage-va-debt/summary/copay-balances/${selectedId}`,
            label: `Copay bill for ${facilityName}`,
          },
          {
            href: `/manage-va-debt/summary/copay-balances/${selectedId}/resolve`,
            label: 'Resolve your copay',
          },
        ]}
        label="Breadcrumb"
        wrapping
      />
      <div className="medium-screen:vads-l-col--12 small-desktop-screen:vads-l-col--8">
        <h1
          data-testid="resolve-page-title"
          className="vads-u-margin-bottom--2"
        >
          Resolve your copay
        </h1>
        <p className="va-introtext">
          You can pay your balance, request financial help, or dispute this bill
          for {facilityName}.
        </p>
        <va-on-this-page class="medium-screen:vads-u-margin-top--0" />
        <HowToPay
          acctNum={acctNum}
          facility={selectedCopay?.station}
          amtDue={amtDue}
          lightHouseFacilityName={facilityName}
        />
        <DownloadStatement
          key={selectedId}
          statementId={selectedId}
          statementDate={
            shouldShowVHAPaymentHistory
              ? formatISODateToMMDDYYYY(selectedCopay.attributes.lastUpdatedAt)
              : selectedCopay.pSStatementDateOutput
          }
          fullName={fullName}
        />
        <FinancialHelp />
        <DisputeCharges />
        <NeedHelpCopay />
      </div>
    </>
  );
};

ResolvePage.propTypes = {
  match: PropTypes.shape({
    params: PropTypes.shape({
      id: PropTypes.string,
    }),
  }),
};

export default ResolvePage;
