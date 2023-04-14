import React from 'react';

const NeedHelp = () => (
  <article className="vads-u-font-family--sans">
    <h2
      id="howDoIGetHelp"
      className="vads-u-margin-top--4 vads-u-margin-bottom--0"
    >
      How do I get financial help?
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

    <p>
      You may be required to submit a financial status report. Call the DMC at
      <va-telephone className="vads-u-margin-x--0p5" contact="8008270648" />
      between 6:30 a.m. and 6:00 p.m. CT to discuss your options and next steps.
      For international callers, use
      <va-telephone
        className="vads-u-margin-left--0p5"
        contact="6127136415"
        international
      />
      .
    </p>
    <a href="/manage-va-debt/request-debt-help-form-5655/">
      Find information about submitting a financial status report
    </a>

    <section>
      <h2
        id="howDoIDispute"
        className="vads-u-margin-top--4 vads-u-margin-bottom--0"
      >
        How do I dispute a debt?
      </h2>
      <p className="vads-u-margin-top--2">
        If you think a debt was created in error, you can dispute it. Get
        information about disputing a debt by calling the DMC at
        <va-telephone className="vads-u-margin-x--0p5" contact="8008270648" />
        between 6:30 a.m. and 6:00 p.m. CT. For international callers, use
        <va-telephone
          className="vads-u-margin-left--0p5"
          contact="6127136415"
          international
        />
        .
      </p>
    </section>
  </article>
);

export default NeedHelp;
