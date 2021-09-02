import React from 'react';
import { Link } from 'react-router';
import Telephone from '@department-of-veterans-affairs/component-library/Telephone';

export const CoeEligible = props => (
  <div className="row vads-u-margin-bottom--1">
    <div className="medium-8 columns">
      <va-alert status="success">
        <h2 slot="headline" className="vads-u-font-size--h3">
          We have all the information we need for your COE
        </h2>
        <p className="vads-u-font-size--base">
          We have all the information we need, so you don’t need to fill out an
          application. You can download your COE now.
        </p>
      </va-alert>
      <h2>Review and download your COE</h2>
      <p className="vads-u-margin-bottom--0">
        You can download your COE right now. If you need help, go to our
        instructions for how to download and open a VA.gov PDF form.
      </p>
      <a href="/resources/how-to-download-and-open-a-vagov-pdf-form/">
        Get instructions for downloading your PDF
      </a>
      <a
        className="vads-u-font-size--base vads-u-display--block vads-u-margin-top--2"
        href="#"
      >
        <i
          aria-hidden="true"
          role="img"
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
        <li>Apply for a restoration of entitlement</li>
      </ul>
      <Link to="/introduction" onClick={props.clickHandler}>
        Make changes online COE with VA Form 26-1880
      </Link>
      <h2>What if I have more questions?</h2>
      <p>
        If you have any questions that your lender can’t answer, please call
        your VA regional loan center at <Telephone contact={'877-827-3702'} />.
        We’re here Monday through Friday, 8:00 a.m. to 6:00 p.m. ET.{' '}
        <a
          target="_blank"
          rel="noopener noreferrer"
          href="https://www.benefits.va.gov/HOMELOANS/contact_rlc_info.asp"
        >
          Find your regional loan center
        </a>
      </p>
    </div>
  </div>
);
