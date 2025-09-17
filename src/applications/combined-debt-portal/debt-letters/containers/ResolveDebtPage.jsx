import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import { VaBreadcrumbs } from '@department-of-veterans-affairs/web-components/react-bindings';
import { useLocation } from 'react-router-dom';
import { useFeatureToggle } from 'platform/utilities/feature-toggles';
import HowDoIPay from '../components/HowDoIPay';
import NeedHelp from '../components/NeedHelp';
import { setPageFocus } from '../../combined/utils/helpers';
import useHeaderPageTitle from '../../combined/hooks/useHeaderPageTitle';
import { getCurrentDebt } from '../utils/page';
import { deductionCodes } from '../const/deduction-codes';

const ResolveDebtPage = ({ match }) => {
  const { selectedDebt, debts } = useSelector(
    ({ combinedPortal }) => combinedPortal.debtLetters,
  );
  const location = useLocation();
  const currentDebt = getCurrentDebt(selectedDebt, debts, location);
  const selectedId = currentDebt?.id || match?.params?.id;

  const { useToggleValue, TOGGLE_NAMES } = useFeatureToggle();
  const showVHAPaymentHistory = useToggleValue(
    TOGGLE_NAMES.showVHAPaymentHistory,
  );

  const howToUserData = {
    fileNumber: currentDebt.fileNumber,
    payeeNumber: currentDebt.payeeNumber,
    personEntitled: currentDebt.personEntitled,
    deductionCode: currentDebt.deductionCode,
    receivableId: currentDebt.rcvblId,
  };

  const title = `Resolve your ${deductionCodes[currentDebt.deductionCode]}`;

  useHeaderPageTitle(title);

  useEffect(() => {
    setPageFocus('h1');
  }, []);

  return (
    <>
      <VaBreadcrumbs
        breadcrumbList={[
          { href: '/', label: 'VA.gov Home' },
          { href: '/manage-va-debt/summary', label: 'Your VA debt and bills' },
          {
            href: '/manage-va-debt/summary/debt-balances',
            label: 'Current debts',
          },
          {
            href: `/manage-va-debt/summary/debt-balances/details/${selectedId}`,
            label: `Debt details`,
          },
          {
            href: `/manage-va-debt/summary/balances/details/${selectedId}/resolve`,
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
          You can pay your balance, request financial help, or dispute this
          overpayment
        </p>
        <va-on-this-page class="medium-screen:vads-u-margin-top--0" />
        <HowDoIPay userData={howToUserData} />
        <NeedHelp showVHAPaymentHistory={showVHAPaymentHistory} />
      </div>
    </>
  );
};

ResolveDebtPage.propTypes = {
  match: PropTypes.shape({
    params: PropTypes.shape({
      id: PropTypes.string,
    }),
  }),
};

export default ResolveDebtPage;
