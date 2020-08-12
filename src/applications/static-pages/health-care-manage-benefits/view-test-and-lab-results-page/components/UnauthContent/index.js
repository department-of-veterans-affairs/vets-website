// Node modules.
import React from 'react';
import Telephone, {
  CONTACTS,
} from '@department-of-veterans-affairs/formation-react/Telephone';
// Relative imports.
import CallToActionWidget from 'platform/site-wide/cta-widget';
import MoreInfoAboutBenefits from '../../../components/MoreInfoAboutBenefits';

export const UnauthContent = () => (
  <>
    <CallToActionWidget appId="lab-and-test-results" setFocus={false} />
    <h2>How can this tool help me manage my health care?</h2>
    <p>
      With this tool, you’ll be able to view and keep a record of your VA lab
      and test results.
    </p>
    <p>
      <strong>You can use the tool to:</strong>
    </p>
    <ul>
      <li>View some of your VA lab and test results (like blood tests)</li>
      <li>Add results from non-VA health care providers and labs</li>
    </ul>
    <h2>Am I eligible to use this tool?</h2>
    <p>
      You can use this tool to view and track your VA lab and test results if
      you meet all of the requirements listed below.
    </p>
    <p>
      <strong>Both of these must be true. You’re:</strong>
    </p>
    <ul>
      <li>
        Enrolled in VA health care, <strong>and</strong>
      </li>
      <li>Registered as a patient at a VA health facility</li>
    </ul>
    <a href="/health-care/how-to-apply">
      Find out how to apply for VA health care
    </a>
    <p>
      <strong>And you must have one of these free accounts:</strong>
    </p>
    <li>
      A{' '}
      <a href="https://www.myhealth.va.gov/mhv-portal-web/upgrade-account-to-premium#UpgradeToPremiumAccount">
        Premium <strong>My HealtheVet</strong> account
      </a>
      , <strong>or</strong>
    </li>
    <li>
      A Premium DS Logon account (used for eBenefits and milConnect),{' '}
      <strong>or</strong>
    </li>
    <li>
      A verified ID.me account that you can{' '}
      <a href="https://api.id.me/en/registration/new">create here on VA.gov</a>
    </li>
    <p>
      <strong>Note:</strong> If you sign in with a Basic or Advanced account,
      you’ll find only the results you’ve entered yourself.
    </p>
    <a
      href="https://www.myhealth.va.gov/mhv-portal-web/my-healthevet-offers-three-account-types"
      rel="noreferrer noopener"
    >
      Learn about the 3 different My HealtheVet account types
    </a>
    <h2>Can I view all my VA lab and test information using this tool?</h2>
    <p>
      At this time, you can view only your VA chemistry/hematology results.
      These include tests for blood sugar, liver function, or blood cell counts.
    </p>
    <h2>Can I view results from community (non-VA) providers or labs?</h2>
    <p>
      No. But you can add this information yourself to keep all your results in
      one place.
    </p>
    <h2>Once I’m signed in, how do I view my results?</h2>
    <p>
      On your Welcome page dashboard, you’ll find a module for{' '}
      <strong>Health Records</strong>. Within that module, click on{' '}
      <strong>Labs and Tests</strong>.
    </p>
    <p>This will take you to a new page with links to your test results.</p>
    <p>
      <strong>If you’re signed in with a Premium account, you’ll find:</strong>
    </p>
    <ul>
      <li>
        <strong>VA chemistry/hematology results:</strong> Your tests will be
        listed by date and specimen. A specimen is the sample studied by the
        test (like blood, urine, a tissue biopsy, or a throat swab). You can
        click on each result to review details.
      </li>
      <li>
        <strong>Test results you’ve entered yourself:</strong> You can add and
        view results from community providers and labs.
      </li>
    </ul>
    <p>
      <strong>Note:</strong> If you’re signed in with a Basic or Advanced
      account, you’ll find only the test results you’ve entered yourself.
    </p>{' '}
    <a
      href="https://www.myhealth.va.gov/mhv-portal-web/my-healthevet-offers-three-account-types"
      rel="noreferrer noopener"
    >
      Learn about the 3 different My HealtheVet account types
    </a>
    <h2>Will my personal health information be protected?</h2>
    <p>
      Yes. This is a secure website. We follow strict security policies and
      practices to protect your personal health information.
    </p>
    <p>
      If you print or download anything from the website (like lab results),
      you’ll need to take responsibility for protecting that information.
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
        Go to the{' '}
        <a href="https://www.myhealth.va.gov/mhv-portal-web/web/myhealthevet/faqs#LabsandTests">
          Lab + Tests Results FAQs
        </a>{' '}
        on the My HealtheVet health management portal
      </li>
      <li>
        Call the My HealtheVet help desk at{' '}
        <a href="tel:18773270022" aria-label="8 7 7. 3 2 7. 0 0 2 2.">
          877-327-0022
        </a>{' '}
        (
        <a href=" tel:18008778339." aria-label=" TTY. 8 0 0. 8 7 7. 8 3 3 9.">
          TTY: 800-877-8339
        </a>
        ). We’re here Monday through Friday, 8:00 a.m. to 8:00 p.m. ET.
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
