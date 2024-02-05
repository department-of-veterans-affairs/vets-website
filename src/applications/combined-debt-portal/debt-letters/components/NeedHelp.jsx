import React from 'react';

const NeedHelp = () => (
  <article className="vads-u-font-family--sans vads-u-padding-x--0">
    <h2
      id="howDoIGetHelp"
      className="vads-u-margin-top--4 vads-u-margin-bottom--0"
    >
      How to get financial help
    </h2>

    <p className="vads-u-margin-top--2">
      If you need financial help, you can request:
    </p>

    <ul>
      <li>
        An extended monthly payment plan, <strong>or</strong>
      </li>
      <li>
        A compromise (ask us to accept a lower amount of money as full payment
        of the debt), <strong>or</strong>
      </li>
      <li>A waiver (ask us to stop collection on the debt)</li>
    </ul>
    <a
      className="vads-c-action-link--blue"
      href="/manage-va-debt/request-debt-help-form-5655/"
    >
      Request help with your debt
    </a>

    <section>
      <h2
        id="howDoIDispute"
        className="vads-u-margin-top--4 vads-u-margin-bottom--0"
      >
        How to dispute a debt
      </h2>
      <p className="vads-u-margin-top--2">
        If you think a debt was created in error, you can dispute it. Get
        information about disputing a debt by calling the DMC at{' '}
        <va-telephone contact="8008270648" uswds /> between 6:30 a.m. and 6:00
        p.m. CT. For international callers, use{' '}
        <va-telephone contact="6127136415" international uswds />.
      </p>
    </section>
  </article>
);

export default NeedHelp;
