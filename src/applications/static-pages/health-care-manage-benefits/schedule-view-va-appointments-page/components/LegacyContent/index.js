// Node modules.
import React from 'react';
import Telephone, {
  CONTACTS,
  PATTERNS,
} from '@department-of-veterans-affairs/component-library/Telephone';
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
        <h2
          className="usa-alert-heading vads-u-font-size--h3 vads-u-margin-bottom--2"
          id="due-to-covid-19-you-can-only-r"
        >
          Due to COVID-19, we&apos;ll need to contact you to confirm your
          appointment
        </h2>
        <p className="vads-u-margin--0">
          You can still use our online appointments tool to request an
          appointment. We&apos;ll then contact you to confirm the date, time,
          and location.
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
        appointments is usually to call the VA or community health facility
        where you want to receive care. If you can’t keep an existing
        appointment, please contact the facility as soon as possible to
        reschedule or cancel.
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
          How can the VA appointments tool help me manage my health care?
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
                This tool offers a secure, online&nbsp;way to schedule, view,
                and organize your VA and community care appointments. The
                appointments you can schedule online depend on your facility,
                the type of health service, and other factors.
              </p>
              <p>
                <strong>You can use this tool to:</strong>
              </p>
              <ul>
                <li>Schedule some of your VA health appointments online</li>
                <li>Request approved community care appointments online</li>
                <li>Cancel appointments made online</li>
                <li>View appointments on your health calendar</li>
                <li>
                  Find the location of the VA or community care facility for
                  your appointments
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
        data-analytics-faq-text="Am I eligible to use this tool?"
      >
        <h2 itemProp="name" id="am-i-eligible-to-use-the-va-ap">
          Am I eligible to use this tool?
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
                You can use this tool if you meet all of the requirements listed
                below.
              </p>
              <p>
                <strong>All of these must be true. You&apos;re:</strong>
              </p>
              <ul>
                <li>
                  <a
                    data-entity-substitution="canonical"
                    data-entity-type="node"
                    data-entity-uuid="f8323733-28cd-497d-b536-349005be9b71"
                    href="/health-care/how-to-apply"
                    title="How to apply for VA health care"
                  >
                    Enrolled in VA health care
                  </a>
                  , <strong>and</strong>
                </li>
                <li>
                  Scheduling your appointment with a VA or community care health
                  facility that uses online scheduling, <strong>and</strong>
                </li>
                <li>
                  Registered or you’ve had an appointment at that facility
                  before
                </li>
              </ul>
              <a href="/health-care/how-to-apply/">
                Find out how to apply for VA health care
              </a>
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
          What types of health appointments can I schedule online?
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
              <p>
                Yes. If you’re eligible to receive care from a community
                provider outside of VA, you can use this tool to submit
                appointment requests. You must receive prior approval from us
                before getting care from a community provider.
              </p>
              <p>
                <a href="/communitycare/programs/veterans/index.asp">
                  Learn more about community care
                </a>
              </p>
              <p>
                <a href="/find-locations">
                  Find a community provider in the VA network
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
        <h3>For help scheduling a VA or community care appointment</h3>
        <p>
          Please call{' '}
          <a href="tel:18774705947" aria-label="8 7 7. 4 7 0. 5 9 4 7.">
            877-470-5947
          </a>{' '}
          (TTY:{' '}
          <Telephone contact={CONTACTS['711']} pattern={PATTERNS['911']} />
          ). We’re here Monday through Friday, 8:00 a.m. to 8:00 p.m. ET.
        </p>
        <h3>For questions about joining a VA Video Connect appointment</h3>
        <p>
          Please call{' '}
          <a href="tel:18666513180" aria-label="8 6 6. 6 5 1. 3 1 8 0.">
            866-651-3180
          </a>{' '}
          (TTY:{' '}
          <Telephone contact={CONTACTS['711']} pattern={PATTERNS['911']} />
          ). We’re here Monday through Saturday, 7:00 a.m. to 11:00 p.m. ET.
        </p>
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
                  <h3 className="va-nav-linkslist-title vads-u-font-size--h4">
                    Health care benefits eligibility
                  </h3>
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
                  <h3 className="va-nav-linkslist-title vads-u-font-size--h4">
                    How to apply for health care benefits
                  </h3>
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
                  <h3 className="va-nav-linkslist-title vads-u-font-size--h4">
                    Health needs and conditions
                  </h3>
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
                  <h3 className="va-nav-linkslist-title vads-u-font-size--h4">
                    Disability benefits
                  </h3>
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
