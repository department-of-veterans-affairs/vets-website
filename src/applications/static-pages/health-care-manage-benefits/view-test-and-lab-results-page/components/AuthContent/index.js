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

export const AuthContent = ({
  authenticatedWithSSOe,
  cernerFacilities,
  otherFacilities,
}) => (
  <>
    <CernerCallToAction
      cernerFacilities={cernerFacilities}
      otherFacilities={otherFacilities}
      linksHeaderText="View lab and test results from:"
      myHealtheVetLink={mhvUrl(authenticatedWithSSOe, 'labs-tests')}
      myVAHealthLink={getCernerURL('/pages/health_record/results/labs')}
    />
    <div>
      <div itemScope itemType="http://schema.org/Question">
        <h2
          itemProp="name"
          id="how-are-my-va-health-and-my-healthe-vet-different"
        >
          What are My HealtheVet and My VA Health, and which will I use?
        </h2>
        <div
          itemProp="acceptedAnswer"
          itemScope
          itemType="http://schema.org/Answer"
        >
          <div itemProp="text">
            <div className="processed-content">
              <p>
                My HealtheVet and My Health VA are both VA health management
                portals designed to help you manage your care. My VA Health is
                our new portal that providers at select facilities have started
                to use.
              </p>
              <p>
                The portal you’ll use to view your lab and test results will
                depend on where you receive care and the types of results you
                want to access. If you receive care at both Mann-Grandstaff VA
                Medical Center and another VA health facility, you may need to
                use both web portals.
              </p>
              <h3>If you receive care at Mann-Grandstaff VA Medical Center</h3>
              <p>
                You’ll use <strong>My VA Health’s Labs and Vitals</strong> tool
                to view some of your VA lab and test results from providers at
                Mann-Grandstaff. These include results like blood tests as well
                as microbiology, pathology, radiology, and cardiology reports.
              </p>
              <h3>If you receive care at any other VA medical center</h3>
              <p>
                You&apos;ll use{' '}
                <strong>My HealtheVet&apos;s Labs and Tests</strong> tool to:
              </p>
              <ul>
                <li>
                  View your VA chemistry/hematology lab and test results from VA
                  medical centers other than Mann-Grandstaff. These include
                  results like blood tests, blood cell count, and tests for
                  blood sugar and liver function.
                </li>
                <li>Add results from non-VA health care providers and labs.</li>
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
                You can use these tools to view your VA lab and test results and
                information you enter yourself if you meet all of the
                requirements listed below.
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
                  A verified <strong>ID.me</strong> account that you can{' '}
                  <a href="https://api.id.me/en/registration/new">
                    create here on VA.gov
                  </a>
                </li>
              </ul>
              <p>
                <strong>Note:</strong> If you sign in with a Basic or Advanced
                account, you’ll find only the results you’ve entered yourself.
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
          Can I view lab results from community (non-VA) providers or labs?
        </h2>
        <div
          itemProp="acceptedAnswer"
          itemScope
          itemType="http://schema.org/Answer"
        >
          <div itemProp="text">
            <div className="processed-content">
              <p>
                No. Labs results from community providers aren&apos;t listed in
                the tools. But you can add this information yourself into My
                HealtheVet.
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
              <h3>If you&apos;re viewing results on My HealtheVet</h3>
              <p>
                On your Welcome page dashboard, find a module for{' '}
                <strong>Health Records.</strong> Within that module, click on{' '}
                <strong>Labs and Tests.</strong>
              </p>
              <p>
                This will take you to a new page with links to your test
                results.
              </p>
              <p>
                If you&apos;re signed in with a Premium account, you&apos;ll
                find:
              </p>
              <ul>
                <li>
                  <strong>VA chemistry/hematology results:</strong> Your tests
                  will be listed by a date and specimen. A specimen is the
                  sample studied by the test (like blood, urine, a tissue
                  biopsy, or a throat swab). You can click on each result to
                  review details.
                </li>
                <li>
                  <strong>Test results you&apos;ve entered yourself:</strong>{' '}
                  You can add and review results from community providers and
                  labs.
                </li>
              </ul>
              <p>
                <strong>Note:</strong> If you’re signed in with a Basic or
                Advanced account, you’ll find only the test results you’ve
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

              <h3>If you&apos;re viewing results on My VA Health</h3>
              <p>
                In the navigation panel, click <strong>Health Record.</strong>
              </p>
              <p>
                Then choose <strong>Labs and Vitals</strong> to get a full list
                of available reports. This will take you to a new page with
                links to specific test results.
              </p>
              <p>
                If you&apos;re signed in with a <strong>Premium</strong>{' '}
                account, you&apos;ll find VA test results listed by date and
                specimen. A specimen is the sample studied by the test (like
                blood, urine, a tissue biopsy, or a throat swab). You can click
                on each result to review details.
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
                Yes. Our health management portals are secure websites. We
                follow strict security policies and practices to protect your
                personal health information.
              </p>
              <p>
                If you print or download anything from one of the portals (like
                lab results), you’ll need to take responsibility for protecting
                that information.
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
              <h3>For My HealtheVet questions</h3>
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
                  (TTY: <Telephone contact={CONTACTS.HELP_TTY} />
                  ). We’re here Monday through Friday, 8:00 a.m. to 8:00 p.m.
                  ET.
                </li>
                <li>
                  Or{' '}
                  <a href="https://www.myhealth.va.gov/mhv-portal-web/web/myhealthevet/contact-mhv">
                    {' '}
                    contact us online
                  </a>
                </li>
              </ul>
              <h3>For My VA Health questions</h3>
              <p>
                Call My VA Health support anytime at{' '}
                <a href="tel:18009621024" aria-label="8 0 0. 9 6 2. 1 0 2 4.">
                  {' '}
                  800-962-1024
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
