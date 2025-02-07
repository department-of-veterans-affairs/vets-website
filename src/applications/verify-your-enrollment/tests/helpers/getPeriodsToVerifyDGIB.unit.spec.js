import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';
import { getPeriodsToVerifyDGIB } from '../../helpers';

const enrollmentVerifications = [
  {
    verificationMonth: 'March 2023',
    verificationBeginDate: '2024-03-01',
    verificationEndDate: '2024-03-28',
    verificationThroughDate: '2024-10-12',
    createdDate: '2024-10-12',
    verificationMethod: '',
    verificationResponse: 'Y',
    facilityName: 'San Francisco State university',
    totalCreditHours: 5,
    paymentTransmissionDate: '2024-10-12',
    lastDepositAmount: 400,
    remainingEntitlement: '05-07',
  },
  {
    verificationMonth: 'March 2023',
    verificationBeginDate: '2024-03-01',
    verificationEndDate: '2024-03-27',
    verificationThroughDate: '2024-03-27',
    createdDate: '2024-10-12',
    verificationMethod: 'VYE',
    verificationResponse: 'Y',
    facilityName: 'San Francisco State university',
    totalCreditHours: 6,
    paymentTransmissionDate: '2024-10-12',
    lastDepositAmount: 1000,
    remainingEntitlement: '05-07',
  },

  {
    verificationMonth: 'Jan 2023',
    verificationBeginDate: '2024-01-01',
    verificationEndDate: '2024-01-22',
    verificationThroughDate: '2024-03-29',
    createdDate: '2024-10-12',
    verificationMethod: '',
    verificationResponse: 'Y',
    facilityName: 'San Francisco State university',
    totalCreditHours: 6,
    paymentTransmissionDate: '2024-10-12',
    lastDepositAmount: 1000,
    remainingEntitlement: '05-07',
  },

  {
    verificationMonth: 'Feb 2023',
    verificationBeginDate: '2024-02-01',
    verificationEndDate: '2024-02-22',
    verificationThroughDate: '2024-03-29',
    createdDate: '2024-10-12',
    verificationMethod: '',
    verificationResponse: 'Y',
    facilityName: 'San Francisco State university',
    totalCreditHours: 6,
    paymentTransmissionDate: '2024-10-12',
    lastDepositAmount: 1000,
    remainingEntitlement: '05-07',
  },
  {
    verificationMonth: 'November 2023',
    verificationBeginDate: '2024-11-12',
    verificationEndDate: '2024-11-28',
    verificationThroughDate: '2024-10-12',
    createdDate: '2024-10-12',
    verificationMethod: '',
    verificationResponse: 'Y',
    facilityName: 'San Francisco State university',
    totalCreditHours: 5,
    paymentTransmissionDate: '2024-10-12',
    lastDepositAmount: 400,
    remainingEntitlement: '05-07',
  },
];
describe('getPeriodsToVerify', () => {
  it('should return the correct JSX for each pending enrollment', () => {
    const wrapper = shallow(
      <div>{getPeriodsToVerifyDGIB(enrollmentVerifications, true)}</div>,
    );
    const divs = wrapper.find('div');
    expect(divs.length).to.be.at.least(3);
    expect(divs.at(1).key()).to.include('Enrollment-to-be-verified');

    wrapper.unmount();
  });
  it('should return just vads-u-margin-y--2 class in no review', () => {
    const wrapper = shallow(
      <div>{getPeriodsToVerifyDGIB(enrollmentVerifications)}</div>,
    );
    const divs = wrapper.find('div');
    expect(divs.at(1).key()).to.include('Enrollment-to-be-verified');
    wrapper.unmount();
  });
  it('should handle an empty array', () => {
    const wrapper = shallow(<div>{getPeriodsToVerifyDGIB([])}</div>);

    expect(wrapper.children()).to.have.length(0);
    wrapper.unmount();
  });
});
