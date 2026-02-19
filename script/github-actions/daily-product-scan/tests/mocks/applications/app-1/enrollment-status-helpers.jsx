/* eslint-disable @department-of-veterans-affairs/correct-apostrophe */
/* eslint-disable import/order */
import React from 'react';
import moment from 'moment';

import { isValidDateString } from 'platform/utilities/date';
import { HCA_ENROLLMENT_STATUSES } from './constants';
import { getMedicalCenterNameByID } from './helpers';

// There are 9 possible warning headlines to show depending on enrollment status
export function getWarningHeadline(enrollmentStatus) {
  let content = null;
  switch (enrollmentStatus) {
    case HCA_ENROLLMENT_STATUSES.enrolled:
      content = 'You’re already enrolled in VA health care';
      break;

    case HCA_ENROLLMENT_STATUSES.ineligCharacterOfDischarge:
    case HCA_ENROLLMENT_STATUSES.ineligCitizens:
    case HCA_ENROLLMENT_STATUSES.ineligFilipinoScouts:
    case HCA_ENROLLMENT_STATUSES.ineligFugitiveFelon:
    case HCA_ENROLLMENT_STATUSES.ineligGuardReserve:
    case HCA_ENROLLMENT_STATUSES.ineligMedicare:
    case HCA_ENROLLMENT_STATUSES.ineligNotEnoughTime:
    case HCA_ENROLLMENT_STATUSES.ineligNotVerified:
    case HCA_ENROLLMENT_STATUSES.ineligOther:
    case HCA_ENROLLMENT_STATUSES.ineligOver65:
    case HCA_ENROLLMENT_STATUSES.ineligRefusedCopay:
    case HCA_ENROLLMENT_STATUSES.ineligTrainingOnly:
      content =
        'We determined that you don’t qualify for VA health care based on your past application';
      break;

    case HCA_ENROLLMENT_STATUSES.ineligCHAMPVA:
    case HCA_ENROLLMENT_STATUSES.rejectedIncWrongEntry:
    case HCA_ENROLLMENT_STATUSES.rejectedRightEntry:
    case HCA_ENROLLMENT_STATUSES.rejectedScWrongEntry:
      content =
        'You didn’t qualify for VA health care based on your previous application';
      break;

    case HCA_ENROLLMENT_STATUSES.activeDuty:
      content = 'Our records show that you’re an active-duty service member';
      break;

    case HCA_ENROLLMENT_STATUSES.deceased:
      content = 'Our records show that this Veteran is deceased';
      break;

    case HCA_ENROLLMENT_STATUSES.closed:
      content =
        'Our records show that your application for VA health care expired';
      break;

    case HCA_ENROLLMENT_STATUSES.pendingMt:
    case HCA_ENROLLMENT_STATUSES.pendingPurpleHeart:
      content =
        'We need more information to complete our review of your VA health care application';
      break;

    case HCA_ENROLLMENT_STATUSES.pendingOther:
    case HCA_ENROLLMENT_STATUSES.pendingUnverified:
      content = 'We’re reviewing your application';
      break;

    case HCA_ENROLLMENT_STATUSES.canceledDeclined:
      content =
        'Our records show you chose to cancel or decline VA health care';
      break;

    case HCA_ENROLLMENT_STATUSES.nonMilitary:
      content = 'We see that you aren’t a Veteran or service member';
      break;

    default:
      break;
  }
  return content;
}

export function getEnrollmentDetails(
  applicationDate,
  enrollmentDate,
  preferredFacility,
) {
  const facilityName = getMedicalCenterNameByID(preferredFacility);
  const blocks = [];
  // add "you applied on" block if the application date is valid
  if (isValidDateString(applicationDate)) {
    blocks.push(
      <>
        <strong>You applied on: </strong>
        {moment(applicationDate).format('MMMM D, YYYY')}
      </>,
    );
  }
  // add "we enrolled you" block if the enrollment date is valid
  if (isValidDateString(enrollmentDate)) {
    blocks.push(
      <>
        <strong>We enrolled you on: </strong>
        {moment(enrollmentDate).format('MMMM D, YYYY')}
      </>,
    );
  }
  // add "preferred facility" block if there is a facility name
  if (facilityName !== '') {
    blocks.push(
      <>
        <strong>Your preferred VA medical center is: </strong>
        {facilityName}
      </>,
    );
  }
  if (!blocks.length) {
    return null;
  }
  // build the final content, adding <br/> tags between each block
  return (
    <p>
      {blocks.map((block, i, array) => {
        if (i < array.length - 1) {
          return (
            <React.Fragment key={i}>
              {block}
              <br />
            </React.Fragment>
          );
        }
        return <React.Fragment key={i}>{block}</React.Fragment>;
      })}
    </p>
  );
}

