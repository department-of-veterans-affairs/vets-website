import React from 'react';
import { render } from '@testing-library/react';
import { expect } from 'chai';

import { HCA_ENROLLMENT_STATUSES } from '../../../../utils/constants';
import EnrollmentStatusWarning from '../../../../components/IntroductionPage/EnrollmentStatus/Warning';
import WarningStatus from '../../../../components/IntroductionPage/EnrollmentStatus/Warning/WarningStatus';

const expectedOutputs = {
  [HCA_ENROLLMENT_STATUSES.activeDuty]:
    '<h2 slot="headline" data-testid="enrollment-alert-heading">Our records show that you’re an active-duty service member</h2><ul class="hca-list-style-none"><li><strong>You applied on:</strong> April 24, 2019</li></ul>',
  [HCA_ENROLLMENT_STATUSES.canceledDeclined]:
    '<h2 slot="headline" data-testid="enrollment-alert-heading">Our records show you chose to cancel or decline VA health care</h2><ul class="hca-list-style-none"><li><strong>You applied on:</strong> April 24, 2019</li></ul><p>At some time in the past, we offered you enrollment in VA health care, but you declined it. Or you enrolled, but later canceled your enrollment.</p>',
  [HCA_ENROLLMENT_STATUSES.closed]:
    '<h2 slot="headline" data-testid="enrollment-alert-heading">Our records show that your application for VA health care expired</h2><ul class="hca-list-style-none"><li><strong>You applied on:</strong> April 24, 2019</li></ul><p>We closed your application because you didn’t submit all the documents needed to complete it within a year.</p>',
  [HCA_ENROLLMENT_STATUSES.deceased]:
    '<h2 slot="headline" data-testid="enrollment-alert-heading">Our records show that this Veteran is deceased</h2><p>We can’t accept an application for this Veteran.</p><p>If this information is incorrect, please call our enrollment case management team at <va-telephone contact="8772228387"></va-telephone>.</p>',
  [HCA_ENROLLMENT_STATUSES.enrolled]:
    '<h2 slot="headline" data-testid="enrollment-alert-heading">You’re already enrolled in VA health care</h2><ul class="hca-list-style-none"><li><strong>You applied on:</strong> April 24, 2019</li><li><strong>We enrolled you on:</strong> April 30, 2019</li><li><strong>Your preferred VA medical center is:</strong> Anchorage VA Medical Center</li></ul>',
  [HCA_ENROLLMENT_STATUSES.ineligCHAMPVA]:
    '<h2 slot="headline" data-testid="enrollment-alert-heading">You didn’t qualify for VA health care based on your previous application</h2><ul class="hca-list-style-none"><li><strong>You applied on:</strong> April 24, 2019</li></ul><p>Our records show that you’re enrolled in CHAMPVA. We couldn’t accept your application because the VA medical center you applied to doesn’t offer services to CHAMPVA recipients.</p>',
  [HCA_ENROLLMENT_STATUSES.ineligCharacterOfDischarge]:
    '<h2 slot="headline" data-testid="enrollment-alert-heading">We determined that you don’t qualify for VA health care based on your past application</h2><ul class="hca-list-style-none"><li><strong>You applied on:</strong> April 24, 2019</li></ul><p>Our records show that you don’t have a high enough Character of Discharge to qualify for VA health care.</p>',
  [HCA_ENROLLMENT_STATUSES.ineligCitizens]:
    '<h2 slot="headline" data-testid="enrollment-alert-heading">We determined that you don’t qualify for VA health care based on your past application</h2><ul class="hca-list-style-none"><li><strong>You applied on:</strong> April 24, 2019</li></ul><p>Our records show that you didn’t serve in the U.S. military or an eligible foreign military. To qualify for VA health care, you must meet this service requirement.</p>',
  [HCA_ENROLLMENT_STATUSES.ineligFilipinoScouts]:
    '<h2 slot="headline" data-testid="enrollment-alert-heading">We determined that you don’t qualify for VA health care based on your past application</h2><ul class="hca-list-style-none"><li><strong>You applied on:</strong> April 24, 2019</li></ul><p>Our records show that you didn’t serve in the U.S. military or an eligible foreign military. To qualify for VA health care, you must meet this service requirement.</p>',
  [HCA_ENROLLMENT_STATUSES.ineligFugitiveFelon]:
    '<h2 slot="headline" data-testid="enrollment-alert-heading">We determined that you don’t qualify for VA health care based on your past application</h2><ul class="hca-list-style-none"><li><strong>You applied on:</strong> April 24, 2019</li></ul>',
  [HCA_ENROLLMENT_STATUSES.ineligGuardReserve]:
    '<h2 slot="headline" data-testid="enrollment-alert-heading">We determined that you don’t qualify for VA health care based on your past application</h2><ul class="hca-list-style-none"><li><strong>You applied on:</strong> April 24, 2019</li></ul><p>Our records show that you served in the National Guard or Reserves, and weren’t activated to federal active duty for at least 24 continuous months. To qualify for VA health care without other special eligibility factors, you must have served on active duty for at least 24 months all at once, without a break in service.</p>',
  [HCA_ENROLLMENT_STATUSES.ineligMedicare]:
    '<h2 slot="headline" data-testid="enrollment-alert-heading">We determined that you don’t qualify for VA health care based on your past application</h2><ul class="hca-list-style-none"><li><strong>You applied on:</strong> April 24, 2019</li></ul>',
  [HCA_ENROLLMENT_STATUSES.ineligNotEnoughTime]:
    '<h2 slot="headline" data-testid="enrollment-alert-heading">We determined that you don’t qualify for VA health care based on your past application</h2><ul class="hca-list-style-none"><li><strong>You applied on:</strong> April 24, 2019</li></ul><p>Our records show that you served on active duty for less than 24 continuous months. To qualify for VA health care without other special eligibility factors, you must have served on active duty for at least 24 months all at once, without a break in service.</p>',
  [HCA_ENROLLMENT_STATUSES.ineligNotVerified]:
    '<h2 slot="headline" data-testid="enrollment-alert-heading">We determined that you don’t qualify for VA health care based on your past application</h2><ul class="hca-list-style-none"><li><strong>You applied on:</strong> April 24, 2019</li></ul><p>We determined that you’re not eligible for VA health care because we didn’t have proof of your military service (like your DD214 or other separation papers).</p>',
  [HCA_ENROLLMENT_STATUSES.ineligOther]:
    '<h2 slot="headline" data-testid="enrollment-alert-heading">We determined that you don’t qualify for VA health care based on your past application</h2><ul class="hca-list-style-none"><li><strong>You applied on:</strong> April 24, 2019</li></ul>',
  [HCA_ENROLLMENT_STATUSES.ineligOver65]:
    '<h2 slot="headline" data-testid="enrollment-alert-heading">We determined that you don’t qualify for VA health care based on your past application</h2><ul class="hca-list-style-none"><li><strong>You applied on:</strong> April 24, 2019</li></ul>',
  [HCA_ENROLLMENT_STATUSES.ineligRefusedCopay]:
    '<h2 slot="headline" data-testid="enrollment-alert-heading">We determined that you don’t qualify for VA health care based on your past application</h2><ul class="hca-list-style-none"><li><strong>You applied on:</strong> April 24, 2019</li></ul>',
  [HCA_ENROLLMENT_STATUSES.ineligTrainingOnly]:
    '<h2 slot="headline" data-testid="enrollment-alert-heading">We determined that you don’t qualify for VA health care based on your past application</h2><ul class="hca-list-style-none"><li><strong>You applied on:</strong> April 24, 2019</li></ul><p>Our records show that you served on active duty for less than 24 continuous months. To qualify for VA health care without other special eligibility factors, you must have served on active duty for at least 24 months all at once, without a break in service.</p>',
  [HCA_ENROLLMENT_STATUSES.nonMilitary]:
    '<h2 slot="headline" data-testid="enrollment-alert-heading">We see that you aren’t a Veteran or service member</h2>',
  [HCA_ENROLLMENT_STATUSES.pendingMt]:
    '<h2 slot="headline" data-testid="enrollment-alert-heading">We need more information to complete our review of your VA health care application</h2><ul class="hca-list-style-none"><li><strong>You applied on:</strong> April 24, 2019</li></ul><p>We need you to submit a financial disclosure so we can determine if you’re eligible for VA health care based on your income.</p>',
  [HCA_ENROLLMENT_STATUSES.pendingOther]:
    '<h2 slot="headline" data-testid="enrollment-alert-heading">We’re reviewing your application</h2><ul class="hca-list-style-none"><li><strong>You applied on:</strong> April 24, 2019</li></ul><p>We’re in the process of verifying your military service. We’ll contact you by mail if we need you to submit supporting documents (like your DD214 or other discharge papers or separation documents).</p>',
  [HCA_ENROLLMENT_STATUSES.pendingPurpleHeart]:
    '<h2 slot="headline" data-testid="enrollment-alert-heading">We need more information to complete our review of your VA health care application</h2><ul class="hca-list-style-none"><li><strong>You applied on:</strong> April 24, 2019</li></ul><p>You included on your application that you’ve received a Purple Heart medal. We need an official document showing that you received this award so we can confirm your eligibility for VA health care.</p><p><va-link href="/records/get-military-service-records/" text="Find out how to request your military records"></va-link></p>',
  [HCA_ENROLLMENT_STATUSES.pendingUnverified]:
    '<h2 slot="headline" data-testid="enrollment-alert-heading">We’re reviewing your application</h2><ul class="hca-list-style-none"><li><strong>You applied on:</strong> April 24, 2019</li></ul><p>We’re in the process of verifying your military service. We’ll contact you by mail if we need you to submit supporting documents (like your DD214 or other discharge papers or separation documents).</p>',
  [HCA_ENROLLMENT_STATUSES.rejectedIncWrongEntry]:
    '<h2 slot="headline" data-testid="enrollment-alert-heading">You didn’t qualify for VA health care based on your previous application</h2><ul class="hca-list-style-none"><li><strong>You applied on:</strong> April 24, 2019</li></ul><p>Our records show that you don’t have a service-connected disability, an income that falls below our income limits based on where you live, or another special eligibility factor (like receiving a Medal of Honor or Purple Heart award). To qualify for VA health care, you need to meet at least one of these eligibility requirements in addition to serving at least 24 continuous months on active duty.</p>',
  [HCA_ENROLLMENT_STATUSES.rejectedScWrongEntry]:
    '<h2 slot="headline" data-testid="enrollment-alert-heading">You didn’t qualify for VA health care based on your previous application</h2><ul class="hca-list-style-none"><li><strong>You applied on:</strong> April 24, 2019</li></ul><p>Our records show that you don’t have a service-connected disability, an income that falls below our income limits based on where you live, or another special eligibility factor (like receiving a Medal of Honor or Purple Heart award). To qualify for VA health care, you need to meet at least one of these eligibility requirements in addition to serving at least 24 continuous months on active duty.</p>',
  [HCA_ENROLLMENT_STATUSES.rejectedRightEntry]:
    '<h2 slot="headline" data-testid="enrollment-alert-heading">You didn’t qualify for VA health care based on your previous application</h2><ul class="hca-list-style-none"><li><strong>You applied on:</strong> April 24, 2019</li></ul><p>Our records show that you don’t have a service-connected disability, an income that falls below our income limits based on where you live, or another special eligibility factor (like receiving a Medal of Honor or Purple Heart award). To qualify for VA health care, you need to meet at least one of these eligibility requirements in addition to serving at least 24 continuous months on active duty.</p>',
};

