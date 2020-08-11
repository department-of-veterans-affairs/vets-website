// Node modules.
import React from 'react';
import Telephone, {
  CONTACTS,
  PATTERNS,
} from '@department-of-veterans-affairs/formation-react/Telephone';
// Relative imports.
import CernerCallToAction from '../../../components/CernerCallToAction';
import MoreInfoAboutBenefits from '../../../components/MoreInfoAboutBenefits';
import { getCernerURL } from 'platform/utilities/cerner';

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
        View, schedule, or cancel a VA appointment&nbsp;online
      </h2>
    </div>
    <CernerCallToAction
      linksHeaderText="Manage appointments at:"
      myHealtheVetLink="https://staging.va.gov/health-care/schedule-view-va-appointments/appointments"
      myVAHealthLink={getCernerURL('/pages/scheduling/upcoming')}
    />
    <h2>How can these appointment tools help me manage my care?</h2>
    <p>
      These tools offer a secure, online way to schedule, view, and organize
      your VA and community care appointments. The appointments you can schedule
      online depend on your facility, the type of health service, and other
      factors.
    </p>
    <p>
      <strong>You can use these tools to:</strong>
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

    <h2>Am I eligible to use these tools?</h2>
    <p>
      You can use these tools if you meet all of the requirements listed below.
    </p>
    <p>
      <strong>All of these must be true. You’re:</strong>
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
    <a href="/health-care/how-to-apply">
      Find out how to apply for VA health care
    </a>
    <p>
      <strong>And, you must have one of these free accounts:</strong>
    </p>
    <ul>
      <li>
        A{' '}
        <a href="https://www.myhealth.va.gov/mhv-portal-web/upgrade-account-to-premium#UpgradeToPremiumAccount">
          Premium <strong>My HealtheVet</strong> account
        </a>
        , or
      </li>
      <li>
        A Premium <strong>DS Logon</strong> account (used for eBenefits and
        milConnect), <strong>or</strong>
      </li>
      <li>
        A verified <strong>ID.me</strong> account that you can{' '}
        <a href="https://api.id.me/en/registration/new">
          create here on VA.gov
        </a>
      </li>
    </ul>
    <h2>How do I know if my VA health facility uses online scheduling?</h2>
    <p>
      Online scheduling is available at all VA facilities except those in these
      2 locations:
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
    <h2>Can I use these tools to schedule community (non-VA) appointments?</h2>
    <p>
      Yes. If you’re eligible to receive care from a community provider outside
      of VA, you can use these tools to submit appointment requests. You must
      receive prior approval from us before getting care from a community
      provider.
    </p>
    <a
      href="/communitycare/programs/veterans/index.asp"
      rel="noreferrer noopener"
    >
      Learn more about community care
    </a>
    <br />
    <br />
    <a href="/find-locations">Find a community provider in the VA network</a>
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
      Yes. Our health management portals are secure websites. We follow strict
      security policies and practices to protect your personal health
      information. And only you and your VA health care team will have access to
      your secure messages.
    </p>
    <p>
      If you print or download any messages, you’ll need to take responsibility
      for protecting that information.
    </p>
    <a
      href="https://www.myhealth.va.gov/mhv-portal-web/web/myhealthevet/protecting-your-personal-health-information"
      rel="noreferrer noopener"
    >
      Get tips for protecting your personal health information
    </a>
    <h2>What if I have more questions?</h2>
    <h3>For the VA appointments tool</h3>
    <p>
      <strong>For help scheduling a VA or community care appointment,</strong>{' '}
      please call{' '}
      <a href="tel: 18774705947" aria-label="8 7 7. 4 7 0. 5 9 4 7.">
        877-470-5947
      </a>{' '}
      (<Telephone contact={CONTACTS['711']} pattern={PATTERNS['911']} /> />).
      We’re here Monday through Friday, 8:00 a.m. to 8:00 p.m. ET.
    </p>
    <p>
      <strong>
        For questions about joining a VA Video Connect appointment,
      </strong>{' '}
      please call{' '}
      <a href="tel: 18666513180" aria-label="8 6 6. 6 5 1. 3 1 8 0.">
        866-651-3180
      </a>{' '}
      (<Telephone contact={CONTACTS['711']} pattern={PATTERNS['911']} /> />).
      We’re here Monday through Saturday, 7:00 a.m. to 11:00 p.m. ET.
    </p>
    <h3>For My VA Health questions</h3>
    <p>
      Call My VA Health support anytime at{' '}
      <a href="tel:18009621024" aria-label="8 0 0. 9 6 2. 1 0 2 4.">
        {' '}
        800-962-1024
      </a>
      .
    </p>
    <MoreInfoAboutBenefits />
  </>
);

export default AuthContent;