// There are 3 options for additional warning stats. By default we just show the
// application date. If the user is enrolled, we show additional info.
export function getWarningStatus(
  enrollmentStatus,
  applicationDate,
  enrollmentDate,
  preferredFacility,
) {
  let content = null;
  switch (enrollmentStatus) {
    case HCA_ENROLLMENT_STATUSES.deceased:
    case HCA_ENROLLMENT_STATUSES.nonMilitary:
      content = null;
      break;

    case HCA_ENROLLMENT_STATUSES.enrolled:
      content = getEnrollmentDetails(
        applicationDate,
        enrollmentDate,
        preferredFacility,
      );
      break;

    default:
      content = getEnrollmentDetails(applicationDate);
      break;
  }
  return content;
}

// There is a large number of possible options here, many of which are unique
// for each enrollment status value
export function getWarningExplanation(enrollmentStatus) {
  let content = null;
  switch (enrollmentStatus) {
    case HCA_ENROLLMENT_STATUSES.activeDuty:
    case HCA_ENROLLMENT_STATUSES.enrolled:
    case HCA_ENROLLMENT_STATUSES.ineligFugitiveFelon:
    case HCA_ENROLLMENT_STATUSES.ineligMedicare:
    case HCA_ENROLLMENT_STATUSES.ineligOther:
    case HCA_ENROLLMENT_STATUSES.ineligOver65:
    case HCA_ENROLLMENT_STATUSES.ineligRefusedCopay:
    case HCA_ENROLLMENT_STATUSES.nonMilitary:
      content = null;
      break;

    case HCA_ENROLLMENT_STATUSES.ineligNotEnoughTime:
    case HCA_ENROLLMENT_STATUSES.ineligTrainingOnly:
      content = (
        <p>
          Our records show that you served on active duty for less than 24
          continuous months. To qualify for VA health care without other special
          eligibility factors, you must have served on active duty for at least
          24 months all at once, without a break in service.
        </p>
      );
      break;

    case HCA_ENROLLMENT_STATUSES.ineligCharacterOfDischarge:
      content = (
        <p>
          Our records show that you don’t have a high enough Character of
          Discharge to qualify for VA health care.
        </p>
      );
      break;

    case HCA_ENROLLMENT_STATUSES.ineligNotVerified:
      content = (
        <p>
          We determined that you’re not eligible for VA health care because we
          didn’t have proof of your military service (like your DD214 or other
          separation papers).
        </p>
      );
      break;

    case HCA_ENROLLMENT_STATUSES.ineligGuardReserve:
      content = (
        <p>
          Our records show that you served in the National Guard or Reserves,
          and weren’t activated to federal active duty for at least 24
          continuous months. To qualify for VA health care without other special
          eligibility factors, you must have served on active duty for at least
          24 months all at once, without a break in service.
        </p>
      );
      break;

    case HCA_ENROLLMENT_STATUSES.ineligCHAMPVA:
      content = (
        <p>
          Our records show that you’re enrolled in CHAMPVA. We couldn’t accept
          your application because the VA medical center you applied to doesn’t
          offer services to CHAMPVA recipients.
        </p>
      );
      break;

    case HCA_ENROLLMENT_STATUSES.ineligCitizens:
    case HCA_ENROLLMENT_STATUSES.ineligFilipinoScouts:
      content = (
        <p>
          Our records show that you didn’t serve in the U.S. military or an
          eligible foreign military. To qualify for VA health care, you must
          meet this service requirement.
        </p>
      );
      break;

    case HCA_ENROLLMENT_STATUSES.rejectedIncWrongEntry:
    case HCA_ENROLLMENT_STATUSES.rejectedRightEntry:
    case HCA_ENROLLMENT_STATUSES.rejectedScWrongEntry:
      content = (
        <p>
          Our records show that you don’t have a service-connected disability,
          an income that falls below our income limits based on where you live,
          or another special eligibility factor (like receiving a Medal of Honor
          or Purple Heart award). To qualify for VA health care, you need to
          meet at least one of these eligibility requirements in addition to
          serving at least 24 continuous months on active duty.
        </p>
      );
      break;

    case HCA_ENROLLMENT_STATUSES.deceased:
      content = (
        <>
          <p>We can’t accept an application for this Veteran.</p>
          <p>
            If this information is incorrect, please call our enrollment case
            management team at{' '}
            <va-telephone
              className="help-phone-number-link"
              contact="8772228387"
            />
            .
          </p>
        </>
      );
      break;

    case HCA_ENROLLMENT_STATUSES.closed:
      content = (
        <p>
          We closed your application because you didn’t submit all the documents
          needed to complete it within a year.
        </p>
      );
      break;

    case HCA_ENROLLMENT_STATUSES.pendingMt:
      content = (
        <p>
          We need you to submit a financial disclosure so we can determine if
          you’re eligible for VA health care based on your income.
        </p>
      );
      break;

    case HCA_ENROLLMENT_STATUSES.pendingOther:
    case HCA_ENROLLMENT_STATUSES.pendingUnverified:
      content = (
        <p>
          We’re in the process of verifying your military service. We’ll contact
          you by mail if we need you to submit supporting documents (like your
          DD214 or other discharge papers or separation documents).
        </p>
      );
      break;

    case HCA_ENROLLMENT_STATUSES.pendingPurpleHeart:
      content = (
        <>
          <p>
            You included on your application that you’ve received a Purple Heart
            medal. We need an official document showing that you received this
            award so we can confirm your eligibility for VA health care.
          </p>
          <p>
            <a href="/records/get-military-service-records/">
              Find out how to request your military records
            </a>
          </p>
        </>
      );
      break;

    case HCA_ENROLLMENT_STATUSES.canceledDeclined:
      content = (
        <p>
          At some time in the past, we offered you enrollment in VA health care,
          but you declined it. Or you enrolled, but later canceled your
          enrollment.
        </p>
      );
      break;

    default:
      break;
  }
  return content;
}

