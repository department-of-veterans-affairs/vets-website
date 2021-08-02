import React from 'react';
import Telephone from '@department-of-veterans-affairs/component-library/Telephone';

export const HowToPay = () => (
  <>
    <h2>How do I pay my VA copay bill?</h2>
    <h5>You can pay your bill in any of these 4 ways:</h5>
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
            ##########
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
          Lorem ipsum dolor sit amet consectetur, adipisicing elit. Fuga
          voluptatem numquam ipsum praesentium consequuntur recusandae modi
          sequi expedita odio, perferendis distinctio facere odit a eligendi
          esse saepe assumenda libero iste.
        </va-accordion-item>
        <va-accordion-item header="Option 3: Pay by mail">
          Lorem ipsum dolor sit amet consectetur, adipisicing elit. Fuga
          voluptatem numquam ipsum praesentium consequuntur recusandae modi
          sequi expedita odio, perferendis distinctio facere odit a eligendi
          esse saepe assumenda libero iste.
        </va-accordion-item>
        <va-accordion-item header="Option 4: Pay in person">
          Lorem ipsum dolor sit amet consectetur, adipisicing elit. Fuga
          voluptatem numquam ipsum praesentium consequuntur recusandae modi
          sequi expedita odio, perferendis distinctio facere odit a eligendi
          esse saepe assumenda libero iste.
        </va-accordion-item>
      </va-accordion>
    </div>
  </>
);

export default HowToPay;
