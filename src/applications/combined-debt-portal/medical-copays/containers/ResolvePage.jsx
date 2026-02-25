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

const ResolvePage = () => {
  const dispatch = useDispatch();
  const { id: copayId } = useParams();

  const shouldUseLighthouseCopays = useSelector(useLighthouseCopays);
  const { currentCopay, isLoading } = useCurrentCopay();
  
  const TITLE = `Resolve your copay bill`;

  const copayAttributes = useMemo(
    () => {
      if (!currentCopay?.id) return DEFAULT_COPAY_ATTRIBUTES;

      /* eslint-disable no-nested-ternary */
      return shouldUseLighthouseCopays
        ? {
            TITLE: `Copay bill for ${currentCopay?.attributes.facility.name}`,
            FACILITY_NAME:
              currentCopay.attributes.facility.name ||
              getMedicalCenterNameByID(currentCopay.attributes.facility.name),
            INVOICE_DATE: currentCopay?.attributes?.invoiceDate,
            IS_CURRENT_DATE: verifyCurrentBalance(
              currentCopay?.attributes.invoiceDate,
            ),
            AMOUNT_DUE: `${currentCopay?.attributes.principalBalance}`,
            ACCOUNT_NUMBER: currentCopay?.attributes.accountNumber,
            CHARGES: currentCopay?.attributes?.lineItems ?? [],
          }
        : {
            TITLE: `Copay bill for ${currentCopay?.station.facilityName}`,
            FACILITY_NAME:
              currentCopay.station.facilityName ||
              getMedicalCenterNameByID(currentCopay.station.facilityNum),
            INVOICE_DATE: currentCopay?.pSStatementDateOutput,
            IS_CURRENT_DATE: verifyCurrentBalance(
              currentCopay?.pSStatementDateOutput,
            ),
            AMOUNT_DUE:
              currentCopay?.pHAmtDueOutput?.replace(/&nbsp;/g, '') || '',
            ACCOUNT_NUMBER:
              currentCopay?.accountNumber || currentCopay?.pHAccountNumber,
            CHARGES:
              currentCopay?.details?.filter(
                charge => !charge.pDTransDescOutput.startsWith('&nbsp;'),
              ) ?? [],
          };
      /* eslint-disable no-nested-ternary */
    },
    [currentCopay?.id, shouldUseLighthouseCopays],
  );

  // get veteran name
  const userFullName = useSelector(({ user }) => user.profile.userFullName);
  const fullName = userFullName?.middle
    ? `${userFullName.first} ${userFullName.middle} ${userFullName.last}`
    : `${userFullName.first} ${userFullName.last}`;

  useHeaderPageTitle(TITLE);

  useEffect(() => {
    if (!isAnyElementFocused()) setPageFocus();
  }, []);

  if (isLoading) {
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
          facility={currentCopay?.station}
          amtDue={copayAttributes.AMOUNT_DUE}
          lightHouseFacilityName={copayAttributes.FACILITY_NAME}
        />
        <DownloadStatement
          key={copayId}
          statementId={copayId}
          statementDate={
            shouldUseLighthouseCopays
              ? formatISODateToMMDDYYYY(copayAttributes.INVOICE_DATE)
              : currentCopay.pSStatementDateOutput
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
