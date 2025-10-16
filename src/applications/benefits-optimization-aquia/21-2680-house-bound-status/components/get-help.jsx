import React from 'react';

/**
 * GetHelp component for VA Form 21-2680
 * Displays contact information for assistance with Aid and Attendance or Housebound benefits
 * @returns {JSX.Element} Help contact information component
 */
const GetHelp = () => (
  <div className="help-footer-box">
    <p>
      If you have questions about the Examination for Housebound Status or
      Permanent Need for Regular Aid & Attendance, please contact us.
    </p>

    <va-accordion>
      <va-accordion-item header="By phone">
        <h4>
          For general questions about Aid and Attendance or Housebound benefits
        </h4>
        <p>
          Call us at <va-telephone contact="8008271000" /> (
          <va-telephone contact="711" tty />
          ). We’re here Monday through Friday, 8:00 a.m. to 9:00 p.m. ET.
        </p>

        <h4>For questions about your specific claim</h4>
        <p>
          Call your VA regional office. You can find your regional office’s
          phone number on our website.{' '}
          <a href="/find-locations/">Find a VA location</a>
        </p>
      </va-accordion-item>

      <va-accordion-item header="By mail">
        <p>Send your completed examination form to your VA regional office.</p>
        <p>
          <a href="/find-locations/">
            Find your VA regional office’s mailing address
          </a>
        </p>
      </va-accordion-item>

      <va-accordion-item header="In person">
        <p>
          Visit your nearest VA regional office or VA medical center. Bring your
          completed form and any supporting documents.
        </p>
        <p>
          <a href="/find-locations/">Find a VA location near you</a>
        </p>
      </va-accordion-item>

      <va-accordion-item header="Get help from a VSO">
        <p>
          A Veterans Service Organization (VSO) or accredited representative can
          help you understand and apply for Aid and Attendance or Housebound
          benefits.
        </p>
        <p>
          <a href="/disability/get-help-filing-claim/">
            Get help filing your claim
          </a>
        </p>
      </va-accordion-item>
    </va-accordion>

    <h3>Important information about this form</h3>
    <ul>
      <li>
        <strong>Two-part form:</strong> The claimant completes Sections I-V,
        then a qualified medical professional (MD, DO, PA, or APRN) must
        complete Sections VI-VIII
      </li>
      <li>
        <strong>SMC vs SMP:</strong> Special Monthly Compensation (SMC) is for
        Veterans with service-connected disabilities, while Special Monthly
        Pension (SMP) is for Veterans or survivors receiving Pension benefits
      </li>
      <li>
        <strong>Processing time:</strong> The review process typically takes 3-6
        months
      </li>
    </ul>

    <h3>Benefit rates</h3>
    <p>
      Aid and Attendance and Housebound benefits provide additional monthly
      payments above your regular compensation or pension. The exact amount
      depends on your specific situation.
    </p>
    <p>
      <a href="/disability/compensation-rates/">
        View current VA disability compensation rates
      </a>
    </p>
  </div>
);

export default GetHelp;