function wrapJSXInKeyedFragment(arrayOfJSX) {
  return arrayOfJSX.map((jsx, i) => (
    <React.Fragment key={i}>{jsx}</React.Fragment>
  ));
}

export function getFAQContent(enrollmentStatus) {
  const callOurTeam = (
    <>
      call our enrollment case management team at{' '}
      <va-telephone className="help-phone-number-link" contact="8772228387" />
    </>
  );

  const ourHours = (
    <>We’re here Monday through Friday, 8:00 a.m. to 8:00 p.m. ET</>
  );

  const faqBlock1 = (
    <>
      <h3 className="vads-u-font-size--h4">
        How can I change my address, income, or other information in my VA
        health care records?
      </h3>
      <p>
        To update your information, please submit a Health Benefits Update Form
        (VA Form 10-10EZR).
      </p>
      <p>
        <a href="/health-care/update-health-information/">
          Find out how to submit VA Form 10-10EZR
        </a>
        .
      </p>
      <p>
        Or you can update your address and other contact information in your
        VA.gov profile. This will update your information across several VA
        benefits and services.
      </p>
      <p>
        <a href="/profile">Go to your profile to update your address</a>.
      </p>
    </>
  );

  const faqBlock2 = (
    <>
      <h3 className="vads-u-font-size--h4">
        What should I do if I think this information is incorrect, or if I have
        questions about my eligibility?
      </h3>
      <p>
        Please {callOurTeam}. {ourHours}.
      </p>
    </>
  );

  const faqBlock3 = (
    <>
      <h3 className="vads-u-font-size--h4">
        What should I do if I want to submit proof of my military service, or if
        I have questions about my eligibility?
      </h3>
      <p>
        Please {callOurTeam}. {ourHours}.
      </p>
    </>
  );

  const faqBlock4 = (
    <>
      <h3 className="vads-u-font-size--h4">
        Do any VA medical centers treat CHAMPVA recipients?
      </h3>
      <p>
        Yes. To learn more about VA medical centers that offer services to
        CHAMPVA recipients, or if you have any other questions, please{' '}
        {callOurTeam}. {ourHours}.
      </p>
    </>
  );

  const faqBlock5 = (
    <>
      <h3 className="vads-u-font-size--h4">
        What should I do if I have questions about my eligibility?
      </h3>
      <p>
        Please {callOurTeam}. {ourHours}.
      </p>
    </>
  );

  const faqBlock6 = (
    <>
      <h3 className="vads-u-font-size--h4">
        How do I submit this information to VA?
      </h3>
      <p>
        Please {callOurTeam} for directions on how to submit your information.{' '}
        {ourHours}.
      </p>
    </>
  );

  const faqBlock7 = (
    <>
      <h3 className="vads-u-font-size--h4">
        How will I know if VA needs more information from me to verify my
        military service?
      </h3>
      <p>
        If we need more information, we’ll send you a letter in the mail. If you
        have any questions, please {callOurTeam}. {ourHours}.
      </p>
    </>
  );

  const faqBlock8 = (
    <>
      <h3 className="vads-u-font-size--h4">Can I apply for VA health care?</h3>
      <p>
        As an active-duty service member, you can apply for VA health care if
        both of the below descriptions are true for you.
      </p>
      <p>
        <strong>Both of these must be true:</strong>
      </p>
      <ul>
        <li>You’ve received your separation orders, and</li>
        <li>You have less than a year until your separation date</li>
      </ul>
      <p>
        <strong>If you don’t meet the requirements listed above</strong>
      </p>
      <p>
        Please don’t apply at this time. We welcome you to apply once you meet
        these requirements.
      </p>
      <p>
        <strong>
          If you’ve already applied, think you've received this message in
          error, or have any questions
        </strong>
      </p>
      <p>
        Please {callOurTeam}. {ourHours}.
      </p>
    </>
  );

  const faqBlock9 = (
    <>
      <h3 className="vads-u-font-size--h4">
        What if I want to review my discharge status, or think I may qualify for
        an upgrade?
      </h3>
      <p>You can get more information on our website:</p>
      <p>
        <a href="https://www.va.gov/discharge-upgrade-instructions/">
          Find out who may qualify for a discharge upgrade
        </a>
      </p>
      <p>
        <a href="https://www.va.gov/discharge-upgrade-instructions/#other-options">
          Learn more about the Character of Discharge review process
        </a>
      </p>
    </>
  );

  const faqBlock10 = (
    <>
      <h3 className="vads-u-font-size--h4">Can I apply for VA health care?</h3>
      <p>
        The health care application on this page is only for Veterans or service
        members who have received their separation orders and are within one
        year of their separation. If you are a family member or caregiver
        submitting a health care application on behalf of a Veteran or service
        member, then you can use this tool to help get them VA health care.
      </p>
      <p>
        If you’re not helping a Veteran or service member sign up, you may be
        eligible for your own VA health care benefits.
      </p>
      <p>
        <a href="https://www.va.gov/health-care/family-caregiver-benefits/">
          Learn about health care for spouses, dependents, and family caregivers
        </a>
      </p>
      <p>
        <strong>
          Note: If you are a Veteran or service member receiving this message in
          error, please {callOurTeam}. {ourHours}.
        </strong>
      </p>
    </>
  );

  const faqBlockMentalHealthCare = (
    <>
      <h3 className="vads-u-font-size--h4">
        Can I still get mental health care?
      </h3>
      <p>
        You may still be able to access certain mental health care services even
        if you’re not enrolled in VA health care.
      </p>
      <p>
        <a href="/health-care/health-needs-conditions/mental-health/">
          Learn more about getting started with VA mental health services
        </a>
      </p>
    </>
  );

  const faqBlockReapply1 = (
    <>
      <h3 className="vads-u-font-size--h4">
        Will applying again update my information?
      </h3>
      <p>
        <strong>No. A new application won’t update your information.</strong> If
        you have questions about the information we have on record for you,
        please call your nearest VA medical center.
      </p>
      <p>
        <a className="usa-button-primary" href="/find-locations/">
          Find your VA medical center
        </a>
      </p>
    </>
  );

  const faqBlockReapply2 = (
    <>
      <h3 className="vads-u-font-size--h4">
        Could applying again change VA’s decision?
      </h3>
      <p>
        <strong>
          A new application most likely won’t change our decision on your
          eligibility.
        </strong>{' '}
        If you’d like to talk about your options, please {callOurTeam}.
      </p>
      <p>
        We only recommend applying again if you’ve already worked with our
        enrollment case management team, and they’ve advised you to reapply.
      </p>
    </>
  );

  const faqBlockReapply3 = (
    <>
      <h3 className="vads-u-font-size--h4">
        Could applying again change VA’s decision?
      </h3>
      <p>
        <strong>
          Only if you’ve had a change in your life since you last applied that
          may make you eligible for VA health care now—like receiving a VA
          rating for a service-connected disability or experiencing a decrease
          in your income.
        </strong>{' '}
        If you’d like to talk about your options, please {callOurTeam}.
      </p>
      <p>
        We only recommend applying again if you’ve already worked with our
        enrollment case management team, and they’ve advised you to reapply.
      </p>
    </>
  );

  const faqBlockReapply4 = (
    <>
      <h3 className="vads-u-font-size--h4">Can I apply again?</h3>
      <p>
        Yes. If you have questions about how to complete your application,
        please {callOurTeam}.
      </p>
    </>
  );

  const faqBlockReapply5 = (
    <>
      <h3 className="vads-u-font-size--h4">
        Should I just submit a new application with all my information?
      </h3>
      <p>
        <strong>
          No. We’re in the process of reviewing your current application, and
          submitting a new application won’t affect our decision.
        </strong>{' '}
        To get help providing the information we need to complete our review,
        please {callOurTeam}.
      </p>
      <p>
        We only recommend applying again if you’ve already worked with our
        enrollment case management team, and they’ve advised you to reapply.
      </p>
    </>
  );

  const faqBlockReapply6 = (
    <>
      <h3 className="vads-u-font-size--h4">Should I apply again?</h3>
      <p>
        <strong>
          No. We’re in the process of reviewing your current application, and
          submitting a new application won’t affect our decision.
        </strong>{' '}
        If you’d like to talk about your current application, please{' '}
        {callOurTeam}.
      </p>
      <p>
        We only recommend applying again if you’ve already worked with our
        enrollment case management team, and they’ve advised you to reapply.
      </p>
    </>
  );
  const faqMap = {
    [HCA_ENROLLMENT_STATUSES.activeDuty]: faqBlock8,
    [HCA_ENROLLMENT_STATUSES.canceledDeclined]: wrapJSXInKeyedFragment([
      faqBlock5,
      faqBlockMentalHealthCare,
      faqBlockReapply4,
    ]),
    [HCA_ENROLLMENT_STATUSES.closed]: wrapJSXInKeyedFragment([
      faqBlock5,
      faqBlockMentalHealthCare,
      faqBlockReapply4,
    ]),
    [HCA_ENROLLMENT_STATUSES.enrolled]: wrapJSXInKeyedFragment([
      faqBlock1,
      faqBlockReapply1,
    ]),
    [HCA_ENROLLMENT_STATUSES.ineligCHAMPVA]: wrapJSXInKeyedFragment([
      faqBlock4,
      faqBlockReapply2,
    ]),
    [HCA_ENROLLMENT_STATUSES.ineligCharacterOfDischarge]: wrapJSXInKeyedFragment(
      [faqBlock2, faqBlock9, faqBlockMentalHealthCare, faqBlockReapply2],
    ),
    [HCA_ENROLLMENT_STATUSES.ineligCitizens]: wrapJSXInKeyedFragment([
      faqBlock2,
      faqBlockReapply2,
    ]),
    [HCA_ENROLLMENT_STATUSES.ineligFilipinoScouts]: wrapJSXInKeyedFragment([
      faqBlock2,
      faqBlockReapply2,
    ]),
    [HCA_ENROLLMENT_STATUSES.ineligFugitiveFelon]: wrapJSXInKeyedFragment([
      faqBlock5,
      faqBlockReapply2,
    ]),
    [HCA_ENROLLMENT_STATUSES.ineligGuardReserve]: wrapJSXInKeyedFragment([
      faqBlock2,
      faqBlockMentalHealthCare,
      faqBlockReapply2,
    ]),
    [HCA_ENROLLMENT_STATUSES.ineligMedicare]: wrapJSXInKeyedFragment([
      faqBlock5,
      faqBlockMentalHealthCare,
      faqBlockReapply2,
    ]),
    [HCA_ENROLLMENT_STATUSES.ineligNotEnoughTime]: wrapJSXInKeyedFragment([
      faqBlock2,
      faqBlockMentalHealthCare,
      faqBlockReapply2,
    ]),
    [HCA_ENROLLMENT_STATUSES.ineligNotVerified]: wrapJSXInKeyedFragment([
      faqBlock3,
      faqBlockMentalHealthCare,
      faqBlockReapply2,
    ]),
    [HCA_ENROLLMENT_STATUSES.ineligOther]: wrapJSXInKeyedFragment([
      faqBlock5,
      faqBlockMentalHealthCare,
      faqBlockReapply2,
    ]),
    [HCA_ENROLLMENT_STATUSES.ineligOver65]: wrapJSXInKeyedFragment([
      faqBlock5,
      faqBlockMentalHealthCare,
      faqBlockReapply2,
    ]),
    [HCA_ENROLLMENT_STATUSES.ineligRefusedCopay]: wrapJSXInKeyedFragment([
      faqBlock5,
      faqBlockMentalHealthCare,
      faqBlockReapply2,
    ]),
    [HCA_ENROLLMENT_STATUSES.ineligTrainingOnly]: wrapJSXInKeyedFragment([
      faqBlock2,
      faqBlockMentalHealthCare,
      faqBlockReapply2,
    ]),
    [HCA_ENROLLMENT_STATUSES.nonMilitary]: wrapJSXInKeyedFragment([faqBlock10]),
    [HCA_ENROLLMENT_STATUSES.pendingMt]: wrapJSXInKeyedFragment([
      faqBlock6,
      faqBlockReapply5,
    ]),
    [HCA_ENROLLMENT_STATUSES.pendingOther]: wrapJSXInKeyedFragment([
      faqBlock7,
      faqBlockReapply6,
    ]),
    [HCA_ENROLLMENT_STATUSES.pendingPurpleHeart]: wrapJSXInKeyedFragment([
      faqBlock6,
      faqBlockReapply5,
    ]),
    [HCA_ENROLLMENT_STATUSES.pendingUnverified]: wrapJSXInKeyedFragment([
      faqBlock7,
      faqBlockReapply6,
    ]),
    [HCA_ENROLLMENT_STATUSES.rejectedIncWrongEntry]: wrapJSXInKeyedFragment([
      faqBlock5,
      faqBlockMentalHealthCare,
      faqBlockReapply3,
    ]),
    [HCA_ENROLLMENT_STATUSES.rejectedRightEntry]: wrapJSXInKeyedFragment([
      faqBlock5,
      faqBlockMentalHealthCare,
      faqBlockReapply3,
    ]),
    [HCA_ENROLLMENT_STATUSES.rejectedScWrongEntry]: wrapJSXInKeyedFragment([
      faqBlock5,
      faqBlockMentalHealthCare,
      faqBlockReapply3,
    ]),
  };
  return faqMap[enrollmentStatus];
}

