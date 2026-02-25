import React, { useMemo, useEffect, useParams } from 'react';
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
import { DEFAULT_COPAY_ATTRIBUTES } from '../../combined/utils/constants';
import {
  setPageFocus,
  formatISODateToMMDDYYYY,
  isAnyElementFocused,
  verifyCurrentBalance,
} from '../../combined/utils/helpers';
import { useLighthouseCopays } from '../../combined/utils/selectors';
import useHeaderPageTitle from '../../combined/hooks/useHeaderPageTitle';
import { getCopayDetail } from '../../combined/actions/copays';

const ResolvePage = () => {
  const dispatch = useDispatch();

  const shouldUseLighthouseCopays = useSelector(useLighthouseCopays);

  // Get the selected copay ID from the URL and the selected copay data from Redux
  const copayDetail =
    useSelector(state => state.combinedPortal.mcp.currentCopay) || {};
  const isCopayDetailLoading = useSelector(
    state => state.combinedPortal.mcp.isCopayDetailLoading,
  );
  const allCopays = useSelector(state => state.combinedPortal.mcp.copays) || [];

  const { id: copayId } = useParams();
  const selectedCopay = shouldUseLighthouseCopays
    ? copayDetail
    : allCopays?.find(({ id }) => id === copayId);
  const TITLE = `Resolve your copay bill`;

  const copayAttributes = useMemo(
    () => {
      if (!selectedCopay?.id) return DEFAULT_COPAY_ATTRIBUTES;

      /* eslint-disable no-nested-ternary */
      return shouldUseLighthouseCopays
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
    },
    [selectedCopay?.id, shouldUseLighthouseCopays],
  );

  // get veteran name
  const userFullName = useSelector(({ user }) => user.profile.userFullName);
  const fullName = userFullName?.middle
    ? `${userFullName.first} ${userFullName.middle} ${userFullName.last}`
    : `${userFullName.first} ${userFullName.last}`;

  useHeaderPageTitle(TITLE);

  useEffect(
    () => {
      if (!isAnyElementFocused()) setPageFocus();

      const shouldFetch =
        shouldUseLighthouseCopays &&
        copayId &&
        !isCopayDetailLoading &&
        copayDetail?.id !== copayId;

      if (shouldFetch) {
        dispatch(getCopayDetail(`${copayId}`));
      }
    },
    [
      copayId,
      dispatch,
      copayDetail?.id,
      isCopayDetailLoading,
      shouldUseLighthouseCopays,
    ],
  );

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
            href: `/manage-va-debt/summary/copay-balances/${copayId}`,
            label: `Copay bill for ${copayAttributes.FACILITY_NAME}`,
          },
          {
            href: `/manage-va-debt/summary/copay-balances/${copayId}/resolve`,
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
          key={copayId}
          statementId={copayId}
          statementDate={
            shouldUseLighthouseCopays
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
};
export default ResolvePage;
