import React from 'react';

const NeedHelp = () => (
  <>
    <h4 className="right-heading">Need help?</h4>
    <p>
      Call the Debt Management Center between 6:30am and 6:00pm CST using the
      numbers below:
    </p>
    <p className="vads-u-margin-top--0">
      Toll-free:{' '}
      <a href="tel: 800-827-0648" aria-label="800. 8 2 7. 0648.">
        800-827-0648.
      </a>
    </p>
    <p className="vads-u-margin-top--0">
      International:{' '}
      <a href="tel: 612-713-6415" aria-label="612. 7 1 3. 6415.">
        612-713-6415.
      </a>
    </p>
    <h5 className="vads-u-margin-top--1 ">Request financial assitance</h5>
    <p className="vads-u-margin-top--0">
      If you require financial assistance, you may request an extended monthly
      payment plan, compromise, or waiver. Call the DMC to discuss your options
      and next steps.
    </p>
    <h5 className="vads-u-margin-top--1">Dispute a debt</h5>
    {/* ToDo: add debt dispute link */}
    <p className="vads-u-margin-top--0">
      If you feel a debt was created in error, you can get information about
      disputing a debt online or by calling the DMC.
    </p>
  </>
);

export default NeedHelp;
