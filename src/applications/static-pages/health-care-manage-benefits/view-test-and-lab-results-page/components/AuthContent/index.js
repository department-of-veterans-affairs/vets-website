// Node modules.
import React from 'react';
// Relative imports.
import CallToActionWidget from 'platform/site-wide/cta-widget';
import MoreInfoAboutBenefits from '../../../components/MoreInfoAboutBenefits';

export const AuthContent = () => (
  <>
    <CallToActionWidget appId="lab-and-test-results" setFocus={false} />
    <div>
      <div itemScope itemType="http://schema.org/Question">
        <h2
          itemProp="name"
          id="how-are-my-va-health-and-my-healthe-vet-different"
        >
          How are My VA Health and My HealtheVet different?
        </h2>
        <div
          itemProp="acceptedAnswer"
          itemScope
          itemType="http://schema.org/Answer"
        >
          <div itemProp="text">
            <div className="processed-content">
              <p>
                Where you receive care and the types of results you want to
                access will determine whether you&apos;ll view your lab and test
                results on My VA Health or My HealtheVet. If you receive care at
                both Mann-Grandstaff VA medical center and another VA facility,
                you may need to use both web portals.
              </p>
              <p>
                <strong>
                  If you receive care at Mann-Grandstaff VA medical center,
                  you&apos;ll use My VA Health Labs and Vitals tool to:
                </strong>
              </p>
              <ul>
                <li>
                  View some of your VA lab and test results (like blood tests,
                  microbiology reports, pathology reports, radiology reports,
                  and cardiology reports) from providers at Mann-Grandstaff VA
                  medical center
                </li>
              </ul>
              <p>
                <strong>
                  If you receive care at another VA medical center, you&apos;ll
                  use My HealtheVet Labs + Tests tool to:
                </strong>
              </p>
              <ul>
                <li>
                  View your VA chemistry/hematology lab and test results (like
                  blood tests, blood sugar, liver function, and blood cell
                  count) from all other VA medical centers
                </li>
                <li>Add results from non-VA health care providers and labs</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
      <div itemScope itemType="http://schema.org/Question">
        <h2 itemProp="name" id="am-i-eligible-to-use-these-tools">
          Am I eligible to use these tools?
        </h2>
        <div
          itemProp="acceptedAnswer"
          itemScope
          itemType="http://schema.org/Answer"
        >
          <div itemProp="text">
            <div className="processed-content">
              <p>
                You can use these tools if you meet all of the requirements
                below.
              </p>
              <p>
                <strong>Both of these must be true. You&apos;re:</strong>
              </p>
              <ul>
                <li>
                  Enrolled in VA health care, <strong>and</strong>
                </li>
                <li>Registered as a patient at a VA health facility</li>
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
                  <a
                    href="https://www.myhealth.va.gov/mhv-portal-web/upgrading-your-my-healthevet-account-through-in-person-or-online-authentication"
                    rel="noreferrer noopener"
                  >
                    Premium <strong>My HealtheVet account</strong>
                  </a>
                  , <strong>or</strong>
                </li>
                <li>
                  A Premium <strong>DS Logon</strong> account (used for
                  eBenefits and milConnect), <strong>or</strong>
                </li>
                <li>
                  A verified <strong>ID.me</strong> account that you can create
                  here on VA.gov
                </li>
              </ul>
              <p>
                <strong>Note:</strong> If you sign in with a Basic or Advanced
                account, you’ll see only the results you’ve entered yourself.
                <br />
                <a
                  href="https://www.myhealth.va.gov/mhv-portal-web/my-healthevet-offers-three-account-types"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Learn about the 3 different My HealtheVet account types
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
      <div itemScope itemType="http://schema.org/Question">
        <h2 itemProp="name" id="can-i-view-lab-results-from-non-va-providers">
          Can I view lab results from non-VA providers?
        </h2>
        <div
          itemProp="acceptedAnswer"
          itemScope
          itemType="http://schema.org/Answer"
        >
          <div itemProp="text">
            <div className="processed-content">
              <p>
                No. Labs results from non-VA providers aren&apos;t listed in the
                tools. However, you can enter your own lab results from non-VA
                providers into MyHealtheVet.
              </p>
            </div>
          </div>
        </div>
      </div>
      <div itemScope itemType="http://schema.org/Question">
        <h2 itemProp="name" id="once-im-signed-in-how-do-i">
          Once I’m signed in, how do I view my results?
        </h2>
        <div
          itemProp="acceptedAnswer"
          itemScope
          itemType="http://schema.org/Answer"
        >
          <div itemProp="text">
            <div className="processed-content">
              <p>
                <strong>If you&apos;re viewing results on My VA Health</strong>
              </p>
              <p>
                In the navigation panel, click &quot;Health Record.&quot; Then
                choose &quot;Labs and Vitals&quot; to see a full list of
                available reports. This will take you to a new page with links
                to view test results.
              </p>
              <p>
                If you&apos;re signed in with a Premium account, you&apos;ll
                see:
              </p>
              <ul>
                <li>
                  VA test results listed by date and specimen. A specimen is the
                  sample studied by the test (like blood, urine, a tissue
                  biopsy, or a throat swab). You can click on each result to
                  view details from your VA medical record.
                </li>
              </ul>
              <p>
                <strong>If you&apos;re viewing results on My HealtheVet</strong>
              </p>
              <p>
                On your Welcome page dashboard, you&apos;ll see a module for
                &quot;Health Records.&qout; Within that module, click on
                &quot;Labs and Tests.&quot;
              </p>
              <p>
                This will take you to a new page with links to view test
                results.
              </p>
              <p>
                If you&apos;re signed in with a Premium account, you&apos;ll
                see:
              </p>
              <ul>
                <li>
                  VA chemistry/hematology results listed by a date and specimen.
                  A specimen is the sample studied by the test (like blood,
                  urine, a tissue biopsy, or a throat swab). You can click on
                  each to view details from your VA medical record.
                </li>
                <li>
                  Test results from non-VA providers that you&apos;ve entered
                  yourself
                </li>
              </ul>
              <p>
                <strong>Note:</strong> If you’re signed in with a Basic or
                Advanced account, you’ll see only the test results you’ve
                entered yourself.
                <br />
                <a
                  href="https://www.myhealth.va.gov/mhv-portal-web/my-healthevet-offers-three-account-types"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Learn about the 3 different My HealtheVet account types
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
      <div itemScope itemType="http://schema.org/Question">
        <h2 itemProp="name" id="will-my-personal-health-inform">
          Will my personal health information be protected?
        </h2>
        <div
          itemProp="acceptedAnswer"
          itemScope
          itemType="http://schema.org/Answer"
        >
          <div itemProp="text">
            <div className="processed-content">
              <p>
                Yes. This is a secure website. We follow strict security
                policies and practices to protect your personal health
                information.
              </p>
              <p>
                If you print or download anything from the website (like lab
                results), you’ll need to take responsibility for protecting that
                information.
                <br />
                <a
                  href="https://www.myhealth.va.gov/mhv-portal-web/web/myhealthevet/protecting-your-personal-health-information"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Get tips for protecting your personal health information
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
      <div itemScope itemType="http://schema.org/Question">
        <h2 itemProp="name" id="what-if-i-have-more-questions">
          What if I have more questions?
        </h2>
        <div
          itemProp="acceptedAnswer"
          itemScope
          itemType="http://schema.org/Answer"
        >
          <div itemProp="text">
            <div className="processed-content">
              <p>
                <strong>
                  If you have questions about lab and test results on My
                  HealtheVet
                </strong>
                , please go to the{' '}
                <a
                  href="https://www.myhealth.va.gov/mhv-portal-web/faqs#Appointments"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Lab + Test Results FAQs
                </a>{' '}
                on the My HealtheVet web portal.
              </p>
              <p>
                Or contact the My HealtheVet help desk at{' '}
                <a href="tel:+18773270022">877-327-0022</a> (TTY:{' '}
                <a href="tel:+18008778339">800-877-8339</a>. We&apos;re here
                Monday through Friday, 7:00 a.m. to 7:00 p.m. CT.
              </p>
              <p>
                You can also{' '}
                <a
                  href="https://www.myhealth.va.gov/mhv-portal-web/web/myhealthevet/contact-mhv"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  contact us online
                </a>
                .
              </p>
              <p>
                <strong>
                  If you have questions about lab and test results on My VA
                  Health
                </strong>
                , you can call the My VA Health help desk at{' '}
                <a aria-label="1 8 0 0 9 6 2 1 0 2 4" href="tel:18009621024">
                  1-800-962-1024
                </a>
                . You can also{' '}
                <a
                  className="vads-u-color--secondary vads-u-text-decoration--none"
                  href="https://www.myhealth.va.gov/mhv-portal-web/web/myhealthevet/contact-mhv"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  [contact us online]
                </a>
                .
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </>
);

export default AuthContent;
