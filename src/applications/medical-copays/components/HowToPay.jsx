import React from 'react';
import Telephone, {
  PATTERNS,
} from '@department-of-veterans-affairs/component-library/Telephone';

export const HowToPay = () => (
  <article className="vads-u-padding--0">
    <h2 id="how-to-pay">How do I pay my VA copay bill?</h2>
    <h3 className="vads-u-font-size--h5">
      You can pay your bill in any of these 4 ways:
    </h3>
    <div className="vads-u-margin-top--4">
      <va-accordion>
        <va-accordion-item header="Option 1: Pay online">
          <p>
            Pay directly from your bank account or by debit or credit card on
            the secure <a href="https://www.pay.gov/">Pay.gov website</a>.
          </p>
          <p>
            You will need to provide an account number to pay this debt online:
          </p>
          <p>
            <strong>Account Number: </strong>
            [##########]
          </p>
          <a className="vads-c-action-link--blue" href="https://www.pay.gov/">
            Pay your copay bill online at pay.gov
          </a>
          <p>
            If you need help making a payment online, call us at
            <Telephone
              contact={'888-827-4817'}
              className="vads-u-margin-x--0p5"
            />
            . We’re available Monday through Friday, 8:00am - 8:00pm EST.
          </p>
        </va-accordion-item>
        <va-accordion-item header="Option 2: Pay by phone">
          <p>
            Call us at <Telephone contact={'888-827-4817'} /> (or
            <Telephone
              className="vads-u-margin-x--0p5"
              contact={'1-555-555-5555'}
              pattern={PATTERNS.OUTSIDE_US}
            />
            if overseas) We’re here Monday through Friday, 8:00 a.m. to 8:00
            p.m. ET.
          </p>
          <p>
            You will need to provide an account number to pay this debt online:
          </p>
          <p>
            <strong>Account Number: </strong>
            [##########]
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
            <strong>Note: </strong> You’ll find these stubs at the bottom of
            each statement. If you don’t have your most recent statement, you
            can download and print it below or include a note listing the
            facility you’d like to pay.
          </p>
          <p>
            <strong>
              Print this information on each check or money order:
            </strong>
          </p>
          <ul>
            <li>Your full name</li>
            <li>Your account number [##########]</li>
            <li>The facility you’d like to pay [Facility name]</li>
          </ul>
          <p>
            <strong>Mail your payment and remittance stubs to:</strong>
          </p>
          <div className="vads-u-margin-left--4 vads-u-margin-bottom--4 vads-u-padding-left--1 vads-u-border-left--5px vads-u-border-color--primary">
            <div>Department of Veterans Affairs</div>
            <div>PO Box 3978</div>
            <div>Portland, OR 97208-3978</div>
          </div>
        </va-accordion-item>
        <va-accordion-item header="Option 4: Pay in person">
          <p>
            Visit your nearest VA medical center, and ask for the agent
            cashier’s office. Bring your payment stub, along with a check or
            money order made payable to "VA". Be sure to include your account
            number on the check or money order.
          </p>
          <p>
            <strong>Note: </strong> You’ll find these stubs at the bottom of
            each statement. If you don’t have your most recent statement, you
            can download and print it below or include a note listing the
            facility you’d like to pay.
          </p>
          <p>
            <strong>Account Number: </strong>
            [##########]
          </p>
          <a className="vads-c-action-link--blue" href="#">
            Find your nearest VA medical center
          </a>
        </va-accordion-item>
      </va-accordion>
    </div>
  </article>
);

export default HowToPay;
