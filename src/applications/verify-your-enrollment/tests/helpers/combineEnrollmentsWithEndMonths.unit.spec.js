import { expect } from 'chai';
import { combineEnrollmentsWithEndMonths } from '../../helpers';

describe('combineEnrollmentsWithEndMonths', () => {
  it('should correctly combine enrollments with the same end month', () => {
    const enrollmentPeriods = [
      {
        id: 1,
        awardBeginDate: '2022-01-01',
        awardEndDate: '2022-01-31',
        numberHours: 10,
        monthlyRate: 100,
      },
      {
        id: 2,
        awardBeginDate: '2022-02-01',
        awardEndDate: '2022-01-31',
        numberHours: 20,
        monthlyRate: 200,
      },
      {
        id: 3,
        awardBeginDate: '2022-03-01',
        awardEndDate: '2022-02-28',
        numberHours: 30,
        monthlyRate: 300,
      },
    ];

    const result = combineEnrollmentsWithEndMonths(enrollmentPeriods);

    expect(result).to.deep.equal({
      'January 2022': [
        {
          id: 1,
          awardBeginDate: '2022-01-01',
          awardEndDate: '2022-01-31',
          numberHours: 10,
          monthlyRate: 100,
        },
        {
          id: 2,
          awardBeginDate: '2022-02-01',
          awardEndDate: '2022-01-31',
          numberHours: 20,
          monthlyRate: 200,
        },
      ],
      'February 2022': [
        {
          id: 3,
          awardBeginDate: '2022-03-01',
          awardEndDate: '2022-02-28',
          numberHours: 30,
          monthlyRate: 300,
        },
      ],
    });
  });
});
