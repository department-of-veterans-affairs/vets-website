import React from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';

const HowDoIPay = ({ userData }) => (
  <article className="vads-u-font-family--sans vads-u-padding-x--0">
    <h2 id="howDoIPay" className="vads-u-margin-top--4 vads-u-margin-bottom-2">
      How to pay your VA debt
    </h2>

    <p className="vads-u-margin-top--0">
      You can pay your debt online, by phone, or by mail. If you can’t pay all
      of your debt or if you currently receive monthly benefits, call the Debt
      Management Center at <va-telephone contact="8008270648" />.
    </p>
    <va-accordion
      uswds
      disable-analytics={{
        value: 'false',
      }}
      section-heading={{
        value: 'null',
      }}
    >
      <va-accordion-item id="first" uswds>
        <h3 className="vads-u-font-size--base" slot="headline">
          Option 1: Pay online
        </h3>
        <p>
          You can pay directly from your bank account or by debit or credit card
          on the secure{' '}
          <a
            aria-label="Pay.gov - Opens in new window"
            target="_blank"
            href="https://www.pay.va.gov/"
            rel="noreferrer"
          >
            pay.va.gov
          </a>{' '}
          website.
        </p>
        <p>
          You will need to provide the following details to pay this debt
          online:
        </p>

        {userData ? (
          <ul className="no-bullets">
            <li>
              <strong>File Number: </strong>
              {userData.fileNumber}
            </li>
            <li>
              <strong>Payee Number: </strong>
              {userData.payeeNumber}
            </li>
            <li>
              <strong>Person Entitled: </strong>
              {userData.personEntitled}
            </li>
            <li>
              <strong>Deduction Code: </strong>
              {userData.deductionCode}
            </li>
          </ul>
        ) : (
          <ul>
            <li>File Number</li>
            <li>Payee Number</li>
            <li>Person Entitled</li>
            <li>Deduction Code</li>
          </ul>
        )}

        <a className="vads-c-action-link--blue" href="https://www.pay.va.gov/">
          Pay on pay.va.gov
        </a>
      </va-accordion-item>
      <va-accordion-item header="Option 2: Pay by phone" id="second" uswds>
        <p>
          Call us at{' '}
          <va-telephone
            className="vads-u-margin-left--0p5"
            contact="8008270648"
          />
          .
        </p>
        <p>
          If calling internationally, use{' '}
          <va-telephone contact="6127136415" international />.
        </p>
      </va-accordion-item>
      <va-accordion-item header="Option 3: Pay by mail" id="third" uswds>
        <p className="vads-u-margin-y--0">
          Find instructions on how to pay by mail in the demand letter sent to
          your address or you can
          <Link className="vads-u-margin-left--0p5" to="/debt-balances/letters">
            download them online
          </Link>
          .
        </p>
      </va-accordion-item>
    </va-accordion>
  </article>
);

HowDoIPay.propTypes = {
  userData: PropTypes.shape({
    fileNumber: PropTypes.string,
    payeeNumber: PropTypes.string,
    personEntitled: PropTypes.string,
    deductionCode: PropTypes.string,
  }),
};

export default HowDoIPay;
