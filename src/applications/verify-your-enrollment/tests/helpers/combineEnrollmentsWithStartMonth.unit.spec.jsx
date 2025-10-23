import { expect } from 'chai';
import { combineEnrollmentsWithStartMonth } from '../../helpers';

describe('combineEnrollmentsWithStartMonth', () => {
  it('should correctly combine enrollments with the same start month', () => {
    const enrollmentPeriods = [
      {
        id: 1,
        actBegin: '2022-01-01',
        actEnd: '2022-01-31',
        numberHours: 10,
        monthlyRate: 100,
        PendingVerificationSubmitted: '',
        paymentDate: '2022-01-31',
        transactDate: '2022-01-31',
      },
      {
        id: 2,
        actBegin: '2022-01-01',
        actEnd: '2022-02-31',
        numberHours: 20,
        monthlyRate: 200,
        PendingVerificationSubmitted: '',
        paymentDate: '2022-01-31',
        transactDate: '2022-01-31',
      },
      {
        id: 3,
        actBegin: '2022-03-01',
        actEnd: '2022-04-28',
        numberHours: 30,
        monthlyRate: 300,
        PendingVerificationSubmitted: '',
        paymentDate: '2022-01-31',
        transactDate: '2022-01-31',
      },
    ];

    const result = combineEnrollmentsWithStartMonth(enrollmentPeriods);

    expect(result).to.deep.equal({
      'January 2022': [
        {
          id: 1,
          actBegin: '2022-01-01',
          actEnd: '2022-01-31',
          numberHours: 10,
          monthlyRate: 100,
          PendingVerificationSubmitted: '',
          paymentDate: '2022-01-31',
          transactDate: '2022-01-31',
        },
        {
          id: 2,
          actBegin: '2022-01-01',
          actEnd: '2022-02-31',
          numberHours: 20,
          monthlyRate: 200,
          PendingVerificationSubmitted: '',
          paymentDate: '2022-01-31',
          transactDate: '2022-01-31',
        },
      ],
      'March 2022': [
        {
          id: 3,
          actBegin: '2022-03-01',
          actEnd: '2022-04-28',
          numberHours: 30,
          monthlyRate: 300,
          PendingVerificationSubmitted: '',
          paymentDate: '2022-01-31',
          transactDate: '2022-01-31',
        },
      ],
    });
  });
});
