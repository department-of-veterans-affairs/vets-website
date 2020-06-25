import React from 'react';

const HowDoIPay = () => (
  <>
    <h2 className="right-heading">How do I pay my debt?</h2>
    <p>
      You can pay your debt online, by phone, or by mail. If you can't pay the
      entirety of your debt or currently receive monthly benefits, call the Debt
      Management Center at{' '}
      <a href="tel: 800-827-0648" aria-label="800. 8 2 7. 0648.">
        800-827-0648.
      </a>{' '}
    </p>
    <h3 className="vads-u-margin-top--1 vads-u-font-size--h5">Online</h3>
    <p className="vads-u-margin-top--0">
      Pay directly from your bank account or by debit or credit card on the
      secure pay.gov website.
    </p>
    <h3 className="vads-u-margin-top--1 vads-u-font-size--h5">By phone</h3>
    <p className="vads-u-margin-bottom--0 vads-u-margin-top--0">
      Call us at{' '}
      <a href="tel: 800-827-0648" aria-label="800. 8 2 7. 0648.">
        800-827-0648.
      </a>{' '}
    </p>
    <p className="vads-u-margin-top--1">
      If calling internationally, use{' '}
      <a href="tel: 612-713-6415" aria-label="612. 7 1 3. 6415.">
        612-713-6415.
      </a>{' '}
    </p>
    <h3 className="vads-u-margin-top--1 vads-u-font-size--h5">By mail</h3>
    {/* ToDo: hyperlink the download text */}
    <p className="vads-u-margin-top--0">
      Find instructions on how to pay by mail in the demand letters sent to your
      address or download your most recent letter.
    </p>
  </>
);

export default HowDoIPay;
