// Node modules.
import React from 'react';
// Relative imports.
import CallToActionWidget from 'platform/site-wide/cta-widget';
import CernerCallToAction from '../../../components/CernerCallToAction';
import MoreInfoAboutBenefits from '../../../components/MoreInfoAboutBenefits';

const callToActions = [
  {
    deriveHeaderText: facilityNames =>
      `Manage appointments with ${facilityNames}`,
    href: '',
    label: 'Go to My VA Health',
  },
  {
    deriveHeaderText: () =>
      `Manage appointments at all other VA medical centers`,
    href: '',
    label: 'Go to My HealtheVet',
  },
];

export const AuthContent = () => (
  <>
    <div className="usa-alert usa-alert-info" role="alert">
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
    <div className="processed-content">
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
    <CernerCallToAction callToActions={callToActions} type="these" />
    <div>
      <div itemScope itemType="http://schema.org/Question">
        <h2 itemProp="name" id="how-can-va-appointment-tools-h">
          How can VA appointment tools help me manage my health care?
        </h2>
        <div
          itemProp="acceptedAnswer"
          itemScope
          itemType="http://schema.org/Answer"
        >
          <div itemProp="text">
            <div className="processed-content">
              <p>
                These appointment tools offer a secure, online way to schedule,
                view, and organize your VA appointments. The appointments you
                can schedule online depends on the facility, the type of health
                service, and other factors.
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
                <li>Print a list of your future appointments</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
      <div itemScope itemType="http://schema.org/Question">
        <h2 itemProp="name" id="am-i-eligible-to-use-the-va-ap">
          Am I eligible to use the VA appointment tools?
        </h2>
        <div
          itemProp="acceptedAnswer"
          itemScope
          itemType="http://schema.org/Answer"
        >
          <div itemProp="text">
            <div className="processed-content">
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
                <strong>And you must have one of these free accounts:</strong>
              </p>
              <ul>
                <li>
                  A{' '}
                  <a
                    href="https://www.myhealth.va.gov/mhv-portal-web/my-healthevet-offers-three-account-types"
                    target="_blank"
                    rel="noopener noreferrer"
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
        <h2 itemProp="name" id="how-do-i-know-if-my-va-health-">
          How do I know if my VA health facility uses online scheduling?
        </h2>
        <div
          itemProp="acceptedAnswer"
          itemScope
          itemType="http://schema.org/Answer"
        >
          <div itemProp="text">
            <div className="processed-content">
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

      <div itemScope itemType="http://schema.org/Question">
        <h2 itemProp="name" id="can-i-use-this-tool-to-schedul">
          Can I use this tool to schedule non-VA appointments?
        </h2>
        <div
          itemProp="acceptedAnswer"
          itemScope
          itemType="http://schema.org/Answer"
        >
          <div itemProp="text">
            <div className="processed-content">
              <p>
                It depends on the VA health management portal you are using.
                Once you&apos;re signed in to the appointments tool, you&apos;ll
                be able to see what providers you can schedule with online.
              </p>
            </div>
          </div>
        </div>
      </div>
      <div itemScope itemType="http://schema.org/Question">
        <h2 itemProp="name" id="can-i-schedule-appointments-th">
          Can I schedule appointments through VA Secure Messaging?
        </h2>
        <div
          itemProp="acceptedAnswer"
          itemScope
          itemType="http://schema.org/Answer"
        >
          <div itemProp="text">
            <div className="processed-content">
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
                  If you have questions about scheduling an appointment
                </strong>
                , please go to the{' '}
                <a
                  href="https://www.myhealth.va.gov/mhv-portal-web/faqs#Appointments"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  VA Appointments FAQs
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
                  If you have questions about appointment scheduling on My VA
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

      <MoreInfoAboutBenefits />
    </div>
  </>
);

export default AuthContent;
