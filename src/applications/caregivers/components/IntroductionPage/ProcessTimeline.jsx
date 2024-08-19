import React from 'react';
import { CONTACTS } from '@department-of-veterans-affairs/component-library/contacts';

const ProcessTimeline = () => (
  <>
    <h2>Follow these steps to get started:</h2>

    <va-process-list>
      <va-process-list-item header="Check your eligibility">
        <p className="vads-u-margin-top--2">
          Check our eligibility requirements before you apply.
        </p>
        <p>
          <a
            target="_blank"
            rel="noopener noreferrer"
            href="/family-member-benefits/comprehensive-assistance-for-family-caregivers/"
          >
            Find out if you’re eligible for the Program of Comprehensive
            Assistance for Family Caregivers
          </a>
        </p>
      </va-process-list-item>

      <va-process-list-item header="Gather your information">
        <p className="vads-u-margin-top--2">
          You’ll need this information for the Veteran and each family
          caregiver:
        </p>

        <ul>
          <li>Social Security number or tax identification number</li>
          <li>Date of birth, address, and phone number</li>
        </ul>

        <p>
          You’ll also need to share the VA medical center where the Veteran
          receives care or plans to receive care.
        </p>

        <p>
          And if you’re a representative signing this application on behalf the
          Veteran, you’ll need to submit a document showing you have legal
          authority to make decisions for the Veteran (like a valid power of
          attorney, legal guardianship order, or other legal document). Or
          you’ll need to upload a document showing you have authority to fill
          out and sign applications on behalf of the Veteran.
        </p>

        <p className="vads-u-margin-bottom--4">
          <a
            target="_blank"
            rel="noopener noreferrer"
            href="/family-and-caregiver-benefits/health-and-disability/comprehensive-assistance-for-family-caregivers/#what-documents-can-i-submit-if"
          >
            Learn more about the documents you can submit
          </a>
        </p>

        <h4>What if I have questions or need help with this application?</h4>

        <p>If you have questions or need help, here’s what you can do:</p>

        <ul>
          <li>
            Call the Caregiver Support Line at{' '}
            <va-telephone contact={CONTACTS.CAREGIVER} /> (
            <va-telephone contact={CONTACTS[711]} tty />) and ask for help
            filling out the form.
          </li>
          <li>
            Find a Caregiver Support Team Coordinator at your nearest VA health
            facility.{' '}
            <a
              target="_blank"
              rel="noopener noreferrer"
              href="https://www.caregiver.va.gov/support/New_CSC_Page.asp"
            >
              Go to our Caregiver Support Program Teams directory
            </a>
          </li>
          <li>
            Get help from an accredited representative, like a Veterans Service
            Organization (VSO).{' '}
            <a
              target="_blank"
              rel="noopener noreferrer"
              href="/get-help-from-accredited-representative/"
            >
              Learn more about getting help from an accredited representative
            </a>
          </li>
        </ul>

        <va-additional-info
          trigger="What’s a Caregiver Support Team?"
          class="vads-u-margin-top--3"
        >
          A Caregiver Support Team connects the Veteran caregivers with VA and
          community resources that offer supportive programs and services.
          Caregiver Support Teams are located at every VA medical center and
          specialize in caregiving issues.
        </va-additional-info>
      </va-process-list-item>

      <va-process-list-item header="Start your application">
        <p className="vads-u-margin-top--2">
          We’ll take you through each step of the process. It should take about
          15 minutes.
        </p>
        <p>
          If the Veteran is already enrolled in this program and wants to add a
          new family caregiver, the Veteran and the new caregiver can use this
          application.{' '}
        </p>
        <p>
          <strong>Note:</strong> There can only be 1 Primary and up to 2
          Secondary Family caregivers at any one time.
        </p>
      </va-process-list-item>
    </va-process-list>
  </>
);

export default ProcessTimeline;
