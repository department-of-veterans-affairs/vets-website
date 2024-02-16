import React from 'react';
import { CONTACTS } from '@department-of-veterans-affairs/component-library/contacts';
import { links } from '../../definitions/content';

const ProcessTimeline = () => (
  <>
    <h2>Follow these steps to get started:</h2>

    <va-process-list uswds>
      {/* Prepare */}
      <va-process-list-item header="Prepare" uswds>
        <p className="vads-u-margin-top--2">
          To fill out this application, the Veteran and each family caregiver
          applicant will need to provide specific information. You’ll need:
        </p>

        <ul className="process-lists">
          <li>
            The address, telephone number, and date of birth for the Veteran and
            each family caregiver applicant
          </li>
          <li>The VA medical center where the Veteran will receive care</li>
          <li>Health insurance information for the Primary Family Caregiver</li>
          <li>
            Veteran’s Social Security number (SSN) or tax identification number
            (TIN)
          </li>
        </ul>

        <va-additional-info
          trigger="What if I don't want to put my SSN or TIN in the application?"
          class="vads-u-margin-y--3"
          uswds
        >
          <p className="vads-u-margin-top--0">
            We only require your SSN or TIN if you apply online. If you want to
            apply without putting this information in your application, you can
            apply by mail or in person.
          </p>
          <p className="vads-u-margin-bottom--0">
            <a href="/family-member-benefits/comprehensive-assistance-for-family-caregivers/#how-do-i-apply-for-this-progra">
              Get instructions for how to apply for the PCAFC program by mail or
              in person
            </a>
          </p>
        </va-additional-info>

        <p data-testid="poa-info-note" className="vads-u-margin-bottom--4">
          <strong>Note:</strong> If you’re a legal representative who can make
          decisions for the Veteran, you can sign this application for them.
          You’ll need to upload proof of your legal authority to make decisions
          for the Veteran. Upload a document that we can accept (such as a valid
          power of attorney, legal guardianship order, or other legal document).
        </p>

        <h4>What if I have questions or need help filling out the form?</h4>

        <p className="vads-u-margin--0">
          If you have a question or need help, you can contact us in any of
          these ways:
        </p>

        <ul className="process-lists">
          <li>
            Call us at{' '}
            <va-telephone contact={CONTACTS.HEALTHCARE_ELIGIBILITY_CENTER} />{' '}
            and ask for help filling out the form
          </li>
          <li>
            Use the online{' '}
            <a
              href={links.caregiverSupportCoordinators.link}
              target="_blank"
              rel="noopener noreferrer"
            >
              Caregiver Support Coordinator locator
            </a>{' '}
            to find a coordinator at your nearest VA health care facility
          </li>
          <li>
            Contact the VA National Caregiver Support Line by calling{' '}
            <va-telephone contact={CONTACTS.CAREGIVER} />
          </li>
        </ul>

        <va-additional-info
          trigger="What&apos;s a Caregiver Support Coordinator ?"
          class="vads-u-margin-top--3"
          uswds
        >
          A Caregiver Support Coordinator is a clinical professional who
          connects Veteran caregivers with VA and community resources that offer
          supportive programs and services. Caregiver Support Coordinators are
          located at every VA medical center and specialize in caregiving
          issues.
        </va-additional-info>
      </va-process-list-item>

      {/* Apply */}
      <va-process-list-item header="Apply" uswds>
        <p className="vads-u-margin-top--2">
          Please remember, whether you’re the Veteran or a family caregiver,
          you’ll need to complete all form questions before submitting the form.
          After submitting the form, you’ll receive a confirmation screen that
          you can print for your records.
        </p>

        <p>
          Each time the Veteran wants to add a new family caregiver, the Veteran
          and the new caregiver will need to submit a new application. There can
          only be one Primary and up to two Secondary Family Caregivers at any
          one time.
        </p>

        <p>
          <strong>Note:</strong> If the Veteran isn’t enrolled in VA health care
          or is currently on active duty with a medical discharge, they’ll need
          to fill out an{' '}
          <a
            href={links.applyVAHealthCare.link}
            rel="noopener noreferrer"
            target="_blank"
          >
            {links.applyVAHealthCare.label}
          </a>{' '}
          (VA Form 10-10EZ).
        </p>
      </va-process-list-item>

      {/* Next steps */}
      <va-process-list-item header="Next steps" uswds>
        <p className="vads-u-margin-top--2">
          A member of the Caregiver Support Program at the VA medical center
          where the Veteran plans to receive care will contact you to discuss
          your application and eligibility.
        </p>

        <p>
          If you aren’t eligible for PCAFC you have the right to appeal. You can
          contact the patient advocate at your local VA medical center to
          discuss the appeal process. Your Caregiver Support Coordinator is also
          available if you have additional questions.
        </p>

        <p>
          You may also be eligible for the Program of General Caregiver Support
          Services (PGCSS). To find out more, call the VA Caregiver Support Line
          at <va-telephone contact={CONTACTS.CAREGIVER} />, visit{' '}
          <a
            target="_blank"
            rel="noopener noreferrer"
            href={links.caregiverHelpPage.link}
          >
            {links.caregiverHelpPage.label}
          </a>
          , or discuss your options with your local Caregiver Support
          Coordinator.
        </p>
      </va-process-list-item>
    </va-process-list>
  </>
);

export default ProcessTimeline;
