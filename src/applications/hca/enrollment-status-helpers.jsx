import React from 'react';
import moment from 'moment';

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
      content =
        'Our records show that you haven’t yet received your separation or retirement orders';
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

    default:
      break;
  }
  return <h4 className="usa-alert-heading">{content}</h4>;
}

export function getEnrollmentDetails(
  applicationDate,
  enrollmentDate,
  preferredFacility,
) {
  const facilityName = getMedicalCenterNameByID(preferredFacility);
  const blocks = [];
  // add "you applied on" block if the application date is valid
  if (!isNaN(Date.parse(applicationDate))) {
    blocks.push(
      <>
        <strong>You applied on: </strong>
        {moment(applicationDate).format('MMMM D, YYYY')}
      </>,
    );
  }
  // add "we enrolled you" block if the enrollment date is valid
  if (!isNaN(Date.parse(enrollmentDate))) {
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
            <>
              {block}
              <br />
            </>
          );
        }
        return block;
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
    case HCA_ENROLLMENT_STATUSES.enrolled:
    case HCA_ENROLLMENT_STATUSES.ineligFugitiveFelon:
    case HCA_ENROLLMENT_STATUSES.ineligMedicare:
    case HCA_ENROLLMENT_STATUSES.ineligOther:
    case HCA_ENROLLMENT_STATUSES.ineligOver65:
    case HCA_ENROLLMENT_STATUSES.ineligRefusedCopay:
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

    case HCA_ENROLLMENT_STATUSES.activeDuty:
      content = (
        <p>
          You can’t qualify for VA health care until you’ve received your
          separation or retirement orders. We welcome you to apply again once
          you’ve received your orders.{' '}
          <a href="/HEALTHBENEFITS/apply/active_duty.asp">
            Learn more about transitioning to VA health care
          </a>
        </p>
      );
      break;

    case HCA_ENROLLMENT_STATUSES.deceased:
      content = (
        <>
          <p>We can’t accept an application for this Veteran.</p>
          <p>
            If this information is incorrect, please call our enrollment case
            management team at 877-222-VETS (
            <a className="help-phone-number-link" href="tel:1-877-222-8387">
              877-222-8387
            </a>
            ).
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

// There are 7 options for the first block in the FAQ
export function getFAQBlock1(enrollmentStatus) {
  let content = null;
  switch (enrollmentStatus) {
    case HCA_ENROLLMENT_STATUSES.deceased:
      content = null;
      break;

    case HCA_ENROLLMENT_STATUSES.enrolled:
      content = (
        <>
          <h4>
            How can I change my address, income, or other information in my VA
            health care records?
          </h4>
          <p>
            To update your information, please submit a Health Benefits Update
            Form (VA Form 10-10EZR).{' '}
            <a href="/health-care/update-health-information/">
              Find out how to submit VA Form 10-10EZR
            </a>
            .
          </p>
          <p>
            <strong>Note:</strong> Please don’t submit a new VA health care
            application to update your information.
          </p>
        </>
      );
      break;

    case HCA_ENROLLMENT_STATUSES.ineligCharacterOfDischarge:
    case HCA_ENROLLMENT_STATUSES.ineligCitizens:
    case HCA_ENROLLMENT_STATUSES.ineligFilipinoScouts:
    case HCA_ENROLLMENT_STATUSES.ineligGuardReserve:
    case HCA_ENROLLMENT_STATUSES.ineligNotEnoughTime:
    case HCA_ENROLLMENT_STATUSES.ineligTrainingOnly:
      content = (
        <>
          <h4>
            What should I do if I think this information is incorrect, or if I
            have questions about my eligibility?
          </h4>
          <p>
            Please call our enrollment case management team at 877-222-VETS (
            <a className="help-phone-number-link" href="tel:1-877-222-8387">
              877-222-8387
            </a>
            ). We’re here Monday through Friday, 8:00 a.m. to 8:00 p.m. ET.
          </p>
        </>
      );
      break;

    case HCA_ENROLLMENT_STATUSES.ineligNotVerified:
      content = (
        <>
          <h4>
            What should I do if I want to submit proof of my military service,
            or if I have questions about my eligibility?
          </h4>
          <p>
            Please call our enrollment case management team at 877-222-VETS (
            <a className="help-phone-number-link" href="tel:1-877-222-8387">
              877-222-8387
            </a>
            ). We’re here Monday through Friday, 8:00 a.m. to 8:00 p.m. ET.
          </p>
        </>
      );
      break;

    case HCA_ENROLLMENT_STATUSES.ineligCHAMPVA:
      content = (
        <>
          <h4>Do any VA medical centers treat CHAMPVA recipients?</h4>
          <p>
            Yes. To learn more about VA medical centers that offer services to
            CHAMPVA recipients, or if you have any other questions, please call
            our enrollment case management team at 877-222-VETS (
            <a className="help-phone-number-link" href="tel:1-877-222-8387">
              877-222-8387
            </a>
            ). We’re here Monday through Friday, 8:00 a.m. to 8:00 p.m. ET.
          </p>
        </>
      );
      break;

    case HCA_ENROLLMENT_STATUSES.activeDuty:
    case HCA_ENROLLMENT_STATUSES.canceledDeclined:
    case HCA_ENROLLMENT_STATUSES.closed:
    case HCA_ENROLLMENT_STATUSES.ineligFugitiveFelon:
    case HCA_ENROLLMENT_STATUSES.ineligMedicare:
    case HCA_ENROLLMENT_STATUSES.ineligOther:
    case HCA_ENROLLMENT_STATUSES.ineligOver65:
    case HCA_ENROLLMENT_STATUSES.ineligRefusedCopay:
    case HCA_ENROLLMENT_STATUSES.rejectedIncWrongEntry:
    case HCA_ENROLLMENT_STATUSES.rejectedRightEntry:
    case HCA_ENROLLMENT_STATUSES.rejectedScWrongEntry:
      content = (
        <>
          <h4>What should I do if I have questions about my eligibility?</h4>
          <p>
            Please call our enrollment case management team at 877-222-VETS (
            <a className="help-phone-number-link" href="tel:1-877-222-8387">
              877-222-8387
            </a>
            ). We’re here Monday through Friday, 8:00 a.m. to 8:00 p.m. ET.
          </p>
        </>
      );
      break;

    case HCA_ENROLLMENT_STATUSES.pendingMt:
    case HCA_ENROLLMENT_STATUSES.pendingPurpleHeart:
      content = (
        <>
          <h4>How do I submit this information to VA?</h4>
          <p>
            Please call our enrollment case management team at 877-222-VETS (
            <a className="help-phone-number-link" href="tel:1-877-222-8387">
              877-222-8387
            </a>
            ) for directions on how to submit your information. We’re here
            Monday through Friday, 8:00 a.m. to 8:00 p.m. ET.
          </p>
        </>
      );
      break;

    case HCA_ENROLLMENT_STATUSES.pendingOther:
    case HCA_ENROLLMENT_STATUSES.pendingUnverified:
      content = (
        <>
          <h4>
            How will I know if VA needs more information from me to verify my
            military service?
          </h4>
          <p>
            If we need more information, we’ll send you a letter in the mail. If
            you have any questions, please call our enrollment case management
            team at 877-222-VETS (
            <a className="help-phone-number-link" href="tel:1-877-222-8387">
              877-222-8387
            </a>
            ). We’re here Monday through Friday, 8:00 a.m. to 8:00 p.m. ET.
          </p>
        </>
      );
      break;

    default:
      break;
  }
  return content;
}

// This block is _only_ shown if the user does not qualify due to the character
// of their discharge
export function getFAQBlock2(enrollmentStatus) {
  let content = null;
  switch (enrollmentStatus) {
    case HCA_ENROLLMENT_STATUSES.ineligCharacterOfDischarge:
      content = (
        <>
          <h4>
            What if I want to review my discharge status, or think I may qualify
            for an upgrade?
          </h4>
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
      break;

    default:
      break;
  }
  return content;
}

// There is only one option for this block. It may or may not be displayed
// depending on the enrollment status
export function getFAQBlock3(enrollmentStatus) {
  let content = (
    <>
      <h4>Can I still get mental health care?</h4>
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
  switch (enrollmentStatus) {
    case HCA_ENROLLMENT_STATUSES.deceased:
    case HCA_ENROLLMENT_STATUSES.enrolled:
    case HCA_ENROLLMENT_STATUSES.ineligCHAMPVA:
    case HCA_ENROLLMENT_STATUSES.ineligCitizens:
    case HCA_ENROLLMENT_STATUSES.ineligFilipinoScouts:
    case HCA_ENROLLMENT_STATUSES.ineligFugitiveFelon:
    case HCA_ENROLLMENT_STATUSES.pendingMt:
    case HCA_ENROLLMENT_STATUSES.pendingOther:
    case HCA_ENROLLMENT_STATUSES.pendingPurpleHeart:
    case HCA_ENROLLMENT_STATUSES.pendingUnverified:
      content = null;
      break;

    default:
      break;
  }
  return content;
}

// There are 7 options for the final block in the FAQ
export function getFAQBlock4(enrollmentStatus) {
  let content = null;
  switch (enrollmentStatus) {
    case HCA_ENROLLMENT_STATUSES.deceased:
      content = null;
      break;

    case HCA_ENROLLMENT_STATUSES.enrolled:
      content = (
        <>
          <h4>Will applying again update my information?</h4>
          <p>
            <strong>
              No. A new application won’t update your information.
            </strong>{' '}
            If you have questions about the information we have on record for
            you, please call your nearest VA medical center.
          </p>
          <p>
            <a className="usa-button-primary" href="/find-locations/">
              Find your VA medical center
            </a>
          </p>
        </>
      );
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
      content = (
        <>
          <h4>Could applying again change VA’s decision?</h4>
          <p>
            <strong>
              A new application most likely won’t change our decision on your
              eligibility.
            </strong>{' '}
            If you’d like to talk about your options, please call our enrollment
            case management team at 877-222-VETS (
            <a className="help-phone-number-link" href="tel:1-877-222-8387">
              877-222-8387
            </a>
            ).
          </p>
          <p>
            We only recommend applying again if you’ve already worked with our
            enrollment case management team, and they’ve advised you to reapply.
          </p>
        </>
      );
      break;

    case HCA_ENROLLMENT_STATUSES.rejectedScWrongEntry:
    case HCA_ENROLLMENT_STATUSES.rejectedIncWrongEntry:
    case HCA_ENROLLMENT_STATUSES.rejectedRightEntry:
      content = (
        <>
          <h4>Could applying again change VA’s decision?</h4>
          <p>
            <strong>
              Only if you’ve had a change in your life since you last applied
              that may make you eligible for VA health care now—like receiving a
              VA rating for a service-connected disability or experiencing a
              decrease in your income.
            </strong>{' '}
            If you’d like to talk about your options, please call our enrollment
            case management team at 877-222-VETS (
            <a className="help-phone-number-link" href="tel:1-877-222-8387">
              877-222-8387
            </a>
            ).
          </p>
          <p>
            We only recommend applying again if you’ve already worked with our
            enrollment case management team, and they’ve advised you to reapply.
          </p>
        </>
      );
      break;

    case HCA_ENROLLMENT_STATUSES.activeDuty:
      content = (
        <>
          <h4>Can I apply again?</h4>
          <p>
            Yes, but we recommend waiting until you’ve received your separation
            or retirement orders. If you’d like to talk about your options,
            please call our enrollment case management team at 877-222-VETS (
            <a className="help-phone-number-link" href="tel:1-877-222-8387">
              877-222-8387
            </a>
            ).
          </p>
        </>
      );
      break;

    case HCA_ENROLLMENT_STATUSES.closed:
    case HCA_ENROLLMENT_STATUSES.canceledDeclined:
      content = (
        <>
          <h4>Can I apply again?</h4>
          <p>
            Yes. If you have questions about how to complete your application,
            please call our enrollment case management team at 877-222-VETS (
            <a className="help-phone-number-link" href="tel:1-877-222-8387">
              877-222-8387
            </a>
            ).
          </p>
        </>
      );
      break;

    case HCA_ENROLLMENT_STATUSES.pendingMt:
    case HCA_ENROLLMENT_STATUSES.pendingPurpleHeart:
      content = (
        <>
          <h4>
            Should I just submit a new application with all my information?
          </h4>
          <p>
            <strong>
              No. We’re in the process of reviewing your current application,
              and submitting a new application won’t affect our decision.
            </strong>{' '}
            To get help providing the information we need to complete our
            review, please call our enrollment case management team at
            877-222-VETS (
            <a className="help-phone-number-link" href="tel:1-877-222-8387">
              877-222-8387
            </a>
            ).
          </p>
          <p>
            We only recommend applying again if you’ve already worked with our
            enrollment case management team, and they’ve advised you to reapply.
          </p>
        </>
      );
      break;

    case HCA_ENROLLMENT_STATUSES.pendingOther:
    case HCA_ENROLLMENT_STATUSES.pendingUnverified:
      content = (
        <>
          <h4>Should I apply again?</h4>
          <p>
            <strong>
              No. We’re in the process of reviewing your current application,
              and submitting a new application won’t affect our decision.
            </strong>{' '}
            If you’d like to talk about your current application, please call
            our enrollment case management team at 877-222-VETS (
            <a className="help-phone-number-link" href="tel:1-877-222-8387">
              877-222-8387
            </a>
            ).
          </p>
          <p>
            We only recommend applying again if you’ve already worked with our
            enrollment case management team, and they’ve advised you to reapply.
          </p>
        </>
      );
      break;

    default:
      break;
  }
  return content;
}