// used by YourApplications to build a DashboardAlert depending on the user's
// health care enrollment status
export function getAlertType(enrollmentStatus) {
  let status;
  switch (enrollmentStatus) {
    case HCA_ENROLLMENT_STATUSES.enrolled:
      status = 'enrolled';
      break;

    case HCA_ENROLLMENT_STATUSES.closed:
      status = 'closed';
      break;

    case HCA_ENROLLMENT_STATUSES.ineligCHAMPVA:
    case HCA_ENROLLMENT_STATUSES.ineligCharacterOfDischarge:
    case HCA_ENROLLMENT_STATUSES.ineligCitizens:
    case HCA_ENROLLMENT_STATUSES.ineligFilipinoScouts:
    case HCA_ENROLLMENT_STATUSES.ineligFugitiveFelon:
    case HCA_ENROLLMENT_STATUSES.ineligGuardReserve:
    case HCA_ENROLLMENT_STATUSES.ineligMedicare:
    case HCA_ENROLLMENT_STATUSES.ineligNotEnoughTime:
    case HCA_ENROLLMENT_STATUSES.ineligNotVerified:
    case HCA_ENROLLMENT_STATUSES.ineligOther:
    case HCA_ENROLLMENT_STATUSES.ineligOver65:
    case HCA_ENROLLMENT_STATUSES.ineligRefusedCopay:
    case HCA_ENROLLMENT_STATUSES.ineligTrainingOnly:
    case HCA_ENROLLMENT_STATUSES.rejectedIncWrongEntry:
    case HCA_ENROLLMENT_STATUSES.rejectedRightEntry:
    case HCA_ENROLLMENT_STATUSES.rejectedScWrongEntry:
      status = 'decision';
      break;

    case HCA_ENROLLMENT_STATUSES.pendingMt:
    case HCA_ENROLLMENT_STATUSES.pendingOther:
    case HCA_ENROLLMENT_STATUSES.pendingPurpleHeart:
    case HCA_ENROLLMENT_STATUSES.pendingUnverified:
      status = 'update';
      break;

    default:
      break;
  }
  return status;
}

