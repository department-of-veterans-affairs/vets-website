import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import { VaBreadcrumbs } from '@department-of-veterans-affairs/web-components/react-bindings';
import DisputeCharges from '../components/DisputeCharges';
import HowToPay from '../components/HowToPay';
import DownloadStatement from '../components/DownloadStatement';
import FinancialHelp from '../components/FinancialHelp';
import NeedHelpCopay from '../components/NeedHelpCopay';
import { setPageFocus } from '../../combined/utils/helpers';
import useHeaderPageTitle from '../../combined/hooks/useHeaderPageTitle';

const ResolvePage = ({ match }) => {
  const selectedId = match.params.id;
  const combinedPortalData = useSelector(state => state.combinedPortal);
  const statements = combinedPortalData.mcp.statements ?? [];
  const [selectedCopay] = statements?.filter(({ id }) => id === selectedId);
  const title = `Resolve your copay bill`;

  const acctNum =
    selectedCopay?.accountNumber || selectedCopay?.pHAccountNumber;
  const amtDue = selectedCopay?.pHAmtDueOutput.replace(/&nbsp;/g, '');

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
            label: `Copay bill for ${selectedCopay?.station.facilityName}`,
          },
          {
            href: `/manage-va-debt/summary/copay-balances/${selectedId}/resolve`,
            label: 'Resolve your copay',
          },
        ]}
        label="Breadcrumb"
        wrapping
      />
      <div className="medium-screen:vads-l-col--10 small-desktop-screen:vads-l-col--8">
        <h1
          data-testid="resolve-page-title"
          className="vads-u-margin-bottom--2"
        >
          Resolve your copay
        </h1>
        <p className="va-introtext">
          You can pay your balance, request financial help, or dispute this bill
          for {selectedCopay?.station.facilityName}.
        </p>
        <va-on-this-page class="medium-screen:vads-u-margin-top--0" />
        <HowToPay
          acctNum={acctNum}
          facility={selectedCopay?.station}
          amtDue={amtDue}
        />
        <DownloadStatement
          key={selectedId}
          statementId={selectedId}
          statementDate={selectedCopay?.pSStatementDate}
          fullName={fullName}
        />
        <FinancialHelp showOneThingPerPage />
        <DisputeCharges showOneThingPerPage />
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