describe('these tests themselves', () => {
  it('test the content generated by all of the possible enrollment statuses', () => {
    const possibleEnrollmentStatuses = Object.values({
      ...HCA_ENROLLMENT_STATUSES,
    }).filter(
      enrollmentStatus =>
        enrollmentStatus !== HCA_ENROLLMENT_STATUSES.activeDuty &&
        enrollmentStatus !== HCA_ENROLLMENT_STATUSES.noneOfTheAbove,
    );
    const testedEnrollmentStatuses = Object.keys(expectedOutputs);
    expect(
      possibleEnrollmentStatuses.every(enrollmentStatus =>
        testedEnrollmentStatuses.includes(enrollmentStatus),
      ),
    ).to.be.true;
  });
});

describe('hca <EnrollmentStatusWarning>', () => {
  const defaultProps = {
    applicationDate: '2019-04-24T12:00:00.000-00:00',
    enrollmentDate: '2019-04-30T12:00:00.000-00:00',
    enrollmentStatus: 'enrolled',
    preferredFacility: '463 - CHEY6',
  };

  it('renders a `warning` alert', () => {
    const view = render(<EnrollmentStatusWarning {...defaultProps} />);
    const alertBox = view.container.querySelector('va-alert');
    expect(alertBox).to.exist;
    expect(alertBox).to.have.attribute('status', 'warning');
  });

  describe('renders the correct output for all of the handled enrollment statuses', () => {
    Object.keys(expectedOutputs).forEach(enrollmentStatus => {
      it(`it renders the correct alert contents for status: ${enrollmentStatus}`, () => {
        const props = { ...defaultProps, enrollmentStatus };
        const view = render(<EnrollmentStatusWarning {...props} />);
        const alertBox = view.container.querySelector('va-alert');
        expect(alertBox).to.contain.html(expectedOutputs[enrollmentStatus]);
      });
    });
  });
});