// used by YourApplications to build a DashboardAlert depending on the user's
// health care enrollment status
export function getAlertStatusHeadline(enrollmentStatus) {
  let statusHeadline;
  switch (enrollmentStatus) {
    case HCA_ENROLLMENT_STATUSES.enrolled:
      statusHeadline = 'Enrolled';
      break;

    case HCA_ENROLLMENT_STATUSES.closed:
      statusHeadline = 'Closed';
      break;

    case HCA_ENROLLMENT_STATUSES.ineligCHAMPVA:
    case HCA_ENROLLMENT_STATUSES.ineligCharacterOfDischarge:
    case HCA_ENROLLMENT_STATUSES.ineligCitizens:
    case HCA_ENROLLMENT_STATUSES.ineligFilipinoScouts:
    case HCA_ENROLLMENT_STATUSES.ineligFugitiveFelon:
    case HCA_ENROLLMENT_STATUSES.ineligGuardReserve:
    case HCA_ENROLLMENT_STATUSES.ineligMedicare:
    case HCA_ENROLLMENT_STATUSES.ineligNotEnoughTime:
    case HCA_ENROLLMENT_STATUSES.ineligNotVerified:
    case HCA_ENROLLMENT_STATUSES.ineligOther:
    case HCA_ENROLLMENT_STATUSES.ineligOver65:
    case HCA_ENROLLMENT_STATUSES.ineligRefusedCopay:
    case HCA_ENROLLMENT_STATUSES.ineligTrainingOnly:
    case HCA_ENROLLMENT_STATUSES.rejectedIncWrongEntry:
    case HCA_ENROLLMENT_STATUSES.rejectedRightEntry:
    case HCA_ENROLLMENT_STATUSES.rejectedScWrongEntry:
      statusHeadline = 'Decision';
      break;

    case HCA_ENROLLMENT_STATUSES.pendingMt:
    case HCA_ENROLLMENT_STATUSES.pendingOther:
    case HCA_ENROLLMENT_STATUSES.pendingPurpleHeart:
    case HCA_ENROLLMENT_STATUSES.pendingUnverified:
      statusHeadline = 'Update';
      break;

    default:
      break;
  }
  return statusHeadline;
}

