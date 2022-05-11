import React, { useEffect } from 'react';
import scrollToTop from 'platform/utilities/ui/scrollToTop';
import Balances from '../components/Balances';

const OverviewPage = () => {
  const title = 'Your VA debt and bill';

  useEffect(() => {
    scrollToTop();
  }, []);

  return (
    <>
      <va-breadcrumbs className="vads-u-font-family--sans no-wrap">
        <a href="/">Home</a>
        <a href="/debt-and-bills">Your VA debt and bills</a>
      </va-breadcrumbs>
      <h1 data-testid="overview-page-title">{title}</h1>
      <p className="vads-u-font-size--lg vads-u-font-family--serif">
        Check the details of debt you might have from VA education, disability
        compensation, or pension programs, or VA health care and prescription
        charges from VA health care facilities. Find out how to make payments or
        request financial help.
      </p>
      <h2>Debt and bill overview</h2>
      <Balances />
      <h2>What to do if you have questions about your debt and bills</h2>
      <h3>Questions about benefit debt</h3>
      <p>
        Call the Debt Management Center (DMC) at{' '}
        <va-telephone contact="800-827-0648" /> (TTY:{' '}
        <va-telephone contact="711" />
        ). We’re here Monday through Friday, 7:30 a.m. to 7:00 p.m. ET.
      </p>
      <h3>Questions about medical copayment bills</h3>
      <p>
        Call the VA Health Resource Center at{' '}
        <va-telephone contact="866-400-1238" /> (TTY:{' '}
        <va-telephone contact="711" />
        ). We’re here Monday through Friday, 8:00 a.m. to 8:00 p.m. ET.
      </p>
    </>
  );
};

export default OverviewPage;
