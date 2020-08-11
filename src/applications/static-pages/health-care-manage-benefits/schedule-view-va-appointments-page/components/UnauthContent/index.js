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
        appointments is usually to call the VA or community care health facility
        where you want to receive care. If you can’t keep an existing
        appointment, please contact the facility as soon as possible to
        reschedule or cancel.
        <br />
        <a href="/find-locations/">
          Find your VA health facility’s phone number
        </a>
      </p>
      <h2 id="view-schedule-or-cancel-a-va-a">
        View, schedule, or cancel a VA appointment online
      </h2>
    </div>
    <CallToActionWidget appId="view-appointments" setFocus={false} />
    <h2>How can the VA appointments tool help me manage my care?</h2>
    <p>
      This tool offers a secure, online way to schedule, view, and organize your
      VA and community care appointments. The appointments you can schedule
      online depend on your facility, the type of health service, and other
      factors.
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
        Find the location of the VA or community care facility for your
        appointments
      </li>
      <li>Print a list of your future appointments</li>
    </ul>
    <h2>Am I eligible to use this tool?</h2>
    <p>
      You can use this tool if you meet all of the requirements listed below.
    </p>
    <p>
      <strong>All of these must be true. You’re</strong>
    </p>
    <ul>
      <li>
        Enrolled in VA health care, <strong>and</strong>
      </li>
      <li>
        Scheduling your appointment with a VA health facility that uses online
        scheduling, <strong>and</strong>
      </li>
      <li>Registered or you’ve had an appointment at that facility before</li>
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
          href="https://www.myhealth.va.gov/mhv-portal-web/upgrade-account-to-premium#UpgradeToPremiumAccount"
          rel="noreferrer noopener"
        >
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
        <a href="https://api.id.me/en/registration/new">
          create here on VA.gov
        </a>
      </li>
    </ul>
    <h2>How do I know if my VA health facility uses online scheduling?</h2>
    <p>
      Online scheduling is available at all VA health facilities except those in
      these locations:
    </p>
    <ul>
      <li>Indianapolis, IN</li>
      <li>Manila, Philippines</li>
    </ul>
    <p>
      <strong>Note:</strong> Online scheduling is available for some types of
      health services. We hope to expand the types of appointments and health
      services available through online scheduling in the future.
    </p>
    <h2>What types of VA health appointments can I schedule online?</h2>
    <p>
      It depends on the VA health facility where you’re receiving care. You can
      typically schedule an appointment online for the types of care that don’t
      require a referral.
    </p>
    <p>
      Once you’re signed in to the appointments tool, you’ll find the types of
      appointments you can schedule online at your registered health facility.
      You can also check with the facility where you receive care about
      scheduling appointments online.
    </p>
    <a href="/find-locations">Find a VA health facility</a>
    <h2>Can I use these tools to schedule community (non-VA) appointments?</h2>
    <p>
      Yes. If you’re eligible to receive care from a community provider outside
      of VA, you can use these tools to submit appointment requests. You must
      receive prior approval from us before getting care from a community
      provider. <br />
    </p>
    <a href="/communitycare/programs/veterans/index.asp">
      Learn more about community care
    </a>
    <br />
    <br />
    <a href="find-locations/">Find a community provider in the VA network</a>
    <h2>Can I schedule appointments through VA secure messaging?</h2>
    <p>
      If you use secure messaging with your VA health care team, you may be able
      to use this service to schedule and cancel appointments.
    </p>
    <a href="/health-care/secure-messaging/">
      Learn more about secure messaging
    </a>
    <p>
      <strong>Please note:</strong> The fastest way to schedule appointments is
      usually to call the VA health facility where you get care. To reschedule
      or cancel an existing appointment, please contact your facility as soon as
      possible.
    </p>
    <a href="/find-locations">Find your VA health facility’s phone number</a>
    <h2>Will my personal health information be protected?</h2>
    <p>
      Yes. This is a secure website. We follow strict security policies and
      practices to protect your personal health information. And only you and
      your VA health care team will have access to your secure messages.
    </p>
    <p>
      If you print or download any messages, you’ll need to take responsibility
      for protecting that information.
    </p>
    <a
      rel="noreferrer noopener"
      href="https://www.myhealth.va.gov/mhv-portal-web/web/myhealthevet/protecting-your-personal-health-information"
    >
      Get tips for protecting your personal health information
    </a>
    <h2>What if I have more questions?</h2>
    <h3>For help scheduling a VA or community care appointment</h3>
    <p>
      Please call{' '}
      <a href="tel: 18774705947" aria-label="8 7 7. 4 7 0. 5 9 4 7.">
        877-470-5947
      </a>{' '}
      (
      <a href="tel:711" aria-label="TTY. 7 1 1.">
        711
      </a>
      ). We’re here Monday through Friday, 8:00 a.m. to 8:00 p.m. ET.
    </p>
    <h3>For questions about joining a VA Video Connect appointment</h3>
    <p>
      Please call{' '}
      <a href="tel: 18666513180" aria-label="8 6 6. 6 5 1. 3 1 8 0.">
        866-651-3180
      </a>{' '}
      (
      <a href="tel:711" aria-label="TTY. 7 1 1.">
        711
      </a>
      ). We’re here Monday through Saturday, 7:00 a.m. to 11:00 p.m. ET.
    </p>
    <MoreInfoAboutBenefits />
  </>
);

export default UnauthContent;
