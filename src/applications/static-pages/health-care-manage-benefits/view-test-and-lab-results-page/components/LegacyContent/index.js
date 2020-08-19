// Node modules.
import React from 'react';
import Telephone, {
  CONTACTS,
} from '@department-of-veterans-affairs/formation-react/Telephone';
// Relative imports.
import CallToActionWidget from 'platform/site-wide/cta-widget';

export const LegacyContent = () => (
  <>
    <CallToActionWidget appId="lab-and-test-results" setFocus={false} />
    <div data-template="paragraphs/q_a_section" data-entity-id={3507}>
      <div
        itemScope
        itemType="http://schema.org/Question"
        data-template="paragraphs/q_a"
        data-entity-id={3506}
        data-analytics-faq-section
        data-analytics-faq-text="How can this tool help me manage my health care?"
      >
        <h2 itemProp="name" id="how-can-this-tool-help-me-mana">
          How can this tool help me manage my health care?
        </h2>
        <div
          data-entity-id={3506}
          itemProp="acceptedAnswer"
          itemScope
          itemType="http://schema.org/Answer"
        >
          <div itemProp="text">
            <div
              data-template="paragraphs/wysiwyg"
              data-entity-id={3508}
              className="processed-content"
            >
              <p>
                The Labs + Tests tool is part of the My HealtheVet personal
                health record. It can help you view and keep a record of your
                lab and test results.
              </p>
              <p>
                <strong>You can use the Labs + Tests tool to:</strong>
              </p>
              <ul>
                <li>
                  View some of your VA lab and test results (like blood tests)
                </li>
                <li>Add results from non-VA health care providers and labs</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
      <div
        itemScope
        itemType="http://schema.org/Question"
        data-template="paragraphs/q_a"
        data-entity-id={3509}
        data-analytics-faq-section
        data-analytics-faq-text="Am I eligible to use this tool?"
      >
        <h2 itemProp="name" id="am-i-eligible-to-use-this-tool">
          Am I eligible to use this tool?
        </h2>
        <div
          data-entity-id={3509}
          itemProp="acceptedAnswer"
          itemScope
          itemType="http://schema.org/Answer"
        >
          <div itemProp="text">
            <div
              data-template="paragraphs/wysiwyg"
              data-entity-id={3510}
              className="processed-content"
            >
              <p>
                You can use this tool to view your VA lab and test results and
                information you enter yourself if you meet all of the
                requirements listed below.
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
                  A Premium <strong>My HealtheVet</strong> account,{' '}
                  <strong>or</strong>
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
      <div
        itemScope
        itemType="http://schema.org/Question"
        data-template="paragraphs/q_a"
        data-entity-id={3511}
        data-analytics-faq-section
        data-analytics-faq-text="Can I view all my VA lab and test information using this tool?"
      >
        <h2 itemProp="name" id="can-i-view-all-my-va-lab-and-t">
          Can I view all my VA lab and test information using this tool?
        </h2>
        <div
          data-entity-id={3511}
          itemProp="acceptedAnswer"
          itemScope
          itemType="http://schema.org/Answer"
        >
          <div itemProp="text">
            <div
              data-template="paragraphs/wysiwyg"
              data-entity-id={3512}
              className="processed-content"
            >
              <p>
                At this time, you can view only your VA chemistry/hematology
                results. These include tests for blood sugar, liver function, or
                blood cell counts.
              </p>
            </div>
          </div>
        </div>
      </div>
      <div
        itemScope
        itemType="http://schema.org/Question"
        data-template="paragraphs/q_a"
        data-entity-id={3513}
        data-analytics-faq-section
        data-analytics-faq-text="Can I view results from non-VA providers or labs?"
      >
        <h2 itemProp="name" id="can-i-view-results-from-non-va">
          Can I view results from non-VA providers or labs?
        </h2>
        <div
          data-entity-id={3513}
          itemProp="acceptedAnswer"
          itemScope
          itemType="http://schema.org/Answer"
        >
          <div itemProp="text">
            <div
              data-template="paragraphs/wysiwyg"
              data-entity-id={3514}
              className="processed-content"
            >
              <p>
                No. But you can enter this information yourself to keep all your
                results in one place.
              </p>
            </div>
          </div>
        </div>
      </div>
      <div
        itemScope
        itemType="http://schema.org/Question"
        data-template="paragraphs/q_a"
        data-entity-id={3515}
        data-analytics-faq-section
        data-analytics-faq-text="Once I’m signed in within My HealtheVet, how do I view my results?"
      >
        <h2 itemProp="name" id="once-im-signed-in-within-my-he">
          Once I’m signed in within My HealtheVet, how do I view my results?
        </h2>
        <div
          data-entity-id={3515}
          itemProp="acceptedAnswer"
          itemScope
          itemType="http://schema.org/Answer"
        >
          <div itemProp="text">
            <div
              data-template="paragraphs/wysiwyg"
              data-entity-id={3516}
              className="processed-content"
            >
              <p>
                On your Welcome page dashboard, you’ll see a module for “Health
                Records.” Within that module, click on “Labs and Tests.”
              </p>
              <p>
                This will take you to a new page with links to view test
                results.
              </p>
              <p>
                <strong>
                  If you’re signed in with a Premium account, you’ll see:
                </strong>
              </p>
              <ul>
                <li>
                  <strong>VA chemistry/hematology results:</strong> Your tests
                  will be listed by date and specimen. A specimen is the sample
                  studied by the test (like blood, urine, a tissue biopsy, or a
                  throat swab). You can click on each to view details from your
                  VA medical record.
                </li>
                <li>
                  <strong>Test results you’ve entered yourself:</strong> You can
                  add and view results from non-VA providers and labs.
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
      <div
        itemScope
        itemType="http://schema.org/Question"
        data-template="paragraphs/q_a"
        data-entity-id={3517}
        data-analytics-faq-section
        data-analytics-faq-text="Will my personal health information be protected?"
      >
        <h2 itemProp="name" id="will-my-personal-health-inform">
          Will my personal health information be protected?
        </h2>
        <div
          data-entity-id={3517}
          itemProp="acceptedAnswer"
          itemScope
          itemType="http://schema.org/Answer"
        >
          <div itemProp="text">
            <div
              data-template="paragraphs/wysiwyg"
              data-entity-id={3518}
              className="processed-content"
            >
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
      <div
        itemScope
        itemType="http://schema.org/Question"
        data-template="paragraphs/q_a"
        data-entity-id={3519}
        data-analytics-faq-section
        data-analytics-faq-text="What if I have more questions?"
      >
        <h2 itemProp="name" id="what-if-i-have-more-questions">
          What if I have more questions?
        </h2>
        <div
          data-entity-id={3519}
          itemProp="acceptedAnswer"
          itemScope
          itemType="http://schema.org/Answer"
        >
          <div itemProp="text">
            <div
              data-template="paragraphs/wysiwyg"
              data-entity-id={3520}
              className="processed-content"
            >
              <p>
                You can get answers to your questions about this tool within our
                My HealtheVet web portal.
                <br />
                <a
                  href="https://www.myhealth.va.gov/mhv-portal-web/web/myhealthevet/faqs#LabsandTests"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Read the Labs + Tests FAQs
                </a>
              </p>
              <p>
                You can also contact the My HealtheVet help desk.
                <br />
                <a
                  href="https://www.myhealth.va.gov/mhv-portal-web/web/myhealthevet/contact-mhv"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Find out how to contact us online
                </a>
                <br />
                Or call us at{' '}
                <a aria-label="8 7 7. 3 2 7. 0 0 2 2." href="tel:18773270022">
                  877-327-0022
                </a>{' '}
                (TTY: <Telephone contact={CONTACTS.HELP_TTY} />
                ). We’re here Monday through Friday, 7:00 a.m. to 7:00 p.m. CT.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </>
);

export default LegacyContent;
