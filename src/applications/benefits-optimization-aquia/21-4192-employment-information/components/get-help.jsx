import React from 'react';

/**
 * GetHelp component for VA Form 21-4192
 * Displays contact information for assistance with the employment information form
 * @returns {JSX.Element} Help contact information component
 */
const GetHelp = () => (
  <div className="help-footer-box">
    <p>
      If you have questions about the Request for Employment Information form
      (VA Form 21-4192), please contact VA.
    </p>

    <va-accordion>
      <va-accordion-item header="By phone">
        <p>
          Call VA toll-free at <va-telephone contact="8008271000" /> (
          <va-telephone contact="711" tty />
          ). We’re here Monday through Friday, 8:00 a.m. to 9:00 p.m. ET.
        </p>
        <p>
          If you’re calling from outside the United States, call{' '}
          <va-telephone contact="8014065502" international />.
        </p>
      </va-accordion-item>

      <va-accordion-item header="By mail">
        <p>Send your completed application and any supporting documents to:</p>
        <p className="va-address-block">
          Department of Veterans Affairs
          <br />
          Evidence Intake Center
          <br />
          P.O. Box 4444
          <br />
          Janesville, WI 53547-4444
        </p>
      </va-accordion-item>

      <va-accordion-item header="Online">
        <p>
          You can upload this form online through your VA.gov account after
          signing in. Visit{' '}
          <a href="https://www.va.gov/disability/how-to-file-claim/additional-forms/">
            Additional forms for your disability claim
          </a>{' '}
          for more information.
        </p>
      </va-accordion-item>

      <va-accordion-item header="For employers">
        <p>
          If you’re an employer completing this form and have questions, you can
          contact VA at the phone numbers above. Please have the Veteran’s name
          and Social Security number or VA file number available when calling.
        </p>
      </va-accordion-item>

      <va-accordion-item header="Get help from a VSO">
        <p>
          Veterans Service Organizations (VSOs) and accredited representatives
          can help Veterans with their disability claims. To find an accredited
          representative, visit{' '}
          <a href="https://www.va.gov/ogc/accreditation.asp">
            VA’s Office of General Counsel Accreditation Search
          </a>
          .
        </p>
      </va-accordion-item>
    </va-accordion>

    <h3>Processing time</h3>
    <p>
      VA Form 21-4192 is processed as part of a Veteran’s Individual
      Unemployability (IU) claim. Processing times vary based on the complexity
      of the claim and current workload. Most IU claims are processed within 125
      days.
    </p>

    <h3>Related forms</h3>
    <ul>
      <li>
        <strong>VA Form 21-8940</strong>: Veteran’s Application for Increased
        Compensation Based on Unemployability
      </li>
      <li>
        <strong>VA Form 21-526EZ</strong>: Application for Disability
        Compensation and Related Compensation Benefits
      </li>
    </ul>
  </div>
);

export default GetHelp;
