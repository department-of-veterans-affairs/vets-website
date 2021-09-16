import React from 'react';

const COEAutomatic = () => (
  <>
    <va-alert status="success">
      <h3 slot="headline">Congratulations on your automatic COE</h3>
      <div>
        <p>
          We have all the information we need, so you don’t need to fill out an
          application. You can download your COE now.
        </p>
      </div>
    </va-alert>
    <div>
      <h2>Review and download your COE</h2>
      <p>
        You can download your COE right now. If you need help, go to our
        instructions for how to download and open a VA.gov PDF form.
      </p>
      <a href="#">Get instructions for downloading a VA.gov PDF</a>
    </div>
    <div className="vads-u-padding-top--4">
      <a href="#">
        <i className="fas fa-download vads-u-padding-right--1" /> Download your
        COE (PDF) 0.20MB
      </a>
    </div>
    <div>
      <h2>What if my COE has errors?</h2>
      <p>What if I need to make changes to my COE?</p>
      <ul>
        <li>
          Make changes to your COE (correct an error or update your
          information), <strong>or</strong>
        </li>
        <li>Apply for a restoration of entitlement</li>
      </ul>
    </div>
  </>
);

export default COEAutomatic;
