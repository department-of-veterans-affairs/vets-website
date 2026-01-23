import React from 'react';

import { isClaimingNew, isClaimingIncrease } from '../utils';

export const supportingEvidenceOrientationLegacy = ({ formData }) => (
  <div>
    <p>
      Next, we’ll ask you about evidence we’ll need to support these claims:
    </p>
    <ul>
      {isClaimingNew(formData) && (
        <li>New claims for conditions related to your military service</li>
      )}
      {isClaimingIncrease(formData) && (
        <li>Rated service-connected conditions that have gotten worse</li>
      )}
    </ul>
    <p>You can submit these types of evidence:</p>
    <ul>
      <li>
        Records from treatment providers like doctor’s reports, X-rays, or test
        results
      </li>
      <li>Official incident reports</li>
      <li>
        Lay or witness statements from family or service members (also called
        buddy statements)
      </li>
    </ul>
    <p>
      <strong>Note: </strong>
      You only need to submit new evidence that we don’t already have.
    </p>
    <va-alert status="info">
      <h3>Notice of evidence needed</h3>
      <p>
        We’re required by law to tell you what evidence you’ll need to submit to
        support your disability claim.
      </p>
      <p>
        We refer to this notice of evidence requirements as the “section 5103
        notice.”
      </p>
      <p>
        <va-link
          external
          href="https://www.va.gov/disability/how-to-file-claim/evidence-needed/"
          text="Learn about what evidence you’ll need"
        />
      </p>
    </va-alert>
  </div>
);

// new enahnced version followed by accordion
export const supportingEvidenceOrientationAlert = ({ formData }) => (
  <>
    <va-alert status="info" class="vads-u-margin-top--3">
      <h3>Notice of evidence needed</h3>
      <p>
        By law, section 5103, we must tell you what evidence you’ll need to
        support your claim.
      </p>
      <p>
        <va-link
          external
          href="https://www.va.gov/disability/how-to-file-claim/evidence-needed/"
          text="Learn about what evidence you’ll need"
        />
      </p>
    </va-alert>
    <p>
      Next, we’ll ask you about evidence we’ll need to support these claims:
    </p>
    <ul>
      {(isClaimingNew(formData) || isClaimingIncrease(formData)) && (
        <>
          <li>
            Medical records about your conditions, <strong>and</strong>
          </li>
          <li>
            Supporting documents and additional forms that support your claim
          </li>
        </>
      )}
    </ul>
    <p>
      <strong>Note: </strong>
      You only need to submit new evidence that we don’t already have.
    </p>
  </>
);

// Accordion content for additional supporting documents and forms
export const additionalSupportAccordion = (
  <va-accordion open-single>
    <va-accordion-item
      bordered
      class="vads-u-margin-y--1"
      header="Where supporting documents may come from and additional forms"
      id="first"
    >
      <h3 className="vads-u-font-size--h5 vads-u-margin-y--0">
        Records of receiving care
      </h3>
      <ul>
        <li>Civilian physicians or caregivers</li>
        <li>Counseling facilities or health clinics</li>
        <li>Sexual trauma crisis centers or centers for domestic abuse</li>
      </ul>
      <h3 className="vads-u-font-size--h5 vads-u-margin-y--0">
        Buddy or lay statements, also called written testimonials
      </h3>
      <ul>
        <li>Family members or roommates</li>
        <li>Faculty members</li>
        <li>Fellow service members</li>
        <li>Chaplains or clergy members</li>
      </ul>
      <h3 className="vads-u-font-size--h5 vads-u-margin-y--0">
        Civilian police reports
      </h3>
      <ul>
        <li>Police headquarters</li>
        <li>Local precincts</li>
      </ul>
      <h3 className="vads-u-font-size--h5 vads-u-margin-y--0">
        Personal accounts and other correspondence
      </h3>
      <ul>
        <li>Personal journal or diary entries</li>
        <li>Emails, messages, or letters</li>
      </ul>
      <h3 className="vads-u-font-size--h5 vads-u-margin-y--0">
        Additional forms
      </h3>
      <ul>
        <li>Requests for increased compensation if you can’t work</li>
        <li>Requests for an automobile allowance</li>
        <li>
          Applications for an adaptive-equipment grant for your automobile
        </li>
      </ul>
      <p>
        <va-link
          external
          href="https://www.va.gov/disability/how-to-file-claim/additional-forms/"
          text="Learn more about the additional forms you can submit"
        />
      </p>
    </va-accordion-item>
  </va-accordion>
);

export const mentalHealthSupportAlert = () => {
  return (
    <va-alert-expandable
      status="info"
      trigger="Get mental health and military sexual trauma support anytime"
      class="vads-u-margin-top--3"
    >
      <p>
        We can connect you with free, confidential support for mental health
        care or military sexual trauma anytime. We can connect you with support
        even if you don’t file a claim for disability compensation or you aren’t
        eligible for compensation.
      </p>
      <p>
        <va-link
          external
          href="https://www.va.gov/health-care/health-needs-conditions/mental-health/"
          text="Learn how to get support for mental health care"
        />
      </p>
      <p>
        <va-link
          external
          href="https://www.va.gov/health-care/health-needs-conditions/military-sexual-trauma/"
          text="Learn how to get support for military sexual trauma"
        />
      </p>
    </va-alert-expandable>
  );
};

export const supportingEvidenceOrientationEnhanced = ({ formData }) => (
  <>
    {supportingEvidenceOrientationAlert({ formData })}
    {additionalSupportAccordion}
    {mentalHealthSupportAlert()}
  </>
);

export const SupportingEvidenceOrientation = ({ formData }) => {
  return formData?.disability526SupportingEvidenceEnhancement
    ? supportingEvidenceOrientationEnhanced({ formData })
    : supportingEvidenceOrientationLegacy({ formData });
};

// Backwards-compatible alias used by form config imports.
export const supportingEvidenceOrientation = SupportingEvidenceOrientation;