// used by YourApplications to build a DashboardAlert depending on the user's
// health care enrollment status
export function getAlertStatusInfo(enrollmentStatus) {
  let statusInfo;
  switch (enrollmentStatus) {
    case HCA_ENROLLMENT_STATUSES.enrolled:
      statusInfo = 'We’ve enrolled you in VA health care';
      break;

    case HCA_ENROLLMENT_STATUSES.ineligCharacterOfDischarge:
    case HCA_ENROLLMENT_STATUSES.ineligCitizens:
    case HCA_ENROLLMENT_STATUSES.ineligFilipinoScouts:
    case HCA_ENROLLMENT_STATUSES.ineligFugitiveFelon:
    case HCA_ENROLLMENT_STATUSES.ineligGuardReserve:
    case HCA_ENROLLMENT_STATUSES.ineligMedicare:
    case HCA_ENROLLMENT_STATUSES.ineligNotEnoughTime:
    case HCA_ENROLLMENT_STATUSES.ineligNotVerified:
    case HCA_ENROLLMENT_STATUSES.ineligOther:
    case HCA_ENROLLMENT_STATUSES.ineligOver65:
    case HCA_ENROLLMENT_STATUSES.ineligRefusedCopay:
    case HCA_ENROLLMENT_STATUSES.ineligTrainingOnly:
      statusInfo = 'We determined that you don’t qualify for VA health care';
      break;

    case HCA_ENROLLMENT_STATUSES.ineligCHAMPVA:
    case HCA_ENROLLMENT_STATUSES.rejectedIncWrongEntry:
    case HCA_ENROLLMENT_STATUSES.rejectedRightEntry:
    case HCA_ENROLLMENT_STATUSES.rejectedScWrongEntry:
      statusInfo =
        'You didn’t qualify for VA health care based on your previous application';
      break;

    case HCA_ENROLLMENT_STATUSES.closed:
      statusInfo =
        'Our records show that your application for VA health care expired';
      break;

    case HCA_ENROLLMENT_STATUSES.pendingOther:
    case HCA_ENROLLMENT_STATUSES.pendingUnverified:
      statusInfo = 'We’re reviewing your application';
      break;

    case HCA_ENROLLMENT_STATUSES.pendingMt:
    case HCA_ENROLLMENT_STATUSES.pendingPurpleHeart:
      statusInfo =
        'We need more information to complete our review of your VA health care application';
      break;

    default:
      break;
  }
  return statusInfo;
}

