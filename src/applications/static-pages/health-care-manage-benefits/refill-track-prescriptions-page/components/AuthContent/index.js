// Node modules.
import React from 'react';
// Relative imports.
import CallToActionWidget from 'platform/site-wide/cta-widget';
import CernerCallToAction from '../../../components/CernerCallToAction';

const callToActions = [
  {
    deriveHeaderText: facilityNames =>
      `Refill prescriptions from ${facilityNames}`,
    href: '',
    label: 'Refill prescriptions on My VA Health',
  },
  {
    deriveHeaderText: () =>
      `Refill prescriptions from another VA Medical Center`,
    href: '',
    label: 'Refill prescriptions on My HealtheVet',
  },
];

export const AuthContent = () => (
  <>
    <CernerCallToAction
      callToActions={callToActions}
      type="VA Prescription Refill and Tracking"
    />
    <div>
      <div itemScope itemType="http://schema.org/Question">
        <h2 itemProp="name" id="how-can-the-va-prescription-re">
          How can the VA Prescription Refill and Tracking tools help me manage
          my health care?
        </h2>
        <div
          itemProp="acceptedAnswer"
          itemScope
          itemType="http://schema.org/Answer"
        >
          <div itemProp="text">
            <div className="processed-content">
              <p>
                The Prescription Refill and Tracking tools on My HealtheVet and
                My HealtheVet are web-based services that help you manage your
                VA prescriptions online.
              </p>
              <p>
                <strong>With these tools, you can:</strong>
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
                You can use these tools if you meet all of the requirements
                listed below.
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
                <strong>
                  If you&apos;re refilling and tracking prescriptions on My VA
                  Health
                </strong>
              </p>
              <p>
                In the navigation menu, you&apos;ll see a section titled
                &quot;Pharmacy.&quot; Within that section, you&apos;ll see these
                options:
              </p>
              <ul>
                <li>&quot;View current medications&quot;</li>
                <li>&quot;View comprehensive medications&quot;</li>
              </ul>
              <p>
                Click into the medication list you want, and you&apos;ll see the
                right medication list. For each medication, you will see options
                to refill and renew.
              </p>

              <p>
                <strong>
                  If you&apos;re refilling and tracking prescriptions on My
                  HealtheVet
                </strong>
              </p>
              <p>
                On your Welcome page, you&apos;ll see a module for
                &quot;Pharmacy.&quot; Within that module, you&apos;ll see these
                options:
              </p>
              <ul>
                <li>&quot;Refill VA Prescriptions&quot;</li>
                <li>&quot;Track Delivery&quot;</li>
                <li>&quot;Medications List&quot;</li>
              </ul>
              <p>
                Click on the link you want, and you&apos;ll get instructions on
                the next page to get started.
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
                If you receive care at both Mann-Grandstaff VA medical center
                and another VA facility, you may need to use both web portals to
                refill and track VA prescriptions.
              </p>
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
                within My HealtheVet or My VA Health, it does{' '}
                <strong>not</strong> change your address for prescription
                shipments. Please contact the VA health facility where you get
                care to have them update your address on file.
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
                website of the delivery service shown in My HealtheVet or My VA
                Health.
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
                <strong>
                  If you have questions about VA Presecription Refill and
                  Tracking on MyHealtheVet
                </strong>
                , please go to the{' '}
                <a
                  href="https://www.myhealth.va.gov/mhv-portal-web/web/myhealthevet/faqs#PrescriptionRefill"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Prescription Refills FAQs
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
                  If you have questions about VA Prescription Refill and
                  Tracking on My VA Health
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
