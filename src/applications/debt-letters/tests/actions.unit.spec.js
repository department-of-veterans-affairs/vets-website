import sinon from 'sinon';
import { expect } from 'chai';
import {
  fetchDebtLetters,
  DEBTS_FETCH_INITIATED,
  DEBTS_FETCH_SUCCESS,
} from '../actions';

describe('fetchDebtLetters', () => {
  it('verify return data', () => {
    const dispatch = sinon.spy();
    return fetchDebtLetters()(dispatch).then(() => {
      expect(dispatch.firstCall.args[0].type).to.equal(DEBTS_FETCH_INITIATED);
      expect(dispatch.secondCall.args[0].type).to.equal(DEBTS_FETCH_SUCCESS);
      expect(dispatch.secondCall.args[0].debts).to.deep.equal([
        {
          fileNumber: '796121200',
          payeeNumber: '00',
          personEntitled: 'AJHONS',
          deductionCode: '30',
          benefitType: 'Comp & Pen',
          diaryCode: '080',
          diaryCodeDescription: 'Referred to the Department of the Treasury',
          amountOverpaid: 0,
          amountWithheld: 0,
          originalAr: 136.24,
          currentAr: 100,
          debtHistory: [
            {
              date: '02/25/2009',
              letterCode: '914',
              description:
                'Paid In Full - Account balance cleared via offset, not including TOP.',
            },
            {
              date: '02/07/2009',
              letterCode: '905',
              description: 'Administrative Write Off',
            },
            {
              date: '12/03/2008',
              letterCode: '487',
              description: 'Death Case Pending Action',
            },
          ],
        },
        {
          fileNumber: '796121200',
          payeeNumber: '00',
          personEntitled: 'STUB_M',
          deductionCode: '44',
          benefitType: 'CH35 EDU',
          diaryCode: '100',
          diaryCodeDescription: 'Pending payment',
          amountOverpaid: 26000,
          amountWithheld: 0,
          originalAr: 100,
          currentAr: 80,
          debtHistory: [
            {
              date: '12/19/2014',
              letterCode: '681',
              description:
                'Account returned from Treasury Cross Servicing. Account is at TOP.  TOP offsets will be applied to account as Federal funds become available.',
            },
            {
              date: '04/11/2013',
              letterCode: '080',
              description: 'Debt referred to Treasury for Cross servicing',
            },
            {
              date: '12/11/2012',
              letterCode: '510',
              description:
                'Demand letters returned.  Unable to verify address with third party.  Account forced to TOP and/or CS.',
            },
            {
              date: '10/17/2012',
              letterCode: '212',
              description: 'Bad Address - Locator Request Sent',
            },
            {
              date: '09/28/2012',
              letterCode: '117',
              description: 'Second Demand Letter',
            },
            {
              date: '09/18/2012',
              letterCode: '100',
              description:
                'First Demand Letter - Inactive Benefits - Due Process',
            },
          ],
        },
        {
          fileNumber: '796121200',
          payeeNumber: '00',
          personEntitled: 'AJOHNS',
          deductionCode: '71',
          benefitType: 'CH33 Books, Supplies/MISC EDU',
          diaryCode: '101',
          diaryCodeDescription: 'Pending automatic benefit offset',
          amountOverpaid: 0,
          amountWithheld: 0,
          originalAr: 166.67,
          currentAr: 120.4,
          debtHistory: [
            {
              date: '09/18/2012',
              letterCode: '100',
              description:
                'First Demand Letter - Inactive Benefits - Due Process',
            },
          ],
        },
        {
          fileNumber: '796121200',
          payeeNumber: '00',
          personEntitled: 'AJOHNS',
          deductionCode: '74',
          benefitType: 'CH33 Student Tuition EDU',
          diaryCode: '117',
          diaryCodeDescription: 'Pending payment',
          amountOverpaid: 0,
          amountWithheld: 475,
          originalAr: 2210.9,
          currentAr: 1000,
          debtHistory: [
            {
              date: '04/01/2017',
              letterCode: 608,
              description: 'Full C&P Benefit Offset Notifi',
            },
            {
              date: '11/18/2015',
              letterCode: 130,
              description: 'Debt Increase - Due P',
            },
            {
              date: '04/08/2015',
              letterCode: 608,
              description: 'Full C&P Benefit Offset Notifi',
            },
            {
              date: '03/26/2015',
              letterCode: 100,
              description:
                'First Demand Letter - Inactive Benefits - Due Process',
            },
          ],
        },
        {
          fileNumber: '796121200',
          payeeNumber: '00',
          personEntitled: 'AJHONS',
          deductionCode: '72',
          benefitType: 'CH33 Housing EDU',
          diaryCode: '123',
          diaryCodeDescription: 'Pending payment',
          amountOverpaid: 0,
          amountWithheld: 321.76,
          originalAr: 321.76,
          currentAr: 200,
          debtHistory: [
            {
              date: '08/08/2018',
              letterCode: 608,
              description: 'Full C&P Benefit Offset Notifi',
            },
            {
              date: '07/19/2018',
              letterCode: 100,
              description:
                'First Demand Letter - Inactive Benefits - Due Process',
            },
          ],
        },
        {
          fileNumber: '796121200',
          payeeNumber: '00',
          personEntitled: 'AJHONS',
          deductionCode: '72',
          benefitType: 'CH33 Housing EDU',
          diaryCode: '500',
          diaryCodeDescription:
            'Debt is pending referral to the Department of the Treasury',
          amountOverpaid: 0,
          amountWithheld: 321.76,
          originalAr: 321.76,
          currentAr: 100,
          debtHistory: [
            {
              date: '08/08/2018',
              letterCode: 608,
              description: 'Full C&P Benefit Offset Notifi',
            },
            {
              date: '07/19/2018',
              letterCode: 100,
              description:
                'First Demand Letter - Inactive Benefits - Due Process',
            },
          ],
        },
        {
          fileNumber: '796121200',
          payeeNumber: '00',
          personEntitled: 'AJHONS',
          deductionCode: '72',
          benefitType: 'CH33 Housing EDU',
          diaryCode: '600',
          diaryCodeDescription: 'Pending payment',
          amountOverpaid: 0,
          amountWithheld: 321.76,
          originalAr: 321.76,
          currentAr: 150,
          debtHistory: [
            {
              date: '08/08/2018',
              letterCode: 608,
              description: 'Full C&P Benefit Offset Notifi',
            },
            {
              date: '07/19/2018',
              letterCode: 100,
              description:
                'First Demand Letter - Inactive Benefits - Due Process',
            },
          ],
        },
        {
          fileNumber: '796121200',
          payeeNumber: '00',
          personEntitled: 'AJOHNS',
          deductionCode: '71',
          benefitType: 'CH33 Books, Supplies/MISC EDU',
          diaryCode: '811',
          diaryCodeDescription: `We’re reviewing your compromise offer`,
          amountOverpaid: 0,
          amountWithheld: 0,
          originalAr: 166.67,
          currentAr: 120.4,
          debtHistory: [
            {
              date: '09/18/2012',
              letterCode: '100',
              description:
                'First Demand Letter - Inactive Benefits - Due Process',
            },
          ],
        },
      ]);
    });
  });
});
