import { expect } from 'chai';
import { groupVerificationsByMonth } from '../../helpers';
import { verificationRecords } from './data';

describe('groupVerificationsByMonth', () => {
  it('shoould group by month', () => {
    const result = groupVerificationsByMonth(
      verificationRecords.enrollmentVerifications,
    );
    expect(result).to.deep.equal([
      {
        verificationMonth: 'October 2024',
        verificationBeginDate: '2024-10-12',
        verificationEndDate: '2024-10-19',
        verificationThroughDate: '2024-10-12',
        createdDate: '2024-10-12',
        verificationMethod: '',
        verificationResponse: 'Y',
        facilityName: 'San Francisco State university',
        totalCreditHours: 5,
        paymentTransmissionDate: '2024-10-12',
        lastDepositAmount: 900,
        remainingEntitlement: '05-07',
      },
      {
        verificationMonth: 'May 2023',
        verificationBeginDate: '2024-05-12',
        verificationEndDate: '2024-05-28',
        verificationThroughDate: '2024-10-12',
        createdDate: '2024-10-12',
        verificationMethod: '',
        verificationResponse: 'Y',
        facilityName: 'San Francisco State university',
        totalCreditHours: 10,
        paymentTransmissionDate: '2024-10-12',
        lastDepositAmount: 600,
        remainingEntitlement: '05-07',
      },
      {
        verificationMonth: 'March 2023',
        verificationBeginDate: '2024-03-01',
        verificationEndDate: '2024-03-28',
        verificationThroughDate: '2024-10-12',
        createdDate: '2024-10-12',
        verificationMethod: '',
        verificationResponse: 'Y',
        facilityName: 'San Francisco State university',
        totalCreditHours: 11,
        paymentTransmissionDate: '2024-10-12',
        lastDepositAmount: 400,
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
    ]);
  });
});
