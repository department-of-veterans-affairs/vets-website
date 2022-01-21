import React from 'react';
import { Link } from 'react-router';

import { MoreQuestions } from './MoreQuestions';

export const CoeEligible = props => (
  <div className="row vads-u-margin-bottom--7">
    <div className="medium-8 columns">
      <va-alert status="success">
        <h2 slot="headline" className="vads-u-font-size--h3">
          Congratulations on your automatic COE
        </h2>
        <p>
          We have all the information we need, so you don’t need to fill out an
          application. You can download your COE now.
        </p>
      </va-alert>
      <h2>Review and download your COE</h2>
      <p>
        You can download your COE right now. If you need help, go to our
        instructions for how to download and open a VA.gov PDF form.
        <br />
        <a href="/resources/how-to-download-and-open-a-vagov-pdf-form/">
          Get instructions for downloading your PDF
        </a>
      </p>
      <a
        className="vads-u-font-size--base vads-u-display--block vads-u-margin-top--2"
        href={props.downloadURL}
      >
        <i
          aria-hidden="true"
          className="fas fa-download vads-u-padding-right--1"
        />
        Download your COE (PDF) 0.20MB
      </a>
      <h2>What if I need to make changes to my COE?</h2>
      <p>
        Complete and submit a Request for a Certificate of Eligibility (VA Form
        26-1880) if you need to:
      </p>
      <ul>
        <li>
          Make changes to your COE (correct an error or update your
          information), or
        </li>
        <li>Request a restoration of entitlement</li>
      </ul>
      <Link to="/introduction" onClick={props.clickHandler}>
        Make changes to your COE online by filling out VA Form 26-1880
      </Link>
      <MoreQuestions />
    </div>
  </div>
);
