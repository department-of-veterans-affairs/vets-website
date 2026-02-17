import React, { useMemo, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import PropTypes from 'prop-types';
import { VaBreadcrumbs } from '@department-of-veterans-affairs/web-components/react-bindings';
import { VaLoadingIndicator } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
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
  isAnyElementFocused,
  DEFAULT_COPAY_ATTRIBUTES,
  verifyCurrentBalance,
} from '../../combined/utils/helpers';
import useHeaderPageTitle from '../../combined/hooks/useHeaderPageTitle';
import { getCopayDetailStatement } from '../../combined/actions/copays';

const ResolvePage = ({ match }) => {
  const dispatch = useDispatch();

  const shouldShowVHAPaymentHistory = showVHAPaymentHistory(
    useSelector(state => state),
  );

  // Get the selected copay statement ID from the URL
  //  and the selected copay statement data from Redux
  const copayDetail =
    useSelector(state => state.combinedPortal.mcp.selectedStatement) || {};
  const isCopayDetailLoading = useSelector(
    state => state.combinedPortal.mcp.isCopayDetailLoading,
  );
  const allStatements =
    useSelector(state => state.combinedPortal.mcp.statements) || [];

  const selectedId = match.params.id;
  const selectedCopay = shouldShowVHAPaymentHistory
    ? copayDetail
    : allStatements?.find(({ id }) => id === selectedId);
  const TITLE = `Resolve your copay bill`;

  const copayAttributes = useMemo(() => {
    if (!selectedCopay?.id) return DEFAULT_COPAY_ATTRIBUTES;

    /* eslint-disable no-nested-ternary */
    return shouldShowVHAPaymentHistory
      ? {
          TITLE: `Copay bill for ${selectedCopay?.attributes.facility.name}`,
          FACILITY_NAME:
            selectedCopay.attributes.facility.name ||
            getMedicalCenterNameByID(selectedCopay.attributes.facility.name),
          INVOICE_DATE: selectedCopay?.attributes?.invoiceDate,
          IS_CURRENT_DATE: verifyCurrentBalance(
            selectedCopay?.attributes.invoiceDate,
          ),
          AMOUNT_DUE: `${selectedCopay?.attributes.principalBalance}`,
          ACCOUNT_NUMBER: selectedCopay?.attributes.accountNumber,
          CHARGES: selectedCopay?.attributes?.lineItems ?? [],
        }
      : {
          TITLE: `Copay bill for ${selectedCopay?.station.facilityName}`,
          FACILITY_NAME:
            selectedCopay.station.facilityName ||
            getMedicalCenterNameByID(selectedCopay.station.facilityNum),
          INVOICE_DATE: selectedCopay?.pSStatementDateOutput,
          IS_CURRENT_DATE: verifyCurrentBalance(
            selectedCopay?.pSStatementDateOutput,
          ),
          AMOUNT_DUE:
            selectedCopay?.pHAmtDueOutput?.replace(/&nbsp;/g, '') || '',
          ACCOUNT_NUMBER:
            selectedCopay?.accountNumber || selectedCopay?.pHAccountNumber,
          CHARGES:
            selectedCopay?.details?.filter(
              charge => !charge.pDTransDescOutput.startsWith('&nbsp;'),
            ) ?? [],
        };
    /* eslint-disable no-nested-ternary */
  }, [selectedCopay?.id, shouldShowVHAPaymentHistory]);

  // get veteran name
  const userFullName = useSelector(({ user }) => user.profile.userFullName);
  const fullName = userFullName?.middle
    ? `${userFullName.first} ${userFullName.middle} ${userFullName.last}`
    : `${userFullName.first} ${userFullName.last}`;

  useHeaderPageTitle(TITLE);

  useEffect(() => {
    if (!isAnyElementFocused()) setPageFocus();

    const shouldFetch =
      shouldShowVHAPaymentHistory &&
      selectedId &&
      !isCopayDetailLoading &&
      copayDetail?.id !== selectedId;

    if (shouldFetch) {
      dispatch(getCopayDetailStatement(`${selectedId}`));
    }
  }, [
    selectedId,
    dispatch,
    copayDetail?.id,
    isCopayDetailLoading,
    shouldShowVHAPaymentHistory,
  ]);

  if (isCopayDetailLoading) {
    return <VaLoadingIndicator message="Loading features..." />;
  }

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
            label: `Copay bill for ${copayAttributes.FACILITY_NAME}`,
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
          for {copayAttributes.FACILITY_NAME}.
        </p>
        <va-on-this-page class="medium-screen:vads-u-margin-top--0" />
        <HowToPay
          acctNum={copayAttributes.ACCOUNT_NUMBER}
          facility={selectedCopay?.station}
          amtDue={copayAttributes.AMOUNT_DUE}
          lightHouseFacilityName={copayAttributes.FACILITY_NAME}
        />
        <DownloadStatement
          key={selectedId}
          statementId={selectedId}
          statementDate={
            shouldShowVHAPaymentHistory
              ? formatISODateToMMDDYYYY(copayAttributes.INVOICE_DATE)
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
  copayDetail: PropTypes.object,
  match: PropTypes.object,
};
export default ResolvePage;
