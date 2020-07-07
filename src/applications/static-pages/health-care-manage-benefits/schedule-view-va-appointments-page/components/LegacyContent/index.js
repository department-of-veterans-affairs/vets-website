// Node modules.
import React from 'react';
// Relative imports.
import CallToActionWidget from 'platform/site-wide/cta-widget';

export const LegacyContent = () => (
  <>
    <div
      data-template="blocks/alert"
      data-entity-id={38}
      className="usa-alert usa-alert-info"
      role="alert"
    >
      <div className="usa-alert-body">
        <h3 className="usa-alert-heading" id="due-to-covid-19-you-can-only-r">
          Due to COVID-19, you can only request an appointment online
        </h3>
        <p>
          You can’t directly schedule an appointment online at this time. Once
          you request your appointment, a scheduler will get back to you to
          confirm your request.
        </p>
        <p>
          To help us address the most urgent needs first, we ask that you don’t
          request routine appointments right now.
        </p>
      </div>
    </div>
    <div
      data-template="paragraphs/wysiwyg"
      data-entity-id={3457}
      className="processed-content"
    >
      <p>&nbsp;</p>
      <p>
        <strong>Please note:</strong> The fastest way to make all your VA
        appointments is usually to call the VA health facility where you want to
        receive care. If you can’t keep an existing appointment, please contact
        the facility as soon as possible to reschedule or cancel.
        <br />
        <a href="/find-locations/">
          Find your VA health facility’s phone number
        </a>
      </p>
      <h2 id="view-schedule-or-cancel-a-va-a">
        View, schedule, or cancel a VA appointment&nbsp;online
      </h2>
    </div>
    <CallToActionWidget appId="view-appointments" setFocus={false} />
    <div data-template="paragraphs/q_a_section" data-entity-id={3462}>
      <div
        itemScope
        itemType="http://schema.org/Question"
        data-template="paragraphs/q_a"
        data-entity-id={3461}
        data-analytics-faq-section
        data-analytics-faq-text="How can VA appointment tools help me manage my health care?"
      >
        <h2 itemProp="name" id="how-can-va-appointment-tools-h">
          How can VA appointment tools help me manage my health care?
        </h2>
        <div
          data-entity-id={3461}
          itemProp="acceptedAnswer"
          itemScope
          itemType="http://schema.org/Answer"
        >
          <div itemProp="text">
            <div
              data-template="paragraphs/wysiwyg"
              data-entity-id={3463}
              className="processed-content"
            >
              <p>
                VA appointment&nbsp;tools offer a secure, online&nbsp;way to
                schedule, view, and organize your VA appointments. The
                appointments you can schedule online depends on your facility,
                the type of health service, and other factors.
              </p>
              <p>
                <strong>You can use these tools to:</strong>
              </p>
              <ul>
                <li>Schedule some of your VA medical appointments online</li>
                <li>Cancel appointments made online</li>
                <li>View appointments on your health calendar</li>
                <li>
                  Find the location of the VA facility for your appointments
                </li>
                <li>Set up email reminders for upcoming appointments</li>
                <li>Print a list of your future appointments</li>
                <li>Look up past appointments from the last 2 years</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
      <div
        itemScope
        itemType="http://schema.org/Question"
        data-template="paragraphs/q_a"
        data-entity-id={3464}
        data-analytics-faq-section
        data-analytics-faq-text="Am I eligible to use the VA appointment tools?"
      >
        <h2 itemProp="name" id="am-i-eligible-to-use-the-va-ap">
          Am I eligible to use the VA appointment tools?
        </h2>
        <div
          data-entity-id={3464}
          itemProp="acceptedAnswer"
          itemScope
          itemType="http://schema.org/Answer"
        >
          <div itemProp="text">
            <div
              data-template="paragraphs/wysiwyg"
              data-entity-id={3465}
              className="processed-content"
            >
              <p>
                You can use the&nbsp;online appointment tools if you meet all of
                the requirements listed below.
              </p>
              <p>
                <strong>All of these must be true:</strong>
              </p>
              <ul>
                <li>
                  You're{' '}
                  <a
                    data-entity-substitution="canonical"
                    data-entity-type="node"
                    data-entity-uuid="f8323733-28cd-497d-b536-349005be9b71"
                    href="/health-care/how-to-apply"
                    title="How to apply for VA health care"
                  >
                    enrolled in VA health care
                  </a>
                  , <strong>and</strong>
                </li>
                <li>
                  You're scheduling your appointment with a VA health facility
                  that uses online scheduling, <strong>and</strong>
                </li>
                <li>
                  You're registered or you’ve had an appointment at that
                  facility before
                </li>
              </ul>
              <p>
                <strong>And, you must have one of these free accounts:</strong>
              </p>
              <ul>
                <li>
                  A{' '}
                  <a
                    href="https://www.myhealth.va.gov/mhv-portal-web/my-healthevet-offers-three-account-types"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Premium <strong>My HealtheVet</strong> account
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
      <div
        itemScope
        itemType="http://schema.org/Question"
        data-template="paragraphs/q_a"
        data-entity-id={3466}
        data-analytics-faq-section
        data-analytics-faq-text="How do I know if my VA health facility uses online scheduling?"
      >
        <h2 itemProp="name" id="how-do-i-know-if-my-va-health-">
          How do I know if my VA health facility uses online scheduling?
        </h2>
        <div
          data-entity-id={3466}
          itemProp="acceptedAnswer"
          itemScope
          itemType="http://schema.org/Answer"
        >
          <div itemProp="text">
            <div
              data-template="paragraphs/wysiwyg"
              data-entity-id={3467}
              className="processed-content"
            >
              <p>
                Online scheduling&nbsp;is available at all VA facilities except
                at the following locations:
              </p>
              <ul>
                <li>
                  <p>Columbus, OH</p>
                </li>
                <li>
                  <p>Indianapolis, IN</p>
                </li>
                <li>
                  <p>Manila, Philippines</p>
                </li>
              </ul>
              <p>
                Veterans who get care at the Chalmers P. Wylie Ambulatory Care
                Center in Columbus, Ohio,&nbsp;can currently use{' '}
                <a href="https://access.va.gov/accessva/?cspSelectFor=mass">
                  MyChart Online
                </a>
                &nbsp;to schedule, reschedule, and cancel their appointments
                online.
              </p>
              <p>
                <strong>Note: </strong>
                Online scheduling is available for some types of health
                services. We hope to expand the types of appointments and health
                services available through online scheduling&nbsp;in the future.
              </p>
            </div>
          </div>
        </div>
      </div>
      <div
        itemScope
        itemType="http://schema.org/Question"
        data-template="paragraphs/q_a"
        data-entity-id={3468}
        data-analytics-faq-section
        data-analytics-faq-text="What types of medical appointments can I schedule online?"
      >
        <h2 itemProp="name" id="what-types-of-medical-appointm">
          What types of medical appointments can I schedule online?
        </h2>
        <div
          data-entity-id={3468}
          itemProp="acceptedAnswer"
          itemScope
          itemType="http://schema.org/Answer"
        >
          <div itemProp="text">
            <div
              data-template="paragraphs/wysiwyg"
              data-entity-id={3469}
              className="processed-content"
            >
              <p>
                It depends on the VA health facility where you’re receiving
                care. You can typically schedule an appointment online for the
                types of care that don’t require a referral.
              </p>
              <p>
                Once you’re signed in to the appointments tool, you’ll be able
                to see what types of appointments you can schedule online at
                your registered health facility.&nbsp;&nbsp;You can also check
                with the facility where you receive care about scheduling
                appointments online.&nbsp;
              </p>
              <p>
                <a href="/find-locations/">Find a VA health facility</a>
              </p>
            </div>
          </div>
        </div>
      </div>
      <div
        itemScope
        itemType="http://schema.org/Question"
        data-template="paragraphs/q_a"
        data-entity-id={3470}
        data-analytics-faq-section
        data-analytics-faq-text="Can I use this tool to schedule non-VA appointments?"
      >
        <h2 itemProp="name" id="can-i-use-this-tool-to-schedul">
          Can I use this tool to schedule non-VA appointments?
        </h2>
        <div
          data-entity-id={3470}
          itemProp="acceptedAnswer"
          itemScope
          itemType="http://schema.org/Answer"
        >
          <div itemProp="text">
            <div
              data-template="paragraphs/wysiwyg"
              data-entity-id={3471}
              className="processed-content"
            >
              <p>No. At this time you can only schedule a VA appointment.</p>
            </div>
          </div>
        </div>
      </div>
      <div
        itemScope
        itemType="http://schema.org/Question"
        data-template="paragraphs/q_a"
        data-entity-id={3472}
        data-analytics-faq-section
        data-analytics-faq-text="Can I schedule appointments through VA Secure Messaging?"
      >
        <h2 itemProp="name" id="can-i-schedule-appointments-th">
          Can I schedule appointments through VA Secure Messaging?
        </h2>
        <div
          data-entity-id={3472}
          itemProp="acceptedAnswer"
          itemScope
          itemType="http://schema.org/Answer"
        >
          <div itemProp="text">
            <div
              data-template="paragraphs/wysiwyg"
              data-entity-id={3473}
              className="processed-content"
            >
              <p>
                If you use Secure Messaging with your VA health care team, you
                may be able to use this service to schedule and cancel
                appointments.&nbsp;
                <a href="/health-care/secure-messaging/">
                  Learn more about Secure Messaging
                </a>
              </p>
              <p>
                <strong>Please note:</strong> The fastest way to make all your
                VA appointments is usually to call the VA health facility where
                you&nbsp;get care. To reschedule or cancel an existing
                appointment, please contact your facility as soon as
                possible.&nbsp;
                <a href="/find-locations/">
                  Find your VA health facility’s phone number
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
        data-entity-id={3474}
        data-analytics-faq-section
        data-analytics-faq-text="Will my personal health information be protected?"
      >
        <h2 itemProp="name" id="will-my-personal-health-inform">
          Will my personal health information be protected?
        </h2>
        <div
          data-entity-id={3474}
          itemProp="acceptedAnswer"
          itemScope
          itemType="http://schema.org/Answer"
        >
          <div itemProp="text">
            <div
              data-template="paragraphs/wysiwyg"
              data-entity-id={3475}
              className="processed-content"
            >
              <p>
                Yes. This is a secure website. We follow strict security
                policies and practices to protect your personal health
                information. And only you and your VA health care team will have
                access to your secure messages.
              </p>
              <p>
                If you print or download any messages, you’ll need to take
                responsibility for protecting that information.
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
        data-entity-id={3476}
        data-analytics-faq-section
        data-analytics-faq-text="What if I have more questions?"
      >
        <h2 itemProp="name" id="what-if-i-have-more-questions">
          What if I have more questions?
        </h2>
        <div
          data-entity-id={3476}
          itemProp="acceptedAnswer"
          itemScope
          itemType="http://schema.org/Answer"
        >
          <div itemProp="text">
            <div
              data-template="paragraphs/wysiwyg"
              data-entity-id={3477}
              className="processed-content"
            >
              <p>
                You can get answers to your questions about these tools within
                our My HealtheVet web portal.
                <br />
                <a
                  href="https://www.myhealth.va.gov/mhv-portal-web/faqs#Appointments"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Read VA Appointments FAQs
                </a>
              </p>
              <p>
                You can also contact the My HealtheVet Help Desk.
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
                Or call us at{' '}
                <a aria-label="8 7 7. 3 2 7. 0 0 2 2." href="tel:18773270022">
                  877-327-0022
                </a>{' '}
                (TTY:{' '}
                <a aria-label="8 0 0. 8 7 7. 8 3 3 9." href="tel:18008778339">
                  800-877-8339
                </a>
                ). We’re here Monday through Friday, 7:00 a.m. to 7:00 p.m. CT.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div className="row">
      <div className="usa-content columns">
        <aside className="va-nav-linkslist va-nav-linkslist--related">
          <section
            data-template="paragraphs/list_of_link_teasers"
            data-entity-id={3452}
            className="field_related_links"
          >
            <h2
              id="more-information-about-your-benefits"
              className="va-nav-linkslist-heading"
            >
              More information about your benefits
            </h2>
            <ul className="va-nav-linkslist-list">
              <li
                data-template="paragraphs/linkTeaser"
                data-entity-id={3453}
                data-links-list-header="Health care benefits eligibility"
                data-links-list-section-header="More information about your benefits"
              >
                <a href="/health-care/eligibility">
                  <h4 className="va-nav-linkslist-title">
                    Health care benefits eligibility
                  </h4>
                  <p className="va-nav-linkslist-description">
                    Not sure if you qualify? Find out if you can get VA health
                    care benefits.
                  </p>
                </a>
              </li>
              <li
                data-template="paragraphs/linkTeaser"
                data-entity-id={3454}
                data-links-list-header="How to apply for health care benefits"
                data-links-list-section-header="More information about your benefits"
              >
                <a href="/health-care/how-to-apply">
                  <h4 className="va-nav-linkslist-title">
                    How to apply for health care benefits
                  </h4>
                  <p className="va-nav-linkslist-description">
                    Ready to apply? Get started now.
                  </p>
                </a>
              </li>
              <li
                data-template="paragraphs/linkTeaser"
                data-entity-id={3455}
                data-links-list-header="Health needs and conditions"
                data-links-list-section-header="More information about your benefits"
              >
                <a href="/health-care/health-needs-conditions">
                  <h4 className="va-nav-linkslist-title">
                    Health needs and conditions
                  </h4>
                  <p className="va-nav-linkslist-description">
                    Learn how to access VA services for mental health, women’s
                    health, and other specific needs.
                  </p>
                </a>
              </li>
              <li
                data-template="paragraphs/linkTeaser"
                data-entity-id={3456}
                data-links-list-header="Disability benefits"
                data-links-list-section-header="More information about your benefits"
              >
                <a href="/disability">
                  <h4 className="va-nav-linkslist-title">
                    Disability benefits
                  </h4>
                  <p className="va-nav-linkslist-description">
                    Have an illness or injury that was caused—or made worse—by
                    your active-duty service? Find out if you can get disability
                    compensation (monthly payments) from VA.
                  </p>
                </a>
              </li>
            </ul>
          </section>
        </aside>
      </div>
    </div>
  </>
);

export default LegacyContent;
