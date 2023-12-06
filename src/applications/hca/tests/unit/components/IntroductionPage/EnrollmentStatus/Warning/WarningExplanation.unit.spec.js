import React from 'react';
import { render } from '@testing-library/react';
import { expect } from 'chai';

import { HCA_ENROLLMENT_STATUSES } from '../../../../../../utils/constants';
import WarningExplanation from '../../../../../../components/IntroductionPage/EnrollmentStatus/Warning/WarningExplanation';

describe('hca <WarningExplanation>', () => {
  const expectedOutputs = {
    [HCA_ENROLLMENT_STATUSES.activeDuty]: '',
    [HCA_ENROLLMENT_STATUSES.canceledDeclined]:
      '<p>At some time in the past, we offered you enrollment in VA health care, but you declined it. Or you enrolled, but later canceled your enrollment.</p>',
    [HCA_ENROLLMENT_STATUSES.closed]:
      '<p>We closed your application because you didn’t submit all the documents needed to complete it within a year.</p>',
    [HCA_ENROLLMENT_STATUSES.deceased]:
      '<p>We can’t accept an application for this Veteran.</p><p>If this information is incorrect, please call our enrollment case management team at <va-telephone contact="8772228387"></va-telephone>.</p>',
    [HCA_ENROLLMENT_STATUSES.enrolled]: '',
    [HCA_ENROLLMENT_STATUSES.ineligCHAMPVA]:
      '<p>Our records show that you’re enrolled in CHAMPVA. We couldn’t accept your application because the VA medical center you applied to doesn’t offer services to CHAMPVA recipients.</p>',
    [HCA_ENROLLMENT_STATUSES.ineligCharacterOfDischarge]:
      '<p>Our records show that you don’t have a high enough Character of Discharge to qualify for VA health care.</p>',
    [HCA_ENROLLMENT_STATUSES.ineligCitizens]:
      '<p>Our records show that you didn’t serve in the U.S. military or an eligible foreign military. To qualify for VA health care, you must meet this service requirement.</p>',
    [HCA_ENROLLMENT_STATUSES.ineligFilipinoScouts]:
      '<p>Our records show that you didn’t serve in the U.S. military or an eligible foreign military. To qualify for VA health care, you must meet this service requirement.</p>',
    [HCA_ENROLLMENT_STATUSES.ineligFugitiveFelon]: '',
    [HCA_ENROLLMENT_STATUSES.ineligGuardReserve]:
      '<p>Our records show that you served in the National Guard or Reserves, and weren’t activated to federal active duty for at least 24 continuous months. To qualify for VA health care without other special eligibility factors, you must have served on active duty for at least 24 months all at once, without a break in service.</p>',
    [HCA_ENROLLMENT_STATUSES.ineligMedicare]: '',
    [HCA_ENROLLMENT_STATUSES.ineligNotEnoughTime]:
      '<p>Our records show that you served on active duty for less than 24 continuous months. To qualify for VA health care without other special eligibility factors, you must have served on active duty for at least 24 months all at once, without a break in service.</p>',
    [HCA_ENROLLMENT_STATUSES.ineligNotVerified]:
      '<p>We determined that you’re not eligible for VA health care because we didn’t have proof of your military service (like your DD214 or other separation papers).</p>',
    [HCA_ENROLLMENT_STATUSES.ineligOther]: '',
    [HCA_ENROLLMENT_STATUSES.ineligOver65]: '',
    [HCA_ENROLLMENT_STATUSES.ineligRefusedCopay]: '',
    [HCA_ENROLLMENT_STATUSES.ineligTrainingOnly]:
      '<p>Our records show that you served on active duty for less than 24 continuous months. To qualify for VA health care without other special eligibility factors, you must have served on active duty for at least 24 months all at once, without a break in service.</p>',
    [HCA_ENROLLMENT_STATUSES.nonMilitary]: '',
    [HCA_ENROLLMENT_STATUSES.pendingMt]:
      '<p>We need you to submit a financial disclosure so we can determine if you’re eligible for VA health care based on your income.</p>',
    [HCA_ENROLLMENT_STATUSES.pendingOther]:
      '<p>We’re in the process of verifying your military service. We’ll contact you by mail if we need you to submit supporting documents (like your DD214 or other discharge papers or separation documents).</p>',
    [HCA_ENROLLMENT_STATUSES.pendingPurpleHeart]:
      '<p>You included on your application that you’ve received a Purple Heart medal. We need an official document showing that you received this award so we can confirm your eligibility for VA health care.</p><p><va-link href="/records/get-military-service-records/" text="Find out how to request your military records"></va-link></p>',
    [HCA_ENROLLMENT_STATUSES.pendingUnverified]:
      '<p>We’re in the process of verifying your military service. We’ll contact you by mail if we need you to submit supporting documents (like your DD214 or other discharge papers or separation documents).</p>',
    [HCA_ENROLLMENT_STATUSES.rejectedIncWrongEntry]:
      '<p>Our records show that you don’t have a service-connected disability, an income that falls below our income limits based on where you live, or another special eligibility factor (like receiving a Medal of Honor or Purple Heart award). To qualify for VA health care, you need to meet at least one of these eligibility requirements in addition to serving at least 24 continuous months on active duty.</p>',
    [HCA_ENROLLMENT_STATUSES.rejectedScWrongEntry]:
      '<p>Our records show that you don’t have a service-connected disability, an income that falls below our income limits based on where you live, or another special eligibility factor (like receiving a Medal of Honor or Purple Heart award). To qualify for VA health care, you need to meet at least one of these eligibility requirements in addition to serving at least 24 continuous months on active duty.</p>',
    [HCA_ENROLLMENT_STATUSES.rejectedRightEntry]:
      '<p>Our records show that you don’t have a service-connected disability, an income that falls below our income limits based on where you live, or another special eligibility factor (like receiving a Medal of Honor or Purple Heart award). To qualify for VA health care, you need to meet at least one of these eligibility requirements in addition to serving at least 24 continuous months on active duty.</p>',
  };

  context('when the content is generated based on enrollment status', () => {
    it('should have content for all possible statuses', () => {
      const possibleEnrollmentStatuses = Object.values({
        ...HCA_ENROLLMENT_STATUSES,
      }).filter(
        enrollmentStatus =>
          enrollmentStatus !== HCA_ENROLLMENT_STATUSES.activeDuty &&
          enrollmentStatus !== HCA_ENROLLMENT_STATUSES.deceased &&
          enrollmentStatus !== HCA_ENROLLMENT_STATUSES.noneOfTheAbove,
      );
      const testedEnrollmentStatuses = Object.keys(expectedOutputs);
      expect(
        possibleEnrollmentStatuses.every(enrollmentStatus =>
          testedEnrollmentStatuses.includes(enrollmentStatus),
        ),
      ).to.be.true;
    });

    Object.keys(expectedOutputs).forEach(enrollmentStatus => {
      it(`should render the correct content for status: ${enrollmentStatus}`, () => {
        const props = { enrollmentStatus };
        const { container } = render(<WarningExplanation {...props} />);
        expect(container).to.contain.html(expectedOutputs[enrollmentStatus]);
      });
    });
  });
});
