import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import Breadcrumbs from '@department-of-veterans-affairs/component-library/Breadcrumbs';
import scrollToTop from 'platform/utilities/ui/scrollToTop';
import Telephone, {
  PATTERNS,
} from '@department-of-veterans-affairs/component-library/Telephone';
import { setPageFocus } from '../utils/page';
import DebtLettersTable from '../components/DebtLettersTable';
import { DownloadLettersAlert } from '../components/Alerts';

const DebtLettersDownload = () => {
  const { debtLinks, isError, isVBMSError, hasDependentDebts } = useSelector(
    ({ combinedPortal }) => combinedPortal.debtLetters,
  );

  const showError = isError || isVBMSError;

  useEffect(() => {
    scrollToTop();
    setPageFocus('h1');
  });

  return (
    <div className="vads-l-row large-screen:vads-u-margin-x--neg2p5">
      <Breadcrumbs className="vads-u-font-family--sans">
        <a href="/">Home</a>
        <a href="/manage-va-debt">Manage your VA debt</a>
        <a href="/manage-va-debt/your-debt">Your debt</a>
        <a href="/manage-va-debt/your-debt/debt-letters">
          Download debt letters
        </a>
      </Breadcrumbs>
      <div>
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
        <DownloadLettersAlert />
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
            call us at
            <Telephone
              contact="800-827-0648"
              className="vads-u-margin-x--0p5"
            />
            (or
            <Telephone
              contact="1-612-713-6415"
              pattern={PATTERNS.OUTSIDE_US}
              className="vads-u-margin-x--0p5"
            />
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
          <p>
            <Link
              className="vads-u-font-family--sans vads-u-font-size--sm"
              to="/"
            >
              <i aria-hidden="true" className="fa fa-chevron-left" /> Return to
              your list of debts.
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default DebtLettersDownload;
