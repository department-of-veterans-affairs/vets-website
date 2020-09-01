import React from 'react';

const NeedHelp = () => (
  <div className="vads-u-font-family--sans vads-u-margin-top--4">
    <h3 className="right-heading vads-u-margin-top--0">Need help?</h3>
    <p>
      Call the Debt Management Center between 6:30 a.m. and 6:00 p.m. CT using
      the numbers below:
    </p>
    <p className="vads-u-margin-top--0">
      Toll-free:{' '}
      <a href="tel: 800-827-0648" aria-label="800. 8 2 7. 0648.">
        800-827-0648
      </a>
      {'.'}
    </p>
    <p className="vads-u-margin-top--0">
      International:{' '}
      <a href="tel: 612-713-6415" aria-label="612. 7 1 3. 6415.">
        612-713-6415
      </a>
      {'.'}
    </p>
    <h5 className="vads-u-margin-top--1 ">Request financial assistance</h5>
    <p className="vads-u-margin-top--0">
      If you need financial help, you may request an extended monthly payment
      plan, compromise, or a waiver. Call the DMC to discuss your options and
      next steps.
    </p>
    <h5 className="vads-u-margin-top--1">Dispute a debt</h5>
    {/* ToDo: add debt dispute link */}
    <p className="vads-u-margin-top--0">
      If you think a debt was created in error, you can dispute it. Call the DMC
      to get more information.
    </p>
  </div>
);

export default NeedHelp;
