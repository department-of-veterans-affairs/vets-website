import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { setPageFocus } from '../../combined/utils/helpers';
import DebtLettersTable from '../components/DebtLettersTable';

const DebtLettersDownload = () => {
  const { debtLinks, isError, isVBMSError, hasDependentDebts } = useSelector(
    ({ combinedPortal }) => combinedPortal.debtLetters,
  );

  const showError = isError || isVBMSError;

  useEffect(() => {
    setPageFocus('h1');
  });

  return (
    <>
      <div className="vads-l-col--9 small-desktop-screen:vads-l-col--12">
        <va-breadcrumbs label="Breadcrumb" uswds>
          <a href="/">Home</a>
          <a href="/manage-va-debt/">Manage your VA debt</a>
          <a href="/manage-va-debt/summary/">Your VA debt and bills</a>
          <Link to="/debt-balances/">Current VA debt</Link>
          <Link to="/debt-balances/letters">Debt letters</Link>
        </va-breadcrumbs>
      </div>
      <div className="medium-screen:vads-l-col--10 small-desktop-screen:vads-l-col--8">
        <h1
          id="downloadDebtLetters"
          className="vads-u-margin-bottom--2"
          tabIndex="-1"
        >
          Download debt letters
        </h1>
        <p className="vads-u-font-weight--normal vads-u-color--gray-dark vads-u-margin-top--0 vads-u-margin-bottom--2 vads-u-font-size--lg">
          Download your debt letters, learn your payment options, or find out
          how to get help with your VA debts.
        </p>
        <h2>Your debt letters</h2>
        <DebtLettersTable
          debtLinks={debtLinks}
          hasDependentDebts={hasDependentDebts}
          isError={showError}
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
              href="/health-care/pay-copay-bill/"
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
