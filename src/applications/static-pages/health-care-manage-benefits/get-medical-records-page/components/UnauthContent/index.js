// Node modules.
import React from 'react';
import Telephone, {
  CONTACTS,
} from '@department-of-veterans-affairs/component-library/Telephone';
// Relative imports.
import CallToActionWidget from 'applications/static-pages/cta-widget';

const UnauthContent = () => (
  <>
    <h2 className="vads-u-margin-bottom--2 vads-u-font-size--lg">
      On this page:
    </h2>
    <ul>
      <li>
        <a href="#va-blue-button">VA Blue Button</a>
      </li>
      <li>
        <a href="#vhie">The Veterans Health Information Exchange (VHIE)</a>
      </li>
    </ul>
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
        You’re registered as a patient in a VA health facility,
        <strong>and</strong>
      </li>
      <li>
        You have a verified <strong>Login.gov</strong> or <strong>ID.me</strong>
        account or a Premium <strong>DS Logon</strong> or
        <strong>My HealtheVet</strong> account
      </li>
    </ul>
    <p>
      <a href="/health-care/how-to-apply">
        Find out how to apply for VA health care
      </a>
    </p>
    <h3>Questions about managing your VA medical records</h3>
    <va-accordion
      disable-analytics={{
        value: 'false',
      }}
      section-heading={{
        value: 'null',
      }}
    >
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
          Go to the main navigation menu at the top of the page, and click on{' '}
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
          to "Notifications and Settings" on the registration page. Select{' '}
          <strong>On</strong>
          for "VA medical images and report available notification.
        </p>
        <a href="https://www.myhealth.va.gov/mhv-portal-web/user-registration/">
          Sign up for an account on the My HealtheVet website
        </a>
        <p>
          <strong>If you already have a My HealtheVet account</strong>, go to
          your profile page to update your notification settings.
        </p>
        <a href="https://www.myhealth.va.gov/mhv-portal-web/web/myhealthevet/user-login?redirect=/mhv-portal-web/user-registration/user-login">
          Sign in to your account on the My HealtheVet website
        </a>
      </va-accordion-item>
      <va-accordion-item
        header="What if some of my medical records are missing online?"
        id="fourth"
      >
        <p>
          You can request a complete copy of your medical records from your VA
          health facility or the Department of Defense (DoD), depending on where
          you received care.
        </p>
        <a href="/resources/how-to-get-your-medical-records-from-your-va-health-facility">
          Learn how to request medical records from your VA health facility
        </a>
        <a href="/resources/how-to-get-your-medical-records-from-the-department-of-defense-dod">
          Learn how to request medical records from DoD
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
        <a href="/resources/the-veterans-health-information-exchange">
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
            <a href="tel:18773270022" aria-label="8 7 7. 3 2 7. 0 0 2 2.">
              877-327-0022
            </a>{' '}
            (TTY: <Telephone contact={CONTACTS.HELP_TTY} />
            ). We’re here Monday through Friday, 8:00 a.m. to 8:00 p.m. ET.
          </li>
          <li>
            <a href="https://www.myhealth.va.gov/contact-us">
              Contact us online through My HealtheVet
            </a>
          </li>
        </ul>
      </va-accordion-item>
    </va-accordion>

    <h2 id="vhie">The Veterans Health Information Exchange</h2>
    <p>
      The Veterans Health Information Exchange (VHIE) program lets us
      automatically and securely share your health information with
      participating community care providers as well as the Department of
      Defense.
    </p>
    <h3>What’s VHIE, and how can it help me manage my health?</h3>
    <p>
      VHIE gives your health care providers a more complete view of your health
      record to help them make more informed treatment decisions. Through VHIE,
      community providers who are a part of your care team can safely and
      securely receive your VA health information electronically.
    </p>

    <p>
      VHIE helps improve continuity of your care, reduce test duplication, and
      avoid clinical error. That’s because you can see all your health care
      providers from different practices or networks in one place. Our secure
      system also eliminates the need to send paper medical records by mail, and
      to carry your records to appointments with community providers.
    </p>

    <p>
      We share your health information only with participating community
      providers via VHIE when they’re treating you. Visit the{' '}
      <a href="/VHIE/">VHIE page</a> to learn more about how the program helps
      your providers better understand your health history and develop safer,
      more effective treatment plans.
    </p>
    <h4>VHIE sharing options</h4>
    <p>
      If you don’t want your community providers to receive your information via
      VHIE, you may opt out of electronic sharing at any time. And if you
      previously opted out but want to resume secure, seamless sharing, you may
      opt back in. Visit the{' '}
      <a href="/VHIE/VHIE_Sharing_Options.asp">VHIE Sharing Options page</a> to
      learn more.
    </p>
    <h3>How do I opt out?</h3>
    <p>
      If you would prefer to opt out of sharing your health information
      electronically, you can do so at any time. You must complete and submit{' '}
      <a href="/vaforms/medical/pdf/10-10164-fill.pdf">
        VA Form 10-10164 (PDF)
      </a>{' '}
      to your facility’s Release of Information Office (ROI). You may also opt
      out via{' '}
      <a
        href="https://www.myhealth.va.gov/mhv-portal-web/home"
        rel="noreferrer noopener"
      >
        My HealtheVet
      </a>
      .
    </p>
    <p>
      <strong>Note:</strong> If you haven’t already done so, you’ll need to
      upgrade your My HealtheVet account to Premium status to opt out. Visit{' '}
      <a
        href="https://www.myhealth.va.gov/mhv-portal-web/home"
        rel="noreferrer noopener"
      >
        My HealtheVet
      </a>{' '}
      to learn more.
    </p>
    <p>
      Choosing to opt out will not affect your access to care from community
      providers. However, if you opt out, your community providers may not
      receive your medical records before you receive treatment. This may put
      you at risk. Also, if you visit any emergency room, your information may
      still be shared via VHIE so that you can receive the care you need.
    </p>
    <h3>If I opt out, how can I opt back in?</h3>
    <p>
      If you previously opted out, but want to resume secure, seamless sharing,
      you may do so at any time. Simply complete{' '}
      <a href="/vaforms/medical/pdf/10-10163-fill.pdf">
        VA Form 10-10163 (PDF)
      </a>{' '}
      and return it to your VA facility’s ROI office, or submit it online
      through{' '}
      <a
        href="https://www.myhealth.va.gov/mhv-portal-web/home"
        rel="noreferrer noopener"
      >
        My HealtheVet
      </a>
      .
    </p>
    <h3>Can I check my sharing preference status?</h3>
    <p>
      Yes. Please contact your VA facility’s ROI office. If you’ve already
      submitted your form to opt out, or to opt back in, to the electronic
      sharing program, your request may be in process.
    </p>
  </>
);

export default UnauthContent;
