import React from 'react';
import { shallow } from 'enzyme';
import { expect } from 'chai';

import HCAEnrollmentStatusWarning from '../../components/HCAEnrollmentStatusWarning';
import { HCA_ENROLLMENT_STATUSES } from 'applications/hca/constants';

const expectedOutputs = {
  [HCA_ENROLLMENT_STATUSES.activeDuty]:
    '<div class="usa-alert usa-alert-warning"><div class="usa-alert-body"><div class="usa-alert-text"><div><h2 class="usa-alert-heading">Our records show that you’re an active-duty service member</h2><p><strong>You applied on: </strong>April 24, 2019</p></div></div></div></div>',
  [HCA_ENROLLMENT_STATUSES.canceledDeclined]:
    '<div class="usa-alert usa-alert-warning"><div class="usa-alert-body"><div class="usa-alert-text"><div><h2 class="usa-alert-heading">Our records show you chose to cancel or decline VA health care</h2><p><strong>You applied on: </strong>April 24, 2019</p><p>At some time in the past, we offered you enrollment in VA health care, but you declined it. Or you enrolled, but later canceled your enrollment.</p></div></div></div></div>',
  [HCA_ENROLLMENT_STATUSES.closed]:
    'class="usa-alert-text"><div><h2 class="usa-alert-heading">Our records show that your application for VA health care expired</h2><p><strong>You applied on: </strong>April 24, 2019</p><p>We closed your application because you didn’t submit all the documents needed to complete it within a year.</p></div></div></div></div>',
  [HCA_ENROLLMENT_STATUSES.deceased]:
    '<div class="usa-alert usa-alert-warning"><div class="usa-alert-body"><div class="usa-alert-text"><div><h2 class="usa-alert-heading">Our records show that this Veteran is deceased</h2><p>We can’t accept an application for this Veteran.</p><p>If this information is incorrect, please call our enrollment case management team at <a class="no-wrap " href="tel:+18772228387" aria-label="8 7 7. 2 2 2. 8 3 8 7.">877-222-8387</a>.</p></div></div></div></div>',
  [HCA_ENROLLMENT_STATUSES.enrolled]:
    '<div class="usa-alert usa-alert-warning"><div class="usa-alert-body"><div class="usa-alert-text"><div><h2 class="usa-alert-heading">You’re already enrolled in VA health care</h2><p><strong>You applied on: </strong>April 24, 2019<br/><strong>We enrolled you on: </strong>April 30, 2019<br/><strong>Your preferred VA medical center is: </strong>ANCHORAGE VA MEDICAL CENTER</p></div></div></div></div>',
  [HCA_ENROLLMENT_STATUSES.ineligCHAMPVA]:
    '<div class="usa-alert usa-alert-warning"><div class="usa-alert-body"><div class="usa-alert-text"><div><h2 class="usa-alert-heading">You didn’t qualify for VA health care based on your previous application</h2><p><strong>You applied on: </strong>April 24, 2019</p><p>Our records show that you’re enrolled in CHAMPVA. We couldn’t accept your application because the VA medical center you applied to doesn’t offer services to CHAMPVA recipients.</p></div></div></div></div>',
  [HCA_ENROLLMENT_STATUSES.ineligCharacterOfDischarge]:
    '<div class="usa-alert usa-alert-warning"><div class="usa-alert-body"><div class="usa-alert-text"><div><h2 class="usa-alert-heading">We determined that you don’t qualify for VA health care based on your past application</h2><p><strong>You applied on: </strong>April 24, 2019</p><p>Our records show that you don’t have a high enough Character of Discharge to qualify for VA health care.</p></div></div></div></div>',
  [HCA_ENROLLMENT_STATUSES.ineligCitizens]:
    '<div class="usa-alert usa-alert-warning"><div class="usa-alert-body"><div class="usa-alert-text"><div><h2 class="usa-alert-heading">We determined that you don’t qualify for VA health care based on your past application</h2><p><strong>You applied on: </strong>April 24, 2019</p><p>Our records show that you didn’t serve in the U.S. military or an eligible foreign military. To qualify for VA health care, you must meet this service requirement.</p></div></div></div></div>',
  [HCA_ENROLLMENT_STATUSES.ineligFilipinoScouts]:
    '<div class="usa-alert usa-alert-warning"><div class="usa-alert-body"><div class="usa-alert-text"><div><h2 class="usa-alert-heading">We determined that you don’t qualify for VA health care based on your past application</h2><p><strong>You applied on: </strong>April 24, 2019</p><p>Our records show that you didn’t serve in the U.S. military or an eligible foreign military. To qualify for VA health care, you must meet this service requirement.</p></div></div></div></div>',
  [HCA_ENROLLMENT_STATUSES.ineligFugitiveFelon]:
    '<div class="usa-alert usa-alert-warning"><div class="usa-alert-body"><div class="usa-alert-text"><div><h2 class="usa-alert-heading">We determined that you don’t qualify for VA health care based on your past application</h2><p><strong>You applied on: </strong>April 24, 2019</p></div></div></div></div>',
  [HCA_ENROLLMENT_STATUSES.ineligGuardReserve]:
    '<div class="usa-alert usa-alert-warning"><div class="usa-alert-body"><div class="usa-alert-text"><div><h2 class="usa-alert-heading">We determined that you don’t qualify for VA health care based on your past application</h2><p><strong>You applied on: </strong>April 24, 2019</p><p>Our records show that you served in the National Guard or Reserves, and weren’t activated to federal active duty for at least 24 continuous months. To qualify for VA health care without other special eligibility factors, you must have served on active duty for at least 24 months all at once, without a break in service.</p></div></div></div></div>',
  [HCA_ENROLLMENT_STATUSES.ineligMedicare]:
    '<div class="usa-alert usa-alert-warning"><div class="usa-alert-body"><div class="usa-alert-text"><div><h2 class="usa-alert-heading">We determined that you don’t qualify for VA health care based on your past application</h2><p><strong>You applied on: </strong>April 24, 2019</p></div></div></div></div>',
  [HCA_ENROLLMENT_STATUSES.ineligNotEnoughTime]:
    '<div class="usa-alert usa-alert-warning"><div class="usa-alert-body"><div class="usa-alert-text"><div><h2 class="usa-alert-heading">We determined that you don’t qualify for VA health care based on your past application</h2><p><strong>You applied on: </strong>April 24, 2019</p><p>Our records show that you served on active duty for less than 24 continuous months. To qualify for VA health care without other special eligibility factors, you must have served on active duty for at least 24 months all at once, without a break in service.</p></div></div></div></div>',
  [HCA_ENROLLMENT_STATUSES.ineligNotVerified]:
    '<div class="usa-alert usa-alert-warning"><div class="usa-alert-body"><div class="usa-alert-text"><div><h2 class="usa-alert-heading">We determined that you don’t qualify for VA health care based on your past application</h2><p><strong>You applied on: </strong>April 24, 2019</p><p>We determined that you’re not eligible for VA health care because we didn’t have proof of your military service (like your DD214 or other separation papers).</p></div></div></div></div>',
  [HCA_ENROLLMENT_STATUSES.ineligOther]:
    '<div class="usa-alert usa-alert-warning"><div class="usa-alert-body"><div class="usa-alert-text"><div><h2 class="usa-alert-heading">We determined that you don’t qualify for VA health care based on your past application</h2><p><strong>You applied on: </strong>April 24, 2019</p></div></div></div></div>',
  [HCA_ENROLLMENT_STATUSES.ineligOver65]:
    '<div class="usa-alert usa-alert-warning"><div class="usa-alert-body"><div class="usa-alert-text"><div><h2 class="usa-alert-heading">We determined that you don’t qualify for VA health care based on your past application</h2><p><strong>You applied on: </strong>April 24, 2019</p></div></div></div></div>',
  [HCA_ENROLLMENT_STATUSES.ineligRefusedCopay]:
    '<div class="usa-alert usa-alert-warning"><div class="usa-alert-body"><div class="usa-alert-text"><div><h2 class="usa-alert-heading">We determined that you don’t qualify for VA health care based on your past application</h2><p><strong>You applied on: </strong>April 24, 2019</p></div></div></div></div>',
  [HCA_ENROLLMENT_STATUSES.ineligTrainingOnly]:
    '<div class="usa-alert usa-alert-warning"><div class="usa-alert-body"><div class="usa-alert-text"><div><h2 class="usa-alert-heading">We determined that you don’t qualify for VA health care based on your past application</h2><p><strong>You applied on: </strong>April 24, 2019</p><p>Our records show that you served on active duty for less than 24 continuous months. To qualify for VA health care without other special eligibility factors, you must have served on active duty for at least 24 months all at once, without a break in service.</p></div></div></div></div>',
  [HCA_ENROLLMENT_STATUSES.nonMilitary]:
    '<div class="usa-alert usa-alert-warning"><div class="usa-alert-body"><div class="usa-alert-text"><div><h2 class="usa-alert-heading">We see that you aren’t a Veteran or service member</h2></div></div></div></div>',
  [HCA_ENROLLMENT_STATUSES.pendingMt]:
    '<div class="usa-alert usa-alert-warning"><div class="usa-alert-body"><div class="usa-alert-text"><div><h2 class="usa-alert-heading">We need more information to complete our review of your VA health care application</h2><p><strong>You applied on: </strong>April 24, 2019</p><p>We need you to submit a financial disclosure so we can determine if you’re eligible for VA health care based on your income.</p></div></div></div></div>',
  [HCA_ENROLLMENT_STATUSES.pendingOther]:
    '<div class="usa-alert usa-alert-warning"><div class="usa-alert-body"><div class="usa-alert-text"><div><h2 class="usa-alert-heading">We’re reviewing your application</h2><p><strong>You applied on: </strong>April 24, 2019</p><p>We’re in the process of verifying your military service. We’ll contact you by mail if we need you to submit supporting documents (like your DD214 or other discharge papers or separation documents).</p></div></div></div></div>',
  [HCA_ENROLLMENT_STATUSES.pendingPurpleHeart]:
    '<div class="usa-alert usa-alert-warning"><div class="usa-alert-body"><div class="usa-alert-text"><div><h2 class="usa-alert-heading">We need more information to complete our review of your VA health care application</h2><p><strong>You applied on: </strong>April 24, 2019</p><p>You included on your application that you’ve received a Purple Heart medal. We need an official document showing that you received this award so we can confirm your eligibility for VA health care.</p><p><a href="/records/get-military-service-records/">Find out how to request your military records</a></p></div></div></div></div>',
  [HCA_ENROLLMENT_STATUSES.pendingUnverified]:
    '<div class="usa-alert usa-alert-warning"><div class="usa-alert-body"><div class="usa-alert-text"><div><h2 class="usa-alert-heading">We’re reviewing your application</h2><p><strong>You applied on: </strong>April 24, 2019</p><p>We’re in the process of verifying your military service. We’ll contact you by mail if we need you to submit supporting documents (like your DD214 or other discharge papers or separation documents).</p></div></div></div></div>',
  [HCA_ENROLLMENT_STATUSES.rejectedIncWrongEntry]:
    '<div class="usa-alert usa-alert-warning"><div class="usa-alert-body"><div class="usa-alert-text"><div><h2 class="usa-alert-heading">You didn’t qualify for VA health care based on your previous application</h2><p><strong>You applied on: </strong>April 24, 2019</p><p>Our records show that you don’t have a service-connected disability, an income that falls below our income limits based on where you live, or another special eligibility factor (like receiving a Medal of Honor or Purple Heart award). To qualify for VA health care, you need to meet at least one of these eligibility requirements in addition to serving at least 24 continuous months on active duty.</p></div></div></div></div>',
  [HCA_ENROLLMENT_STATUSES.rejectedScWrongEntry]:
    '<div class="usa-alert usa-alert-warning"><div class="usa-alert-body"><div class="usa-alert-text"><div><h2 class="usa-alert-heading">You didn’t qualify for VA health care based on your previous application</h2><p><strong>You applied on: </strong>April 24, 2019</p><p>Our records show that you don’t have a service-connected disability, an income that falls below our income limits based on where you live, or another special eligibility factor (like receiving a Medal of Honor or Purple Heart award). To qualify for VA health care, you need to meet at least one of these eligibility requirements in addition to serving at least 24 continuous months on active duty.</p></div></div></div></div>',
  [HCA_ENROLLMENT_STATUSES.rejectedRightEntry]:
    '<div class="usa-alert usa-alert-warning"><div class="usa-alert-body"><div class="usa-alert-text"><div><h2 class="usa-alert-heading">You didn’t qualify for VA health care based on your previous application</h2><p><strong>You applied on: </strong>April 24, 2019</p><p>Our records show that you don’t have a service-connected disability, an income that falls below our income limits based on where you live, or another special eligibility factor (like receiving a Medal of Honor or Purple Heart award). To qualify for VA health care, you need to meet at least one of these eligibility requirements in addition to serving at least 24 continuous months on active duty.</p></div></div></div></div>',
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
describe('<HCAEnrollmentStatusWarning />', () => {
  const defaultProps = {
    applicationDate: '2019-04-24T12:00:00.000-00:00',
    enrollmentDate: '2019-04-30T12:00:00.000-00:00',
    enrollmentStatus: 'enrolled',
    preferredFacility: '463 - CHEY6',
  };
  it('renders a `warning` AlertBox', () => {
    const wrapper = shallow(<HCAEnrollmentStatusWarning {...defaultProps} />);
    const alertBox = wrapper.filter('AlertBox');
    expect(alertBox.exists()).to.be.true;
    expect(alertBox.prop('status')).to.equal('warning');
    wrapper.unmount;
  });
  describe('renders the correct output for all of the handled enrollment statuses', () => {
    Object.keys(expectedOutputs).forEach(enrollmentStatus => {
      it(`it renders the correct alert contents for status: ${enrollmentStatus}`, () => {
        const props = { ...defaultProps, enrollmentStatus };
        const wrapper = shallow(<HCAEnrollmentStatusWarning {...props} />);
        expect(wrapper.html()).to.contain(expectedOutputs[enrollmentStatus]);
        wrapper.unmount();
      });
    });
  });
});