// used by YourApplications to build a DashboardAlert depending on the user's
// health care enrollment status
export function getAlertContent(
  enrollmentStatus,
  applicationDate,
  dismissNotification,
) {
  // this block will be used for almost every type of enrollmentstatus
  const whatShouldIDo1 = (
    <p key="what-should-i-do-1">
      If you have questions, please call our enrollment case management team at
      <va-telephone className="help-phone-number-link" contact="8772228387" />.
      We’re here Monday through Friday, 8:00 a.m. to 8:00 p.m. ET.
    </p>
  );
  // this block will also be used for character of discharge status
  const whatShouldIDo2 = (
    <React.Fragment key="what-should-i-do-2">
      <p>
        <a href="/discharge-upgrade-instructions/">
          Find out who may qualify for a discharge upgrade
        </a>
      </p>
      <p>
        <a href="/discharge-upgrade-instructions/#other-options">
          Learn more about the Character of Discharge review process
        </a>
      </p>
    </React.Fragment>
  );
  // this block will be used for "final" enrollment status states: closed,
  // rejected, enrolled, ineligible
  const removeNotificationButton = (
    <button
      className="va-button-link remove-notification-link"
      aria-label="Remove this notification about my healthcare application status"
      onClick={dismissNotification}
      key="dismiss-notification-button"
    >
      <va-icon icon="close" size={3} />
      <span className="remove-notification-label">
        Remove this notification
      </span>
    </button>
  );

  const blocks = [];

  // start with the "You applied on" if the user isn't enrolled in health care
  if (
    enrollmentStatus !== HCA_ENROLLMENT_STATUSES.enrolled &&
    isValidDateString(applicationDate)
  ) {
    blocks.push(
      <p key="you-applied-on">
        <strong>You applied on:</strong>{' '}
        {moment(applicationDate).format('MMMM D, YYYY')}
      </p>,
    );
  }

  switch (enrollmentStatus) {
    case HCA_ENROLLMENT_STATUSES.enrolled:
      blocks.push(removeNotificationButton);

      break;

    case HCA_ENROLLMENT_STATUSES.ineligTrainingOnly:
      blocks.push(
        <p key="explanation">
          Our records show that you were called to federal active duty for
          training purposes only. This means your service doesn’t meet our
          minimum active duty service requirement of at least 24 continuous
          months to qualify for VA health care.
        </p>,
        whatShouldIDo1,
        removeNotificationButton,
      );

      break;

    case HCA_ENROLLMENT_STATUSES.ineligNotVerified:
      blocks.push(
        <p key="explanation">
          We determined that you’re not eligible for VA health care because we
          didn’t have proof of your military service (like your DD214 or other
          separation papers).
        </p>,
        whatShouldIDo1,
        removeNotificationButton,
      );
      break;

    case HCA_ENROLLMENT_STATUSES.ineligCharacterOfDischarge:
      blocks.push(
        <p key="explanation">
          Our records show that don’t have a high enough Character of Discharge
          to qualify for VA health care.
        </p>,
        whatShouldIDo1,
        whatShouldIDo2,
        removeNotificationButton,
      );
      break;

    case HCA_ENROLLMENT_STATUSES.ineligCitizens:
    case HCA_ENROLLMENT_STATUSES.ineligFilipinoScouts:
      blocks.push(
        <p key="explanation">
          Our records show that you didn’t serve in the U.S. military or an
          eligible foreign military. To qualify for VA health care, you must
          meet this service requirement.
        </p>,
        whatShouldIDo1,
        removeNotificationButton,
      );
      break;

    case HCA_ENROLLMENT_STATUSES.rejectedIncWrongEntry:
    case HCA_ENROLLMENT_STATUSES.rejectedRightEntry:
    case HCA_ENROLLMENT_STATUSES.rejectedScWrongEntry:
      blocks.push(
        <p key="explanation">
          Our records show that you don’t have a service-connected disability,
          an income that falls below our income limits based on where you live,
          or another special eligibility factor (like receiving a Medal of Honor
          or Purple Heart award). To qualify for VA health care, you need to
          meet at least one of these eligibility requirements in addition to
          serving at least 24 continuous months on active duty.
        </p>,
        whatShouldIDo1,
        removeNotificationButton,
      );
      break;

    case HCA_ENROLLMENT_STATUSES.ineligGuardReserve:
      blocks.push(
        <p key="explanation">
          Our records show that you served in the National Guard or Reserves,
          and weren’t activated to federal active duty for at least 24
          continuous months. To qualify for VA health care without other special
          eligibility factors, you must have served on active duty for at least
          24 months all at once, without a break in service.
        </p>,
        whatShouldIDo1,
        removeNotificationButton,
      );
      break;

    case HCA_ENROLLMENT_STATUSES.ineligNotEnoughTime:
      blocks.push(
        <p key="explanation">
          Our records show that you served on active duty for less than 24
          continuous months. To qualify for VA health care without other special
          eligibility factors, you must have served on active duty for at least
          24 months all at once, without a break in service.
        </p>,
        whatShouldIDo1,
        removeNotificationButton,
      );
      break;

    case HCA_ENROLLMENT_STATUSES.ineligCHAMPVA:
      blocks.push(
        <p key="explanation">
          Our records show that you’re enrolled in CHAMPVA. We couldn’t accept
          your application because the VA medical center you applied to doesn’t
          offer services to CHAMPVA recipients.
        </p>,
        whatShouldIDo1,
        removeNotificationButton,
      );
      break;

    case HCA_ENROLLMENT_STATUSES.closed:
      blocks.push(
        <p key="explanation">
          We closed your application because you didn’t submit all the documents
          needed to complete it within a year.
        </p>,
        whatShouldIDo1,
        removeNotificationButton,
      );
      break;

    case HCA_ENROLLMENT_STATUSES.pendingMt:
      blocks.push(
        <p key="explanation">
          We need you to submit a financial disclosure so we can determine if
          you’re eligible for VA health care based on your income.
        </p>,
        whatShouldIDo1,
      );
      break;

    case HCA_ENROLLMENT_STATUSES.pendingOther:
    case HCA_ENROLLMENT_STATUSES.pendingUnverified:
      blocks.push(
        <p key="explanation">
          We’re in the process of verifying your military service. We’ll contact
          you by mail if we need you to submit supporting documents (like your
          DD214 or other discharge papers or separation documents).
        </p>,
        whatShouldIDo1,
      );
      break;

    case HCA_ENROLLMENT_STATUSES.pendingPurpleHeart:
      blocks.push(
        <React.Fragment key="explanation">
          <p>
            You included on your application that you’ve received a Purple Heart
            medal. We need an official document showing that you received this
            award so we can confirm your eligibility for VA health care.
          </p>
          <p>
            <a href="/records/get-military-service-records/">
              Find out how to request your military records
            </a>
          </p>
        </React.Fragment>,
        whatShouldIDo1,
      );
      break;

    case HCA_ENROLLMENT_STATUSES.ineligMedicare:
    case HCA_ENROLLMENT_STATUSES.ineligRefusedCopay:
    case HCA_ENROLLMENT_STATUSES.ineligFugitiveFelon:
    case HCA_ENROLLMENT_STATUSES.ineligOver65:
    case HCA_ENROLLMENT_STATUSES.ineligOther:
      blocks.push(whatShouldIDo1, removeNotificationButton);
      break;

    default:
      break;
  }

  return blocks;
}
