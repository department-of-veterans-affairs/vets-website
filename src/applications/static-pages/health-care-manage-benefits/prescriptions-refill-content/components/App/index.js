// Node modules.
import React from 'react';
// Relative imports.
import './styles.scss';
import CallToActionWidget from 'platform/site-wide/cta-widget';

export const App = () => (
  <>
    <CallToActionWidget appId="rx" setFocus={false} />
    <div>
      <div itemScope itemType="http://schema.org/Question">
        <h2 itemProp="name" id="how-can-the-va-prescription-re">
          How can the VA Prescription Refill and Tracking tool help me manage my
          health care?
        </h2>
        <div
          itemProp="acceptedAnswer"
          itemScope
          itemType="http://schema.org/Answer"
        >
          <div itemProp="text">
            <div className="processed-content">
              <p>
                Our Prescription Refill and Tracking tool is a web-based service
                that helps you manage your VA prescriptions online.
              </p>
              <p>
                <strong>With this tool, you can:</strong>
              </p>
              <ul>
                <li>Refill your VA prescriptions online</li>
                <li>View your past and current VA prescriptions</li>
                <li>
                  Track the delivery of each prescription mailed within the past
                  30 days
                </li>
                <li>
                  Get email notifications to let you know when to expect your
                  prescriptions
                </li>
                <li>
                  Create lists to keep track of all your medicines (including
                  prescriptions, over-the-counter medicines, herbal remedies,
                  and supplements)
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
      <div itemScope itemType="http://schema.org/Question">
        <h2 itemProp="name" id="am-i-eligible-to-use-this-tool">
          Am I eligible to use this tool?
        </h2>
        <div
          itemProp="acceptedAnswer"
          itemScope
          itemType="http://schema.org/Answer"
        >
          <div itemProp="text">
            <div className="processed-content">
              <p>
                You can use this tool if you meet all of the requirements listed
                below.
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
                  Have a refillable prescription from a VA doctor that you’ve
                  filled at a VA pharmacy and that’s being handled by the VA
                  Mail Order Pharmacy
                </li>
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
            </div>
          </div>
        </div>
      </div>
      <div itemScope itemType="http://schema.org/Question">
        <h2 itemProp="name" id="once-im-signed-in-how-do-i-get">
          Once I’m signed in, how do I get started?
        </h2>
        <div
          itemProp="acceptedAnswer"
          itemScope
          itemType="http://schema.org/Answer"
        >
          <div itemProp="text">
            <div className="processed-content">
              <p>
                On your Welcome page, you’ll see a module for “Pharmacy.” Within
                that module, you’ll see these options:
              </p>
              <ul>
                <li>“Refill VA Prescriptions”</li>
                <li>“Track Delivery”</li>
                <li>“Medications List”</li>
              </ul>
              <p>
                Click on the link you want, and you’ll get instructions on the
                next page to get started.
              </p>
            </div>
          </div>
        </div>
      </div>
      <div itemScope itemType="http://schema.org/Question">
        <h2 itemProp="name" id="can-i-use-this-tool-to-refill-">
          Can I use this tool to refill and track all my VA prescriptions?
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
                  You can refill and track most of your VA prescriptions,
                  including:
                </strong>
              </p>
              <ul>
                <li>VA medicines that were refilled or renewed</li>
                <li>Wound care supplies</li>
                <li>Diabetic supplies</li>
                <li>
                  Other products and supplies sent through the VA Mail Order
                  Pharmacy
                </li>
              </ul>
              <p>
                Your VA health care team may decide not to ship medicines that
                you don’t need right away, medicines that are not commonly
                prescribed, or those that require you to be closely monitored.
                In these cases, you’ll need to pick up your prescription from
                the VA health facility where you get care.
              </p>
              <p>
                You can’t refill some medicines, like certain pain medication
                and narcotics. You’ll need to get a new prescription from your
                VA provider each time you need more of these medicines.
              </p>
            </div>
          </div>
        </div>
      </div>
      <div itemScope itemType="http://schema.org/Question">
        <h2 itemProp="name" id="where-will-va-send-my-prescrip">
          Where will VA send my prescriptions?
        </h2>
        <div
          itemProp="acceptedAnswer"
          itemScope
          itemType="http://schema.org/Answer"
        >
          <div itemProp="text">
            <div className="processed-content">
              <p>
                Our mail order pharmacy will send your prescriptions to the
                address we have on file for you. We ship to all addresses in the
                United States and its territories. We don’t ship prescriptions
                to foreign countries.
              </p>
              <p>
                <strong>Important note:</strong> If you change your address
                within My HealtheVet, it does <strong>not</strong> change your
                address for prescription shipments. Please contact the VA health
                facility where you get care to have them update your address on
                file.
                <br />
                <a href="/find-locations/">Find your VA health facility</a>
              </p>
            </div>
          </div>
        </div>
      </div>
      <div itemScope itemType="http://schema.org/Question">
        <h2 itemProp="name" id="how-long-will-my-prescriptions">
          How long will my prescriptions take to arrive, and when should I
          reorder?
        </h2>
        <div
          itemProp="acceptedAnswer"
          itemScope
          itemType="http://schema.org/Answer"
        >
          <div itemProp="text">
            <div className="processed-content">
              <p>
                Prescriptions usually arrive within 3 to 5 days. But you’ll be
                able to find specific information about your order on the
                website of the delivery service shown in your Rx Tracker.
              </p>
              <p>
                To make sure you have your medicine in time, you’ll want to
                request your refill at least 10 days before you’ll run out of
                your current prescription.
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
                If you print or download anything from the website (like
                prescription details), you’ll need to take responsibility for
                protecting that information.
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
                If you have questions about prescriptions and refills on
                MyHealtheVet, please go to the{' '}
                <a
                  href="https://www.myhealth.va.gov/mhv-portal-web/web/myhealthevet/faqs#PrescriptionRefill"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Prescription refills FAQs
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
            </div>
          </div>
        </div>
      </div>
    </div>
  </>
);

export default App;
