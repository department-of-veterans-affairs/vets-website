import React from 'react';
import Telephone from '@department-of-veterans-affairs/component-library/Telephone';

export const CoeNotApplicable = () => (
  <div className="row vads-u-margin-bottom--1">
    <div className="medium-8 columns">
      <va-alert status="info">
        <h2 slot="headline" className="vads-u-font-size--h3">
          We don’t have a COE on file for you
        </h2>
        <p>
          We can’t find a VA home loan Certificate of Eligibility for you. To
          apply for a COE, you’ll need to fill out and submit a Request for a
          Certificate of Eligibility (VA Form 26-1880)
        </p>
        <a href="/housing-assistance/home-loans/">
          Learn more about VA-backed home loans
        </a>
      </va-alert>
      <h2>Can I get a VA home loan COE?</h2>
      <p>
        You may be able to get a COE if you didn’t receive a dishonorable
        discharge and you meet the minimum active-duty service requirement based
        on when you served.
      </p>
      <a href="/housing-assistance/home-loans/eligibility/">
        Find out about eligibility requirements for VA home loan programs.
      </a>
      <p>
        know you qualify for a VA home loan COE and you have all the information
        we’ll need, you can apply online
      </p>
      <a
        className="vads-c-action-link--green"
        href="/housing-assistance/home-loans/apply-for-coe-form-26-1880/introduction"
      >
        Apply for a Certificate of Eligibility
      </a>
      <h3>
        You can also apply for a VA home loan COE through you lender or by mail
      </h3>
      <p>
        In some cases, you can get your COE through your lender using our WebLGY
        system. Ask your lender about this option.
      </p>
      <p>
        o apply by mail, fill out a Request for a Certificate of Eligibility (VA
        Form 26-1880) and mail it to the address listed on the form. Please keep
        in mind that this may take longer than applying online or through our
        Web LGY system.
      </p>
      <a href="/find-forms/about-form-26-1880/">Download VA form 26-1880</a>
      <h2>What if I have more questions?</h2>
      <p>
        If you have any questions that your lender can’t answer, please call
        your VA regional loan center at <Telephone contact="8778273702" /> We’re
        here Monday through Friday, 8:00 a.m. to 6:00 p.m. ET.
      </p>
      <a
        className="vads-u-margin-bottom--5 vads-u-display--block"
        href="https://benefits.va.gov/HOMELOANS/contact_rlc_info.asp"
      >
        Find your regional loan center
      </a>
    </div>
  </div>
);
