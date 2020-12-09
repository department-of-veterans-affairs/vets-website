import React from 'react';

export const ViewRepresentativeDetails = props => (
  <>
    <h2 className="vads-u-margin-top--1p5">
      Your selected representative for VA claims
    </h2>
    <div className="vads-u-background-color--gray-lightest vads-u-margin-top--0 vads-u-margin-bottom--2 vads-u-padding-top--1 vads-u-padding-bottom--2 vads-u-padding-x--2 vads-u-font-size--md vads-u-font-family--sans">
      <h3 className="vads-u-margin-top--1p5">{props.name}</h3>
      <p className="vads-u-margin-y--0p5">{props.address.street}</p>
      <p className="vads-u-margin-y--0p5">
        {props.address.city}, {props.address.state} {props.address.postalCode}
      </p>
      <p className="vads-u-margin-y--0p5">
        <strong>Phone: </strong>
        {props.telephone}
      </p>
    </div>
    <h3>What can a representative do?</h3>
    <p>
      A recognized representative can file a claim or appeal on your behalf, or
      help you gather supporting documents (like a doctor’s report or medical
      test results). A representative can also provide added support, like help
      getting transportation or emergency funds.
    </p>
    <p>
      <strong>
        Accredited representatives and VSOs can help you understand and apply
        for VA benefits, like:
      </strong>
    </p>
    <ul>
      <li>Financial support (monthly payments)</li>
      <li>Education</li>
      <li>Vocational Rehabilitation & Employment (VR&E)</li>
      <li>Home loans</li>
      <li>Life insurance</li>
      <li>Pension</li>
      <li>Health care</li>
      <li>Burial benefits</li>
    </ul>
    <p>
      VSOs work on behalf of Veterans and service members, as well as their
      dependents and survivors.{' '}
      <a href="/disability/get-help-filing-claim/">
        Find out more about accredited representatives
      </a>
    </p>
  </>
);
