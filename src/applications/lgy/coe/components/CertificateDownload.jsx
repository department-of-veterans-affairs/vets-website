import React from 'react';
import { Link } from 'react-router';

export const CertificateDownload = props => (
  <div className="row vads-u-margin-bottom--1">
    <div className="medium-8 columns">
      <va-alert status="success">
        <h2 slot="headline" className="vads-u-font-size--h3">
          We have all the information we need for your COE
        </h2>
        <p className="vads-u-font-size--base">
          You don’t need to apply for a COE because we already have all the
          information we need. You can download your COE now.
        </p>
        <a className="vads-u-font-size--base" href="#">
          Download your COE (PDF) 0.20MB
        </a>
      </va-alert>
      <h2>What if I need to make changes to my COE?</h2>
      <p>
        If you need to make changes or corrections to your COE - or are applying
        for a restoration of entitlement - you’ll need to complete and submit VA
        Form 26-1880.
      </p>
      <Link to="/introduction" onClick={props.clickHandler}>
        Make changes online COE with VA Form 26-1880
      </Link>
    </div>
  </div>
);
