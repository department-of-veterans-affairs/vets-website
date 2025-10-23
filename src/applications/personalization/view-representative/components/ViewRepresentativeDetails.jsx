import React from 'react';
import { CONTACTS } from '@department-of-veterans-affairs/component-library/contacts';

export const ViewRepresentativeDetails = props => (
  <>
    <h2 className="vads-u-font-size--h3 vads-u-margin-top--6">On this page</h2>
    {/* eslint-disable-next-line jsx-a11y/no-redundant-roles */}
    <ul className="usa-unstyled-list vads-u-margin-top--2" role="list">
      <li>
        <a href="#selectedRepresentative">
          <va-icon
            icon="arrow_downward"
            size={3}
            className="va-c-font-size--xs vads-u-margin-top--1 vads-u-margin-right--1"
            aria-hidden="true"
          />
          Your selected representative for claims
        </a>
      </li>
      <li className="vads-u-margin-top--3">
        <a href="#whatCanRepresentativeDo">
          <va-icon
            icon="arrow_downward"
            size={3}
            className="va-c-font-size--xs vads-u-margin-top--1 vads-u-margin-right--1"
            aria-hidden="true"
          />
          What can a representative do?
        </a>
      </li>
      <li className="vads-u-margin-top--3">
        <a href="#whatDoesItCost">
          <va-icon
            icon="arrow_downward"
            size={3}
            className="va-c-font-size--xs vads-u-margin-top--1 vads-u-margin-right--1"
            aria-hidden="true"
          />
          What does it cost to use a recognized representative or a VSO?
        </a>
      </li>
      <li className="vads-u-margin-top--3">
        <a href="/">
          <va-icon
            icon="arrow_downward"
            size={3}
            className="va-c-font-size--xs vads-u-margin-top--1 vads-u-margin-right--1"
            aria-hidden="true"
          />
          Need help?
        </a>
      </li>
    </ul>
    <h2 id="selectedRepresentative" className="vads-u-margin-top--5">
      Your selected representative for VA claims
    </h2>

    <div className="vads-u-background-color--gray-lightest vads-u-margin-top--4 vads-u-margin-bottom--2 vads-u-padding-top--1 vads-u-padding-bottom--2 vads-u-padding-x--2 vads-u-font-size--md vads-u-font-family--sans">
      <h3 className="vads-u-margin-top--1p5">{props.name}</h3>
      <p className="vads-u-margin-y--0p5">{props.address.street}</p>
      <p className="vads-u-margin-y--0p5">
        {props.address.city}, {props.address.state} {props.address.postalCode}
      </p>
      <p className="vads-u-margin-y--0p5">
        <strong>Phone: </strong>
        {props.telephone}
      </p>
      {props?.searchRepresentative && (
        <a
          role="button"
          target="_self"
          className="usa-button"
          href="/view-change-representative/search"
        >
          Find a new representative
        </a>
      )}
    </div>
    <h2 className="vads-u-font-size--h3" id="whatCanRepresentativeDo">
      What can a representative do?
    </h2>
    <p>
      A recognized representative can file a claim or appeal on your behalf, or
      help you gather supporting documents (like a doctor’s report or medical
      test results). A representative can also provide added support, like help
      getting transportation or emergency funds.
    </p>
    <va-additional-info trigger="What are some examples of what a representative can do?">
      <ul>
        <li className="vads-u-margin-top--3">
          Financial support (monthly payments)
        </li>
        <li className="vads-u-margin-top--2">Education</li>
        <li className="vads-u-margin-top--2">
          Vocational Rehabilitation & Employment (VR&E)
        </li>
        <li className="vads-u-margin-top--2">Home loans</li>
        <li className="vads-u-margin-top--2">Life insurance</li>
        <li className="vads-u-margin-top--2">Pension</li>
        <li className="vads-u-margin-top--2">Health care</li>
        <li className="vads-u-margin-top--2">Burial benefits</li>
      </ul>
    </va-additional-info>

    <p>
      VSOs work on behalf of Veterans and service members, as well as their
      dependents and survivors.{' '}
      <a href="/disability/get-help-filing-claim/">
        Find out more about accredited representatives
      </a>
    </p>

    <h2 id="whatDoesItCost" className="vads-u-font-size--h3">
      What does it cost to use a recognized representative or a VSO?
    </h2>
    <p>
      No one should charge you a fee to help you file your application for
      benefits, but they may charge you for unusual expenses. Representatives
      may charge for their services only after we’ve made a decision about your
      original claim. Ask up front what fees you’ll be charged. If you believe a
      claims agent or attorney charged a fee that is too high, you can challenge
      it.
    </p>
    <div className="help-footer-box">
      <h2
        className="help-heading vads-u-border-bottom--3px vads-u-border-color--link-default vads-u-font-size--h3 vads-u-padding-bottom--1
"
      >
        Need help?
      </h2>

      <p className="help-talk">
        If you have questions about your selected representative, please call
        our MYVA411 main information line at
        <va-telephone contact={CONTACTS.VA_BENEFITS} /> and select 0. We’re here
        24/7. If you have hearing loss, call{' '}
        <va-telephone contact={CONTACTS['711']} tty />.
      </p>
    </div>
  </>
);
