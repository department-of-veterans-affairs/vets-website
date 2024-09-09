// Node modules.
import React from 'react';
// Relative imports.
import CallToActionWidget from 'applications/static-pages/cta-widget';
import ServiceProvidersList from 'platform/user/authentication/components/ServiceProvidersList';
import MoreInfoAboutBenefits from '../../../components/MoreInfoAboutBenefits';

export const UnauthContent = () => (
  <>
    <CallToActionWidget
      appId="view-appointments"
      setFocus={false}
      headerLevel={2}
    />
    <p data-testid="non-cerner-content">
      <strong>Note:</strong> If you can’t keep an existing appointment, please
      contact the facility as soon as you can to reschedule or cancel.
      <br />
      <a href="/find-locations/">Find your health facility’s phone number</a>
    </p>
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
    <p>
      <a href="/health-care/how-to-apply/">
        Find out how to apply for VA health care
      </a>
    </p>
    <p>
      <strong>And, you must have one of these free accounts:</strong>
    </p>
    <ServiceProvidersList />
    <h2>How do I know if my VA health facility uses online scheduling?</h2>
    <p>
      Online scheduling is available at all VA health facilities except in
      Manila, Philippines.
    </p>
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
    <h2>Can I use this tool to schedule community (non-VA) appointments?</h2>
    <p>
      Yes. If you’re eligible to receive care from a community provider outside
      of VA, you can use this tool to submit appointment requests. You must
      receive prior approval from us before getting care from a community
      provider. <br />
    </p>
    <a href="/communitycare/programs/veterans/index.asp">
      Learn more about community care
    </a>
    <br />
    <br />
    <a href="/find-locations/">Find a community provider in the VA network</a>
    <h2>Can I schedule appointments through VA secure messaging?</h2>
    <p>
      If you use secure messaging with your VA health care team, you may be able
      to use this service to schedule and cancel appointments.
    </p>
    <p>
      <a href="/health-care/secure-messaging/">
        Learn more about secure messaging
      </a>
    </p>
    <p>
      <strong>Please note:</strong> The fastest way to schedule appointments is
      usually to call the health facility where you get care. To reschedule or
      cancel an existing appointment, please contact your facility as soon as
      possible.
    </p>
    <a href="/find-locations">Find your health facility’s phone number</a>
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
    <h3>For questions about scheduling an appointment</h3>
    <p>Please call your VA or community care health facility.</p>
    <p>
      <a href="/find-locations/">Find your health facility’s phone number</a>
    </p>
    <h3>For questions about the VA appointments tool</h3>
    <p>
      Please call <va-telephone contact="8774705947" /> (
      <va-telephone contact="711" />
      ). We’re here Monday through Friday, 8:00 a.m. to 8:00 p.m. ET.
    </p>
    <h3>For questions about joining a VA Video Connect appointment</h3>
    <p>
      Please call <va-telephone contact="8666513180" /> (
      <va-telephone contact="711" />
      ). We’re here 24/7.
    </p>
    <MoreInfoAboutBenefits />
  </>
);

export default UnauthContent;
