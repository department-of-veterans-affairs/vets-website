import React from 'react';

import { getAppUrl } from 'platform/utilities/registry-helpers';

import { MoreQuestions } from './MoreQuestions';

const coeUrl = getAppUrl('coe');
const introUrl = `${coeUrl}/introduction`;

export const CoeIneligible = () => (
  <div className="row vads-u-margin-bottom--7">
    <div className="medium-8 columns">
      <va-alert status="info">
        <h2 slot="headline" className="vads-u-font-size--h3">
          We don’t have a COE on file for you
        </h2>
        <p>
          We can’t find a VA home loan Certificate of Eligibility for you. To
          request a COE, you’ll need to fill out and submit a Request for a
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
        <br />
        <a href="/housing-assistance/home-loans/eligibility/">
          Find out about eligibility requirements for VA home loan programs.
        </a>
      </p>
      <p>
        If you already know you qualify for a VA home loan COE and you have all
        the information we’ll need, you can request a COE online.
      </p>
      <a className="vads-c-action-link--green" href={introUrl}>
        Request a Certificate of Eligibility
      </a>
      <h3>
        You can also request a VA home loan COE through your lender or by mail
      </h3>
      <p>
        In some cases, you can get your COE through your lender using our WebLGY
        system. Ask your lender about this option.
      </p>
      <p>
        To request a COE by mail, fill out a Request for a Certificate of
        Eligibility (VA Form 26-1880) and mail it to the address listed on the
        form. Please keep in mind that this may take longer than requesting a
        COE online or through our WebLGY system.
      </p>
      <a href="/find-forms/about-form-26-1880/">
        <i
          aria-hidden="true"
          className="fas fa-download vads-u-padding-right--1"
        />
        Download VA form 26-1880 (PDF)
      </a>
      <MoreQuestions />
    </div>
  </div>
);
