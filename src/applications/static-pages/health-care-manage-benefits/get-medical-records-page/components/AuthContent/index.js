// Node modules.
import React from 'react';
import PropTypes from 'prop-types';
import Telephone, {
  CONTACTS,
} from '@department-of-veterans-affairs/component-library/Telephone';
// Relative imports.
import CernerCallToAction from '../../../components/CernerCallToAction';
import { getCernerURL } from 'platform/utilities/cerner';
import { mhvUrl } from 'platform/site-wide/mhv/utilities';

const AuthContent = ({
  authenticatedWithSSOe,
  cernerFacilities,
  otherFacilities,
}) => (
  <>
    <h2 className="vads-u-margin-bottom--2 vads-u-font-size--lg">
      On this page:
    </h2>
    <ul>
      <li>
        <a href="#va-blue-button">
          My HealtheVet (VA Blue Button) and My VA Health{' '}
        </a>
      </li>
      <li>
        <a href="#vhie">The Veterans Health Information Exchange (VHIE)</a>
      </li>
    </ul>
    <h2 id="va-blue-button">My HealtheVet (VA Blue Button) and My VA Health</h2>
    <CernerCallToAction
      cernerFacilities={cernerFacilities}
      otherFacilities={otherFacilities}
      linksHeaderText="Get your medical records from:"
      myHealtheVetLink={mhvUrl(authenticatedWithSSOe, 'download-my-data')}
      myVAHealthLink={getCernerURL(
        '/pages/health_record/clinical_documents/sharing',
      )}
    />
    <h3>What are My HealtheVet and My VA Health, and which will I use?</h3>
    <p>
      My HealtheVet and My VA Health are both VA health management portals
      designed to help you manage your care. My VA Health is our new portal that
      providers at select facilities have started to use.
    </p>
    <p>
      Each portal offers a tool to help you manage your medical records. The
      portal you’ll use will depend on where you receive care. If you receive
      care at both Mann-Grandstaff VA Medical Center and another VA facility,
      you may need to use both portals.
    </p>
    <h3>How can My HealtheVet’s VA Blue Button tool help me manage my care?</h3>
    <p>
      This tool lets you review, print, save, download, and share information
      from your VA medical records and personal health record. With this tool,
      you can better manage your health needs and communicate with your health
      care team.
    </p>
    <p>
      <strong>With My HealtheVet’s VA Blue Button tool, you can:</strong>
    </p>
    <ul>
      <li>
        Download a customized Blue Button report with information from your VA
        medical records, personal health record, and in some cases your military
        service record
      </li>
      <li>
        Download a Health Summary that includes specific information from your
        VA medical records (like your known allergies, medications, and recent
        lab results)
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
    <h3>How can My VA Health’s Health Records tool help me manage my care?</h3>
    <p>
      This tool lets you review and print information from your VA medical
      records at Mann-Grandstaff VA Medical Center.
    </p>
    <p>
      <strong>With My VA Health’s Health Records tool, you can:</strong>
    </p>
    <ul>
      <li>
        Review and print your health profile, lab and test results, health
        conditions, and procedures
      </li>
      <li>Review, download, and share clinical documents</li>
    </ul>
    <h3>Am I eligible to use these tools?</h3>
    <p>
      You can use these tools to get your VA medical records if you meet all of
      the requirements listed below.
    </p>
    <p>
      <strong>Both of these must be true. You’re:</strong>
    </p>
    <ul>
      <li>
        Enrolled in VA health care, <strong>and</strong>
      </li>
      <li>Registered as a patient in a VA health facility</li>
    </ul>
    <p>
      <a href="/health-care/how-to-apply/">
        Find out how to apply for VA health care
      </a>
    </p>
    <p>
      <strong>And you must have one of these free accounts:</strong>
    </p>
    <ul>
      <li>
        A{' '}
        <a href="https://www.myhealth.va.gov/mhv-portal-web/upgrade-account-to-premium#UpgradeToPremiumAccount">
          Premium <strong>My HealtheVet</strong> account
        </a>
        , <strong>or</strong>
      </li>
      <li>
        A Premium <strong>DS Logon</strong> account (used for eBenefits and
        milConnect), <strong>or</strong>
      </li>
      <li>
        A verified
        <strong> ID.me </strong>
        account that you can{' '}
        <a href="https://api.id.me/en/registration/new">
          create here on VA.gov
        </a>
      </li>
    </ul>
    <h3>Once I’m signed in, how do I access my medical records?</h3>
    <h4>If you’re accessing your records on My HealtheVet</h4>
    <p>
      Go to your welcome page dashboard, and click on{' '}
      <strong>Health Records</strong>. You’ll go to a new page.
    </p>
    <p>From here, you can choose to access your VA:</p>
    <ul>
      <li>Blue Button report</li>
      <li>
        Health summary, <strong>or</strong>
      </li>
      <li>Medical images and reports</li>
    </ul>
    <h5>If you’d like to add information to your personal health record</h5>
    <p>
      Go the blue navigation menu at the top of the page, and click on{' '}
      <strong>Track Health</strong>. You’ll go to a new page where you can
      choose to record information like your vital signs, health history, goals,
      and food and exercise efforts.
    </p>
    <h4>If you’re accessing your records on My VA Health</h4>
    <p>
      In the navigation panel, click on <strong>Health Record</strong> You’ll go
      to a new page.
    </p>
    <p>From here, you can choose to access your:</p>
    <ul>
      <li>Health profile</li>
      <li>Lab and test results</li>
      <li>Health conditions</li>
      <li>Procedures</li>
      <li>Clinical documents</li>
    </ul>
    <h3>Will my personal health information be protected?</h3>
    <p>
      Yes. Our health management portals are secure websites. We follow strict
      security policies and practices to protect your personal health
      information.
    </p>
    <p>
      If you print or download anything from the website, you’ll need to take
      responsibility for protecting that information.
    </p>
    <h3>What if I have more questions?</h3>
    <h4>For My HealtheVet questions</h4>
    <p>You can:</p>
    <ul>
      <li>
        Read the FAQs pages on the My HealtheVet web portal
        <br />
        <a href="https://www.myhealth.va.gov/mhv-portal-web/web/myhealthevet/faqs#bbtop">
          VA Blue Button FAQs
        </a>
        <br />
        <a href="https://www.myhealth.va.gov/mhv-portal-web/faqs#CCD">
          VA health summary FAQs
        </a>
        <br />
        <a href="https://www.myhealth.va.gov/mhv-portal-web/faqs#VAMIR">
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
        Or{' '}
        <a href="https://www.myhealth.va.gov/mhv-portal-web/web/myhealthevet/contact-mhv">
          contact us online
        </a>
      </li>
    </ul>
    <h4>For My VA Health questions</h4>
    <p>
      Call My VA Health support anytime at{' '}
      <a href="tel:18009621024" aria-label="8 0 0. 9 6 2. 1 0 2 4.">
        {' '}
        800-962-1024
      </a>
      .
    </p>
    <h2>The Veterans Health Information Exchange</h2>
    <p>
      The Veterans Health Information Exchange (VHIE) program lets us
      automatically and securely share your health information with
      participating community care providers as well as the Department of
      Defense.
    </p>
    <h3>What's VHIE, and how can it help me manage my health?</h3>
    <p>
      VHIE gives your health care providers a more complete view of your health
      record to help them make more informed treatment decisions. Through VHIE,
      community providers who are a part of your care team can safely and
      securely receive your VA health information electronically.
    </p>
    <p>
      VHIE helps improve continuity of your care, reduce test duplication, and
      avoid clinical error. That's because you can see all your health care
      providers from different practices or networks in one place. Our secure
      system also eliminates the need to send paper medical records by mail, and
      to carry your records to appointments with community providers.
    </p>
    <p>
      We share your health information only with participating community
      providers via VHIE when they're treating you. Visit the{' '}
      <a href="/VHIE/">VHIE page</a> to learn more about how the program helps
      your providers better understand your health history and develop safer,
      more effective treatment plans.
    </p>
    <h4>VHIE sharing options</h4>
    <p>
      If you don't want your community providers to receive your information via
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
        rel="noreferrer noopener"
        href="https://www.myhealth.va.gov/mhv-portal-web/home"
      >
        My HealtheVet
      </a>
      .
    </p>
    <p>
      <strong>Note:</strong> If you haven't already done so, you'll need to
      upgrade your My HealtheVet account to Premium status to opt out. Visit{' '}
      <a href="https://www.myhealth.va.gov/mhv-portal-web/home">
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
      and return it to your VA facility's ROI office, or submit it online
      through{' '}
      <a
        rel="noreferrrer noopener"
        href="https://www.myhealth.va.gov/mhv-portal-web/home"
      >
        My HealtheVet
      </a>
      .
    </p>
    <h3>Can I check my sharing preference status?</h3>
    <p>
      Yes. Please contact your VA facility's ROI office. If you've already
      submitted your form to opt out, or to opt back in, to the electronic
      sharing program, your request may be in process.
    </p>
  </>
);

AuthContent.propTypes = {
  authenticatedWithSSOe: PropTypes.bool.isRequired,
  cernerfacilities: PropTypes.arrayOf(
    PropTypes.shape({
      facilityId: PropTypes.string.isRequired,
      isCerner: PropTypes.bool.isRequired,
      usesCernerAppointments: PropTypes.string,
      usesCernerMedicalRecords: PropTypes.string,
      usesCernerMessaging: PropTypes.string,
      usesCernerRx: PropTypes.string,
      usesCernerTestResults: PropTypes.string,
    }).isRequired,
  ),
  otherfacilities: PropTypes.arrayOf(
    PropTypes.shape({
      facilityId: PropTypes.string.isRequired,
      isCerner: PropTypes.bool.isRequired,
      usesCernerAppointments: PropTypes.string,
      usesCernerMedicalRecords: PropTypes.string,
      usesCernerMessaging: PropTypes.string,
      usesCernerRx: PropTypes.string,
      usesCernerTestResults: PropTypes.string,
    }).isRequired,
  ),
};

export default AuthContent;
