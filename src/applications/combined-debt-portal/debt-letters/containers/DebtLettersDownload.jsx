import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { VaBreadcrumbs } from '@department-of-veterans-affairs/web-components/react-bindings';
import {
  setPageFocus,
  debtLettersShowLettersVBMS,
} from '../../combined/utils/helpers';
import DebtLettersTable from '../components/DebtLettersTable';
import useHeaderPageTitle from '../../combined/hooks/useHeaderPageTitle';

const DebtLettersDownload = () => {
  const { debtLinks, isError, isVBMSError, hasDependentDebts } = useSelector(
    ({ combinedPortal }) => combinedPortal.debtLetters,
  );

  const showError = isError || isVBMSError;
  const showDebtLetterDownload = useSelector(state =>
    debtLettersShowLettersVBMS(state),
  );

  const title = 'Download debt letters';
  useHeaderPageTitle(title);

  useEffect(() => {
    setPageFocus('h1');
  });

  return (
    <>
      <VaBreadcrumbs
        breadcrumbList={[
          {
            href: '/',
            label: 'Home',
          },
          {
            href: '/manage-va-debt/summary',
            label: 'Your VA debt and bills',
          },
          {
            href: '/manage-va-debt/summary/debt-balances',
            label: 'Current debts',
          },
          {
            href: '/manage-va-debt/summary/debt-balances/letters',
            label: 'Debt letters',
          },
        ]}
        label="Breadcrumb"
        wrapping
      />
      <div className="medium-screen:vads-l-col--10 small-desktop-screen:vads-l-col--8">
        <h1
          id="downloadDebtLetters"
          className="vads-u-margin-bottom--2"
          tabIndex="-1"
        >
          {title}
        </h1>
        <p className="va-introtext">
          Download your debt letters, learn your payment options, or find out
          how to get help with your VA debts.
        </p>
        <h2>Your debt letters</h2>
        <DebtLettersTable
          debtLinks={debtLinks}
          hasDependentDebts={hasDependentDebts}
          isError={showError}
          showDebtLetterDownload={showDebtLetterDownload}
        />
        <div className="vads-u-margin-bottom--6 vads-u-margin-top--5">
          <h2 className="vads-u-margin-y--0">
            What if the letter I’m looking for isn’t listed here?
          </h2>
          <p className="vads-u-font-family--sans vads-u-margin-bottom--0">
            If you’ve received a letter about a VA debt that isn’t listed here,
            call us at{' '}
            <span className="no-wrap">
              <va-telephone contact="8008270648" />
            </span>{' '}
            (or{' '}
            <span className="no-wrap">
              <va-telephone contact="6127136415" international />
            </span>{' '}
            from overseas). You can also call us to get information about your
            resolved debts.
          </p>
          <p className="vads-u-font-family--sans">
            For medical copay debt, please go to
            <a
              className="vads-u-margin-x--0p5"
              href="/manage-va-debt/summary/copay-balances"
            >
              pay your VA copay bill
            </a>
            to learn about your payment options.
          </p>
        </div>
      </div>
    </>
  );
};

export default DebtLettersDownload;
