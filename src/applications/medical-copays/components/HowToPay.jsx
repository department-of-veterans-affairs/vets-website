import React from 'react';
import PropTypes from 'prop-types';

export const HowToPay = ({ acctNum, facility }) => (
  <article className="vads-u-padding--0" data-testid="how-to-pay">
    <h2 id="how-to-pay">How do I pay my VA copay bill?</h2>
    <h3 className="vads-u-font-size--h5 vads-u-margin-bottom--3">
      You can pay your bill in any of these 4 ways:
    </h3>
    <va-accordion>
      <va-accordion-item header="Option 1: Pay online">
        <p>
          Pay directly from your bank account or by debit or credit card on the
          secure
          <a
            className="vads-u-margin-left--0p25"
            href="https://www.pay.gov/public/form/start/25987221"
            aria-label="Pay.gov - Opens in new window"
            target="_blank"
            rel="noopener noreferrer"
          >
            Pay.gov website
          </a>
          .
        </p>
        <p>
          You will need to provide an account number to pay this debt online:
        </p>
        <p>
          <strong>Account Number: </strong>
          {acctNum}
        </p>
        <a
          className="vads-c-action-link--blue"
          href="https://www.pay.gov/public/form/start/25987221"
          aria-label="Pay.gov - Opens in new window"
          target="_blank"
          rel="noopener noreferrer"
        >
          Pay your copay bill online at pay.gov
        </a>
        <p>
          If you need help making a payment online, call us at
          <va-telephone
            contact="8888274817"
            className="vads-u-margin-left--0p5"
          />
          . We’re available Monday through Friday, 8:00am - 8:00pm EST.
        </p>
      </va-accordion-item>
      <va-accordion-item header="Option 2: Pay by phone">
        <p>
          Call us at <va-telephone contact="8888274817" />. We’re here Monday
          through Friday, 8:00 a.m. to 8:00 p.m. ET.
        </p>
        <p>You will need to provide an account number.</p>
        <p>
          <strong>Account Number: </strong>
          {acctNum}
        </p>
      </va-accordion-item>
      <va-accordion-item header="Option 3: Pay by mail">
        <p>Please send us these items:</p>
        <ul>
          <li>
            A check or money order (made payable to the "U.S. Department of
            Veterans Affairs"), <strong>and</strong>
          </li>
          <li>The payment remittance stub for your bill</li>
        </ul>
        <p>
          <strong>Note: </strong> You’ll find these stubs at the bottom of each
          statement. If you don’t have your most recent statement, you can
          download and print it above or include a note listing the facility
          you’d like to pay.
        </p>
        <p>
          <strong>Print this information on each check or money order:</strong>
        </p>
        <ul>
          <li>Your full name</li>
          <li>Your account number: {acctNum}</li>
        </ul>
        <p>
          <strong>Mail your payment and remittance stubs to:</strong>
        </p>
        <p className="va-address-block">
          Department of Veterans Affairs
          <br />
          PO Box 3978
          <br />
          Portland, OR 97208-3978
          <br />
        </p>
      </va-accordion-item>
      <va-accordion-item header="Option 4: Pay in person">
        <p>
          Visit {facility?.facilityName}, and ask for the agent cashier’s
          office. Bring your payment stub, along with a check or money order
          made payable to "VA". Be sure to include your account number on the
          check or money order.
        </p>
        <p>
          <strong>Note: </strong>
          You’ll find these stubs at the bottom of each statement. If you don’t
          have your most recent statement, you can download and print it above.
        </p>
        <p>
          <strong>Account Number: </strong>
          {acctNum}
        </p>
        <p>
          <strong>Your facility’s address:</strong>
        </p>
        <p className="va-address-block">
          {facility?.facilityName}
          <br />
          {facility?.staTAddress1}
          <br />
          {facility?.city}, {facility?.state}
          <span className="vads-u-margin-x--0p5">
            {facility?.ziPCde.substring(0, 5)}-{facility?.ziPCde.substring(5)}
          </span>
          <br />
        </p>
      </va-accordion-item>
    </va-accordion>
  </article>
);

HowToPay.propTypes = {
  acctNum: PropTypes.string,
  facility: PropTypes.shape({
    facilityName: PropTypes.string,
    staTAddress1: PropTypes.string,
    city: PropTypes.string,
    state: PropTypes.string,
    ziPCde: PropTypes.string,
  }),
};

export default HowToPay;
