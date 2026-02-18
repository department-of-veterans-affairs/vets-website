import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import { VaBreadcrumbs } from '@department-of-veterans-affairs/web-components/react-bindings';
import { useLocation } from 'react-router-dom';
import HowDoIPay from '../components/HowDoIPay';
import NeedHelp from '../components/NeedHelp';
import {
  setPageFocus,
  showVHAPaymentHistory,
} from '../../combined/utils/helpers';
import useHeaderPageTitle from '../../combined/hooks/useHeaderPageTitle';
import { getCurrentDebt } from '../utils/page';
import { deductionCodes } from '../const/deduction-codes';
import HowDoIGetHelp from '../components/HowDoIGetHelp';

const ResolveDebtPage = ({ match }) => {
  const { selectedDebt, debts } = useSelector(
    ({ combinedPortal }) => combinedPortal.debtLetters,
  );
  const location = useLocation();
  const currentDebt = getCurrentDebt(selectedDebt, debts, location);
  const selectedId = currentDebt?.id || match?.params?.id;

  const shouldShowVHAPaymentHistory = showVHAPaymentHistory(
    useSelector(state => state),
  );

  const howToUserData = {
    currentAr: currentDebt.currentAr,
    fileNumber: currentDebt.fileNumber,
    payeeNumber: currentDebt.payeeNumber,
    personEntitled: currentDebt.personEntitled,
    deductionCode: currentDebt.deductionCode,
    receivableId: currentDebt.rcvblId,
  };

  const title = `Resolve overpayment`;

  useHeaderPageTitle(title);

  useEffect(() => {
    setPageFocus('h1');
  }, []);

  return (
    <article>
      <VaBreadcrumbs
        breadcrumbList={[
          { href: '/', label: 'VA.gov Home' },
          {
            href: '/manage-va-debt/summary',
            label: 'Overpayments and copay bills',
          },
          {
            href: '/manage-va-debt/summary/debt-balances',
            label: 'Overpayment balances',
          },
          {
            href: `/manage-va-debt/summary/debt-balances/${selectedId}`,
            label: `${deductionCodes[currentDebt.deductionCode]}`,
          },
          {
            href: `/manage-va-debt/summary/balances/${selectedId}/resolve`,
            label: `Resolve overpayment`,
          },
        ]}
        label="Breadcrumb"
        wrapping
      />
      <div className="medium-screen:vads-l-col--12 small-desktop-screen:vads-l-col--8">
        <h1 data-testid="detail-page-title" className="vads-u-margin-bottom--2">
          Resolve overpayment
        </h1>
        <p className="va-introtext">
          You can pay your balance, request financial help, or dispute this{' '}
          {deductionCodes[currentDebt.deductionCode]}.
        </p>
        <va-on-this-page class="medium-screen:vads-u-margin-top--0" />
        <HowDoIPay userData={howToUserData} />
        <HowDoIGetHelp showVHAPaymentHistory={shouldShowVHAPaymentHistory} />
        <NeedHelp />
      </div>
    </article>
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
