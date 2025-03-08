import { expect } from 'chai';
import { combineEnrollmentsWithStartMonthDGIB } from '../../helpers';
import { verificationRecords } from './data';

describe('combineEnrollmentsWithStartMonthDGIB', () => {
  it('should correctly combine enrollments with the same start month', () => {
    const result = combineEnrollmentsWithStartMonthDGIB(
      verificationRecords.enrollmentVerifications,
    );

    expect(result).to.deep.equal({
      'October 2024': [
        {
          facilityName: 'San Francisco State university',
          totalCreditHours: 5,
          paymentTransmissionDate: '2024-10-12',
          lastDepositAmount: 900,
          remainingEntitlement: '05-07',
          verificationEndDate: '2024-10-19',
          createdDate: '2024-10-12',
          verificationBeginDate: '2024-10-12',
          verificationMethod: '',
          verificationMonth: 'October 2024',
          verificationResponse: 'Y',
        },
      ],
      'May 2024': [
        {
          verificationMonth: 'May 2023',
          verificationBeginDate: '2024-05-12',
          verificationEndDate: '2024-05-28',
          createdDate: '2024-10-12',
          verificationMethod: '',
          verificationResponse: 'Y',
          facilityName: 'San Francisco State university',
          totalCreditHours: 5,
          paymentTransmissionDate: '2024-10-12',
          lastDepositAmount: 600,
          remainingEntitlement: '05-07',
        },
        {
          verificationMonth: 'May 2023',
          verificationBeginDate: '2024-05-01',
          verificationEndDate: '2024-05-12',
          createdDate: '2024-10-12',
          verificationMethod: '',
          verificationResponse: 'Y',
          facilityName: 'San Francisco State university',
          totalCreditHours: 5,
          paymentTransmissionDate: '2024-10-12',
          lastDepositAmount: 600,
          remainingEntitlement: '05-07',
        },
      ],
      'March 2024': [
        {
          verificationMonth: 'March 2023',
          verificationBeginDate: '2024-03-01',
          verificationEndDate: '2024-03-28',
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
          createdDate: '2024-10-12',
          verificationMethod: 'VYE',
          verificationResponse: 'Y',
          facilityName: 'San Francisco State university',
          totalCreditHours: 6,
          paymentTransmissionDate: '2024-10-12',
          lastDepositAmount: 1000,
          remainingEntitlement: '05-07',
        },
      ],
      'January 2024': [
        {
          verificationMonth: 'Jan 2023',
          verificationBeginDate: '2024-01-01',
          verificationEndDate: '2024-01-22',
          createdDate: '2024-10-12',
          verificationMethod: '',
          verificationResponse: 'Y',
          facilityName: 'San Francisco State university',
          totalCreditHours: 6,
          paymentTransmissionDate: '2024-10-12',
          lastDepositAmount: 1000,
          remainingEntitlement: '05-07',
        },
      ],
    });
  });
});
