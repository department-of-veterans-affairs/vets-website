// Node modules.
import React from 'react';
import { CONTACTS } from '@department-of-veterans-affairs/component-library/contacts';
// Relative imports.
import CallToActionWidget from 'applications/static-pages/cta-widget';

export const UnauthContent = () => (
  <>
    <CallToActionWidget appId="rx" setFocus={false} headerLevel={2} />
    <h2>How can VA’s prescription tool help me manage my health care?</h2>
    <p>
      This web- and mobile-based service helps you manage your VA prescriptions
      online.
    </p>
    <p>
      <strong>With this tool, you can:</strong>
    </p>
    <ul>
      <li>Refill your VA prescriptions online</li>
      <li>View your past and current VA prescriptions</li>
      <li>
        Track the delivery of each prescription mailed within the past 30 days
      </li>
      <li>
        Get email notifications to let you know when to expect your
        prescriptions
      </li>
      <li>
        Create lists to keep track of all your medicines (including
        prescriptions, over-the-counter medicines, herbal remedies, and
        supplements)
      </li>
    </ul>
    <h2>Am I eligible to use this tool?</h2>
    <p>
      You can use this tool if you meet all of the requirements listed below.
    </p>
    <p>
      <strong>All of these must be true. You:</strong>
    </p>
    <ul>
      <li>
        Are enrolled in VA health care, <strong>and</strong>
      </li>
      <li>
        Are registered as a patient in a VA health facility,{' '}
        <strong>and</strong>
      </li>
      <li>
        Have a refillable prescription from a VA doctor that you’ve filled at a
        VA pharmacy and that’s being handled by the VA Mail Order Pharmacy
      </li>
    </ul>
    <a href="/health-care/how-to-apply">
      Find out how to apply for VA health care
    </a>
    <br />

    <h2>Once I’m signed in, how do I get started?</h2>
    <p>
      On your Welcome page, you’ll find a module for <strong>Pharmacy</strong>.
      Within that module, you’ll find these options:
    </p>
    <ul>
      <li>
        <strong>Refill VA Prescriptions</strong>
      </li>
      <li>
        <strong>Track Delivery</strong>
      </li>
      <li>
        <strong>Medications List</strong>
      </li>
    </ul>
    <p>
      Click on the link you want. You’ll get instructions on the next page to
      get started.
    </p>

    <h2>Can I use this tool to refill and track all my VA prescriptions?</h2>
    <p>
      <strong>
        You can refill and track most of your VA prescriptions, including:
      </strong>
    </p>
    <ul>
      <li>VA medicines that you’ve refilled or renewed</li>
      <li>Wound care supplies</li>
      <li>Diabetic supplies</li>
      <li>
        Other products and supplies sent through the VA Mail Order Pharmacy
      </li>
    </ul>
    <p>
      Your VA health care team may decide not to ship medicines that you don’t
      need right away, medicines that aren’t commonly prescribed, or those that
      require you to be closely monitored. In these cases, you’ll need to pick
      up your prescription from the VA health facility where you get care.
    </p>
    <p>
      You can’t refill some medicines, like certain pain medications and
      narcotics. You’ll need to get a new prescription from your VA provider
      each time you need more of these medicines.
    </p>

    <h2>Where will VA send my prescriptions?</h2>
    <p>
      Our mail order pharmacy will send your prescriptions to the address we
      have on file for you. We ship to all addresses in the United States and
      its territories. We don’t ship prescriptions to foreign countries.
    </p>
    <p>
      <strong>Important note:</strong> Changing your address within My
      HealtheVet doesn’t change your address for prescription shipments.
    </p>
    <p>
      <strong>
        To change your address on file with VA for prescription shipments:
      </strong>
    </p>
    <ul>
      <li>
        Find out how to{' '}
        <a href="/change-address/">
          change your address in your VA.gov profile
        </a>
      </li>
      <li>
        Or contact the VA health facility where you get care to have them update
        your address on file.
        <br />
        <a href="/find-locations/">Find your VA health facility</a>
      </li>
    </ul>

    <h2>When will I get my prescriptions, and when should I reorder?</h2>
    <p>
      Prescriptions usually arrive within 3 to 5 days. You can find specific
      information about your order on the website of the delivery service shown
      in your Rx Tracker.
    </p>
    <p>
      To make sure you have your medicine in time, please request your refill at
      least 10 days before you need more medicine.
    </p>

    <h2>Will my personal health information be protected?</h2>
    <p>
      Yes. This is a secure website. We follow strict security policies and
      practices to protect your personal health information.
    </p>
    <p className="vads-u-margin-bottom--0">
      If you print or download anything from the website (like prescription
      details), you’ll need to take responsibility for protecting that
      information.
    </p>
    <a
      href="https://www.myhealth.va.gov/mhv-portal-web/web/myhealthevet/protecting-your-personal-health-information"
      rel="noreferrer noopener"
    >
      Get tips for protecting your personal health information
    </a>

    <h2>What if I have more questions?</h2>
    <p>You can:</p>
    <ul>
      <li>
        Read the{' '}
        <a href="https://www.myhealth.va.gov/mhv-portal-web/web/myhealthevet/faqs#PrescriptionRefill">
          prescription refill FAQs
        </a>{' '}
        on the My HealtheVet web portal
      </li>
      <li>
        Call the My HealtheVet help desk at{' '}
        <va-telephone contact="8773270022" />{' '}
        <va-telephone contact={CONTACTS.HELP_TTY} tty />. We’re here Monday
        through Friday, 8:00 a.m. to 8:00 p.m. ET.
      </li>
      <li>
        Or{' '}
        <a href="https://www.myhealth.va.gov/mhv-portal-web/web/myhealthevet/contact-mhv">
          contact us online
        </a>
      </li>
    </ul>
  </>
);

export default UnauthContent;
