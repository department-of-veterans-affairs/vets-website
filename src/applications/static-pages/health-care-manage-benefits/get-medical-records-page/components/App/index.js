// Node modules.
import React from 'react';
// Relative imports.
import './styles.scss';
import CallToActionWidget from 'platform/site-wide/cta-widget';

export const App = () => (
  <>
    <div className="processed-content">
      <h2 id="va-blue-button">VA Blue Button</h2>
    </div>
    <CallToActionWidget appId="health-records" setFocus={false} />
    <div>
      <h2 id="more-about-va-blue-button">More about VA Blue Button</h2>
      <div itemScope itemType="http://schema.org/Question">
        <h3 itemProp="name" id="whats-va-blue-button-and-how-c">
          What's VA Blue Button, and how can it help me manage my health care?
        </h3>
        <div
          itemProp="acceptedAnswer"
          itemScope
          itemType="http://schema.org/Answer"
        >
          <div itemProp="text">
            <div className="processed-content">
              <p>
                VA Blue Button is a feature of the health management portal
                within My HealtheVet. It lets you view, print, save, download,
                and share information from your VA medical record and personal
                health record. With this tool, you can better manage your health
                needs and communicate with your health care team.
              </p>
              <p>
                <strong>With VA Blue Button, you can:</strong>
              </p>
              <ul>
                <li>
                  Download a customized Blue Button report with information from
                  your VA medical records, personal health record, and in some
                  cases your military service record
                </li>
                <li>
                  Download a Health Summary that includes specific information
                  from your VA medical record (like your known allergies,
                  medications, and recent lab results)
                </li>
                <li>
                  Build your own personal health record that includes
                  information like your self-entered medical history, emergency
                  contacts, and medicines
                </li>
                <li>
                  Monitor your vital signs and track your diet and exercise with
                  our online journals
                </li>
                <li>
                  Share a digital copy of the personal health information you
                  entered yourself with your VA health care team through Secure
                  Messaging
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
      <div itemScope itemType="http://schema.org/Question">
        <h3 itemProp="name" id="am-i-eligible-to-use-all-the-f">
          Am I eligible to use all the features of VA Blue Button?
        </h3>
        <div
          itemProp="acceptedAnswer"
          itemScope
          itemType="http://schema.org/Answer"
        >
          <div itemProp="text">
            <div className="processed-content">
              <p>
                You can use all the features of this tool if you meet all of the
                requirements listed below.
              </p>
              <p>
                <strong>Both of these must be true. You’re:</strong>
              </p>
              <ul>
                <li>
                  Are enrolled in VA health care, <strong>and</strong>
                </li>
                <li>Are registered as a patient in a VA health facility</li>
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
                  <a href="">
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
                account, you&apos;ll see only the results you&apos;ve entered
                yourself.
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
        <h3 itemProp="name" id="once-im-signed-in-how-do-i-get">
          Once I’m signed in, how do I get to my medical records?
        </h3>
        <div
          itemProp="acceptedAnswer"
          itemScope
          itemType="http://schema.org/Answer"
        >
          <div itemProp="text">
            <div className="processed-content">
              <p>
                Go to your Welcome page dashboard, and click on “Health
                Records.” You’ll go to a new page.
              </p>
              <p>
                From here, you can choose to access your VA Blue Button report,
                your VA Health Summary, or your VA Medical Images and Reports.
              </p>
              <p>
                If you’d like to add information to your personal health record,
                click on “Track Health” in the blue navigation menu at the top
                of the page. You’ll go to a new page where you can choose to
                record information like your vital signs, health history, goals,
                and food and exercise efforts.
              </p>
            </div>
          </div>
        </div>
      </div>
      <div itemScope itemType="http://schema.org/Question">
        <h3 itemProp="name" id="will-my-personal-health-inform">
          Will my personal health information be protected?
        </h3>
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
                If you print or download anything from the website, you’ll need
                to take responsibility for protecting that information.
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
        <h3 itemProp="name" id="what-if-i-have-more-questions">
          What if I have more questions?
        </h3>
        <div
          itemProp="acceptedAnswer"
          itemScope
          itemType="http://schema.org/Answer"
        >
          <div itemProp="text">
            <div className="processed-content">
              <p>
                You can get answers to frequently asked questions about VA Blue
                Button and related tools within My HealtheVet.
              </p>
              <p>
                <a
                  href="https://www.myhealth.va.gov/mhv-portal-web/web/myhealthevet/faqs#bbtop"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Read VA Blue Button FAQs
                </a>
                <br />
                <a
                  href="https://www.myhealth.va.gov/mhv-portal-web/faqs#CCD"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Read VA Health Summary FAQs
                </a>
                <br />
                <a
                  href="https://www.myhealth.va.gov/mhv-portal-web/faqs#VAMIR"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Read VA Medical Images and Reports FAQs
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
              </p>
              <p>
                Or call us at <a href="tel:+18773270022">877-327-0022</a> (TTY:{' '}
                <a href="tel:+18008778339">800-877-8339</a>
                ). We’re here Monday through Friday, 8:00 a.m. to 8:00 p.m. ET.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div>
      <h2 id="the-veterans-health-informatio">
        The Veterans Health Information Exchange
      </h2>
      <div itemScope itemType="http://schema.org/Question">
        <h3 itemProp="name" id="whats-the-veterans-health-info">
          What is the Veterans Health Information Exchange (VHIE), and how can
          it help me manage my health care?
        </h3>
        <div
          itemProp="acceptedAnswer"
          itemScope
          itemType="http://schema.org/Answer"
        >
          <div itemProp="text">
            <div className="processed-content">
              <p>
                The Veterans Health Information Exchange (VHIE) program lets us
                share your health information with participating community care
                providers and the Department of Defense. For example, when you
                leave activey-duty service, retire, or leave the Reserves and
                then get health care at VA or a VA-approved community care
                provider, your health record would electronically follow you.
              </p>
              <p>
                This program is voluntary, and you can choose not to share your
                information. If you choose not to share your information but
                change your mind later, you can opt back in to sharing your
                information at any time.
              </p>
              <p>
                <strong>The sharing of health information:</strong>
              </p>
              <ul>
                <li>
                  Helps your VA and non-VA providers better coordinate your
                  care.
                </li>
                <li>Keeps your personal health information more secure.</li>
                <li>
                  Improves your care by helping your providers make mroe
                  informed decisions.
                </li>
                <li>
                  Ensures your providers have up-to-date information, like your
                  current medications and allergies.
                </li>
                <li>Saves you time and money.</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
      <div itemScope itemType="http://schema.org/Question">
        <h3 itemProp="name" id="vhie-sharing-options">
          Can I opt out of sharing my information?
        </h3>
        <div
          itemProp="acceptedAnswer"
          itemScope
          itemType="http://schema.org/Answer"
        >
          <div itemProp="text">
            <div className="processed-content">
              <p>Yes. You can opt out of sharing by mail or in person.</p>
              <h4>To opt out by mail</h4>
              <p>
                Fill out, sign, and date VA Form 10-10164 (Opt Out of Sharing
                Protected Health Information).
              </p>
              <p>
                <a href="https://va.gov/vaforms/medical/pdf/10-10164-fill.pdf">
                  Download VA Form 10-10164 (PDF)
                </a>
              </p>
              <br />
              <p>
                Mail the completed form to the Release of Information (ROI)
                office at your nearest VA medical center.
              </p>
              <p>
                <a href="">
                  Find the address for your nearest VA medical center
                </a>
              </p>
              <h4>To opt out in person</h4>
              <p>Visit your VA medical center&apos;s ROI office.</p>
              <p>
                Bring a completed VA Form 10-10164 with you, or ask for a copy
                to fill out in the office. Give your completed, signed form to
                an office staff member.
              </p>
            </div>
          </div>
        </div>
      </div>
      <div itemScope itemType="http://schema.org/Question">
        <h3 itemProp="name" id="can-i-change-my-mind-share-information-later">
          Can I change my mind if I want to share my information later?
        </h3>
        <div
          itemProp="acceptedAnswer"
          itemScope
          itemType="http://schema.org/Answer"
        >
          <div itemProp="text">
            <div className="processed-content">
              <p>
                Yes. If you change your mind and want to share your health
                information, complete and submit VA Form 10-10163 (Request for
                and Permission to Participate in Sharing Protected Health
                Information).
              </p>
              <p>
                <a href="https://va.gov/vaforms/medical/pdf/10-10163-fill.pdf">
                  Download VA Form 10-10163 (PDF)
                </a>
              </p>
              <p>
                Mail or take this form in person to the Release of Information
                (ROI) office at your nearest VA medical center.
              </p>
              <p>
                <a href="">
                  Find the address of your nearest VA medical center
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
      <div itemScope itemType="http://schema.org/Question">
        <h3
          itemProp="name"
          id="will-my-personal-health-information-be-protected"
        >
          Will my personal health information be protected?
        </h3>
        <div
          itemProp="acceptedAnswer"
          itemScope
          itemType="http://schema.org/Answer"
        >
          <div itemProp="text">
            <div className="processed-content">
              <p>
                Yes. The Veterans Health Information Exchange uses secure
                technology to share information between VA and participating
                community health care providers who treat you. We share
                information only with community care providers and organizations
                that have partnership agreements with us and are part of our
                approved, trusted network.
              </p>
            </div>
          </div>
        </div>
      </div>
      <div itemScope itemType="http://schema.org/Question">
        <h3 itemProp="name" id="what-if-i-have-more-questions">
          What if I have more questions?
        </h3>
        <div
          itemProp="acceptedAnswer"
          itemScope
          itemType="http://schema.org/Answer"
        >
          <div itemProp="text">
            <div className="processed-content">
              <p>
                Call us toll-free at <a href="tel:+18446982311">844-698-2311</a>
                .
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </>
);

export default App;
