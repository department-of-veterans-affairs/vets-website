// Node modules.
import React from 'react';
import { CONTACTS } from '@department-of-veterans-affairs/component-library/contacts';
// Relative imports.
import CallToActionWidget from 'applications/static-pages/cta-widget';

const UnauthContent = () => (
  <>
    <h2 id="va-blue-button">
      Use VA Blue Button to manage your records online
    </h2>
    <CallToActionWidget appId="health-records" setFocus={false} />
    <h3>What you can do when you sign in</h3>
    <ul>
      <li>
        Download a customized Blue Button report with information from your VA
        medical records, personal health record, and in some cases your military
        service record
      </li>
      <li>
        Download a Health Summary that includes specific information from your
        VA medical records (like your known allergies, medicines, and recent lab
        results)
      </li>
      <li>
        Build your own personal health record that includes information like
        your self-entered medical history, emergency contacts, and medicines
      </li>
      <li>
        Monitor your vital signs and track your diet and exercise with our
        online journals
      </li>
      <li>
        Share a digital copy of the personal health information you entered
        yourself with your VA health care team through secure messaging
      </li>
    </ul>
    <h3>Who can manage VA medical records online</h3>
    <p>
      You can use all the features of VA Blue Button if you meet all of these
      requirements.
    </p>
    <p>
      <strong>All of these must be true:</strong>
    </p>
    <ul>
      <li>
        You’re enrolled in VA health care, <strong>and</strong>
      </li>
      <li>
        You’re registered as a patient in a VA health facility,{' '}
        <strong>and</strong>
      </li>
      <li>
        You have a verified <strong>Login.gov</strong> or <strong>ID.me</strong>{' '}
        account or a Premium <strong>DS Logon</strong>
      </li>
    </ul>
    <p>
      <a href="/health-care/how-to-apply">
        Find out how to apply for VA health care
      </a>
    </p>

    <h3>Questions about managing your VA medical records</h3>
    <va-accordion>
      <va-accordion-item id="first">
        <h4 slot="headline">
          Once I’m signed in, how do I access my medical records?
        </h4>
        <p>
          Go to your welcome page dashboard. Then select{' '}
          <strong>Health Records</strong>. You’ll go to a new page.
        </p>
        <p>From here, you can choose to access these items:</p>
        <ul>
          <li>Your VA Blue Button report</li>
          <li>Your VA health summary</li>
          <li>Your VA medical images and reports</li>
        </ul>
      </va-accordion-item>
      <va-accordion-item
        header="How can I add information to my personal health record?"
        id="second"
      >
        <p>
          Go to the main navigation menu. Then select{' '}
          <strong>Track Health</strong>. You’ll go to a new page.
        </p>
        <p>
          From here, you can choose to record different types of information
          like these:
        </p>
        <ul>
          <li>Vital signs</li>
          <li>Health history</li>
          <li>Health goals</li>
          <li>Food and exercise efforts</li>
        </ul>
      </va-accordion-item>
      <va-accordion-item
        header="Can I get notifications when my medical images and reports are ready?"
        id="third"
      >
        <p>
          Yes. You can sign up to get notifications by email on the{' '}
          <strong>My HealtheVet</strong> website. You can get notifications with
          a Basic or Premium <strong>My HealtheVet</strong> account.
        </p>
        <p>
          <strong>If you’re signing up for a My HealtheVet account</strong>, go
          to “Notifications and Settings” on the registration page. Select{' '}
          <strong>On</strong> for “VA medical images and report available
          notification.”
        </p>
        <a href="https://www.myhealth.va.gov/mhv-portal-web/user-registration/">
          Sign up for an account on the My HealtheVet website
        </a>
        <p>
          <strong>If you already have a My HealtheVet account</strong>, go to
          your profile page to update your notification settings.
        </p>
        <a href="https://www.myhealth.va.gov/mhv-portal-web/web/myhealthevet/user-login">
          Sign in to your account on the My HealtheVet website
        </a>
      </va-accordion-item>
      <va-accordion-item
        header="What if I can’t access all of my medical records through VA Blue Button?"
        id="fourth"
      >
        <p>
          You can request a complete copy of your medical records from your VA
          health facility or the Department of Defense (DoD), depending on where
          you received care.
        </p>
        <a href="/resources/how-to-get-your-medical-records-from-your-va-health-facility">
          Learn how to get medical records from your VA health facility
        </a>
        <br />
        <br />
        <a href="https://tricare.mil/PatientResources/MedicalRecords">
          Learn how to get DoD Health Records on the TRICARE website
        </a>
      </va-accordion-item>
      <va-accordion-item
        header="Will VA protect my personal health information?"
        id="fifth"
      >
        <p>
          Yes. This is a secure website. We follow strict security policies and
          practices to protect your personal health information.
        </p>
        <p>
          If you print or download anything from the website, you’ll need to
          take responsibility for protecting that information.
        </p>
      </va-accordion-item>
      <va-accordion-item
        header="How does VA share my health information with providers outside VA?"
        id="sixth"
      >
        <p>
          The Veterans Health Information Exchange (VHIE) program lets us
          securely share your health information with participating community
          care providers in our network. VHIE also lets us share your
          information with the Department of Defense.
        </p>
        <p>
          VHIE gives your health care providers a more complete understanding of
          your health record. This more complete understanding can help your
          providers make more informed treatment decisions. We share your health
          information with participating community providers only when they’re
          treating you.
        </p>
        <p>
          If you don’t want us to share your information through VHIE, you can
          opt out at any time.
        </p>
        <a href="/resources/the-veterans-health-information-exchange-vhie">
          Learn more about VHIE
        </a>
      </va-accordion-item>
      <va-accordion-item header="What if I have more questions?" id="seventh">
        <p>You can get more information in any of these ways:</p>
        <ul>
          <li>
            Read the FAQs pages on the My HealtheVet web portal
            <br />
            <a href="https://www.myhealth.va.gov/mhv-portal-web/web/myhealthevet/faqs-blue-button">
              VA Blue Button FAQs
            </a>
            <br />
            <a href="https://www.myhealth.va.gov/mhv-portal-web/web/myhealthevet/faqs-health-summary">
              VA health summary FAQs
            </a>
            <br />
            <a href="https://www.myhealth.va.gov/mhv-portal-web/web/myhealthevet/what-are-va-medical-images-and-reports-faqs">
              VA medical images and reports FAQs
            </a>
          </li>
          <li>
            Call the My HealtheVet help desk at{' '}
            <va-telephone contact="8773270022" /> (
            <va-telephone contact={CONTACTS.HELP_TTY} tty />) Monday through
            Friday, 8:00 a.m. to 8:00 p.m. ET.
          </li>
          <li>
            <a href="https://www.myhealth.va.gov/contact-us">
              Contact us online through My HealtheVet
            </a>
          </li>
        </ul>
      </va-accordion-item>
    </va-accordion>
  </>
);

export default UnauthContent;