describe('hca <WarningStatus>', () => {
  describe('when `enrollmentStatus` is `deceased`', () => {
    it('should render empty', () => {
      const view = render(
        <WarningStatus enrollmentStatus={HCA_ENROLLMENT_STATUSES.deceased} />,
      );
      expect(view.container).to.be.empty;
    });
  });

  describe('default behavior', () => {
    describe('if no `applicationDate` is passed', () => {
      it('should render empty', () => {
        const view = render(
          <WarningStatus enrollmentStatus="enrollment_status" />,
        );
        expect(view.container).to.be.empty;
      });
    });

    describe('if `applicationDate` is a valid date', () => {
      it('should return the correct markup', () => {
        const view = render(
          <WarningStatus
            enrollmentStatus="enrollment_status"
            applicationDate="2018-01-24T00:00:00.000-06:00"
          />,
        );
        expect(view.container.querySelectorAll('li').length).equals(1);
        expect(view.container).to.contain.text('You applied on:');
      });
    });
  });

  describe('when `enrollmentStatus` is `enrolled`', () => {
    describe('when no info is provided', () => {
      it('should render empty', () => {
        const view = render(
          <WarningStatus enrollmentStatus={HCA_ENROLLMENT_STATUSES.enrolled} />,
        );
        expect(view.container).to.be.empty;
      });
    });

    describe('when all info is provided', () => {
      it('should return the correct markup', () => {
        const view = render(
          <WarningStatus
            enrollmentStatus={HCA_ENROLLMENT_STATUSES.enrolled}
            applicationDate="2018-01-24T00:00:00.000-06:00"
            enrollmentDate="2018-01-24T00:00:00.000-06:00"
            preferredFacility="FACILITY NAME"
          />,
        );
        expect(view.container.querySelectorAll('li').length).equals(3);
        expect(view.container).to.contain.text('You applied on:');
        expect(view.container).to.contain.text('We enrolled you on:');
        expect(view.container).to.contain.text(
          'Your preferred VA medical center is:',
        );
      });
    });

    describe('when the `applicationDate` is not set', () => {
      it('should return the correct markup', () => {
        const view = render(
          <WarningStatus
            enrollmentStatus={HCA_ENROLLMENT_STATUSES.enrolled}
            enrollmentDate="2018-01-24T00:00:00.000-06:00"
            preferredFacility="FACILITY NAME"
          />,
        );
        expect(view.container.querySelectorAll('li').length).equals(2);
        expect(view.container).to.not.contain.text('You applied on:');
        expect(view.container).to.contain.text('We enrolled you on:');
        expect(view.container).to.contain.text(
          'Your preferred VA medical center is:',
        );
      });
    });

    describe('when the `enrollmentDate` is not set', () => {
      it('should return the correct markup', () => {
        const view = render(
          <WarningStatus
            enrollmentStatus={HCA_ENROLLMENT_STATUSES.enrolled}
            applicationDate="2018-01-24T00:00:00.000-06:00"
            preferredFacility="FACILITY NAME"
          />,
        );
        expect(view.container.querySelectorAll('li').length).equals(2);
        expect(view.container).to.contain.text('You applied on:');
        expect(view.container).to.not.contain.text('We enrolled you on:');
        expect(view.container).to.contain.text(
          'Your preferred VA medical center is:',
        );
      });
    });

    describe('when the `preferredFacility` is not set', () => {
      it('should return the correct markup', () => {
        const view = render(
          <WarningStatus
            enrollmentStatus={HCA_ENROLLMENT_STATUSES.enrolled}
            applicationDate="2018-01-24T00:00:00.000-06:00"
            enrollmentDate="2018-01-24T00:00:00.000-06:00"
          />,
        );
        expect(view.container.querySelectorAll('li').length).equals(2);
        expect(view.container).to.contain.text('You applied on:');
        expect(view.container).to.contain.text('We enrolled you on:');
        expect(view.container).to.not.contain.text(
          'Your preferred VA medical center is:',
        );
      });
    });

    describe('when only `preferredFacility` is set', () => {
      it('should return the correct markup', () => {
        const view = render(
          <WarningStatus
            enrollmentStatus={HCA_ENROLLMENT_STATUSES.enrolled}
            preferredFacility="FACILITY NAME"
          />,
        );
        expect(view.container.querySelectorAll('li').length).equals(1);
        expect(view.container).to.not.contain.text('You applied on:');
        expect(view.container).to.not.contain.text('We enrolled you on:');
        expect(view.container).to.contain.text(
          'Your preferred VA medical center is:',
        );
      });
    });
  });
});
