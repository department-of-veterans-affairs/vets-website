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
          fileNumber: 796121200,
          payeeNumber: '00',
          personEntitled: 'STUB_M',
          deductionCode: '44',
          benefitType: 'CH35 EDU',
          diaryCode: '618',
          diaryCodeDescription:
            'Account returned from Treasury Cross Servicing. Account is at TOP.  TOP offsets will be applied to account as Federal funds become available.',
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
          fileNumber: 796121200,
          payeeNumber: '00',
          personEntitled: 'AJOHNS',
          deductionCode: '71',
          benefitType: 'CH33 Books, Supplies/MISC EDU',
          diaryCode: '100',
          diaryCodeDescription:
            'First Demand Letter - Inactive Benefits - Due Process',
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
