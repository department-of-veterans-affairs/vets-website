import React from 'react';

const SubwayMap = () => (
  <va-process-list class="vads-u-padding-bottom--0" uswds="false">
    <li>
      <h3>Check your service requirements</h3>
      <p>
        Make sure you meet our VA home loan eligibility requirements before you
        request a COE. You may be able to get a COE if you:
      </p>
      <ul>
        <li>
          Didn’t receive a dishonorable discharge, <strong>and</strong>
        </li>
        <li>Meet the minimum service requirement based on when you served</li>
      </ul>
      <a href="/housing-assistance/home-loans/eligibility">
        Eligibility requirements for VA home loan programs
      </a>
    </li>
    <li>
      <h3>Gather your information</h3>
      <p>Here’s what you’ll need to request a COE:</p>
      <ul>
        <li>
          Your Social Security number, date of birth and current contact
          information.
        </li>
        <li>
          The property location and dates of past VA loans (if you have or had a
          VA-backed loan)
        </li>
        <li>
          <strong>If you’re a Veteran,</strong> you’ll need a copy of your
          discharge or separation papers (DD214).
        </li>
        <li>
          <strong>If you’re an active-duty service member,</strong> you’ll need
          a statement of service—signed by your commander, adjutant, or
          personnel officer.
        </li>
        <li>
          <strong>
            If you’re a current or former activated National Guard or Reserve
            member,
          </strong>{' '}
          you’ll need a copy of your discharge or separation papers (DD214).
        </li>
        <li>
          <strong>
            If you’re a current member of the National Guard or Reserves who’s
            never been activated,
          </strong>{' '}
          you’ll need a statement of service—signed by your commander, adjutant,
          or personnel officer.
        </li>
        <li>
          <strong>
            If you’re a discharged member of the National Guard and were never
            activated,
          </strong>{' '}
          you’ll need your Report of Separation and Record of Service (NGB Form
          22) and your Retirement Points Statement (NGB Form 23).
        </li>
        <li>
          <strong>
            If you’re a discharged member of the Reserves who has never been
            activated,
          </strong>{' '}
          you’ll need a copy of your latest annual retirement points and proof
          of your honorable service.
        </li>
      </ul>
      <va-additional-info
        trigger="What’s a statement of service?"
        uswds="false"
      >
        <p>
          A statement of service—signed by your commander, adjutant, or
          personnel officer—is a letter showing this information:
        </p>
        <ul id="sos-info-list">
          <li>Your full name</li>
          <li>Your Social Security number</li>
          <li>Your date of birth</li>
          <li>The date you entered duty</li>
          <li>Your total number of creditable years of service</li>
          <li>The duration of any lost time</li>
          <li>The name of the command providing the information</li>
        </ul>
      </va-additional-info>
    </li>
    <li className="vads-u-padding-bottom--3">
      <h3>Start your request</h3>
      <p>
        Complete the form to request a VA home loan Certificate of Eligibility.
        It should take about 15 minutes.
      </p>
      <va-additional-info
        trigger="What happens after I request a COE?"
        uswds="false"
      >
        <p className="vads-u-margin-bottom--0p5">
          After submitting your request, you’ll get a confirmation message. It
          will include details about your next steps. We may contact you if we
          have questions or need more information.
          <br />
          <br />
          We process requests in the order we receive them. If you qualify for a
          Certificate of Eligibility, we’ll notify you by email about how you
          can get your COE document.
        </p>
      </va-additional-info>
    </li>
  </va-process-list>
);

export default SubwayMap;
