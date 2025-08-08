import React from 'react';
import { render } from 'enzyme';
import { expect } from 'chai';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import DebtSummaryCard from '../components/DebtSummaryCard';

describe('DebtSummaryCard', () => {
  it('verify debt summary card contents', () => {
    const debt = {
      adamKey: '4',
      fileNumber: '000000009',
      payeeNumber: '00',
      personEntitled: 'STUB_M',
      deductionCode: '44',
      diaryCode: '680',
      benefitType: 'CH35 EDU',
      amountOverpaid: 16000.0,
      amountWithheld: 0.0,
      originalAr: '13000',
      currentAr: '10000',
      debtHistory: [
        {
          date: '09/18/2012',
          letterCode: '100',
          status: 'First Demand Letter - Inactive Benefits',
          description:
            'First due process letter sent when debtor is not actively receiving any benefits.',
        },
        {
          date: '09/28/2012',
          letterCode: '117',
          status: 'Second Demand Letter',
          description:
            'Second demand letter where debtor has no active benefits to offset so debtor is informed that debt may be referred to CRA (60 timer), TOP, CAIVRS or Cross Servicing.  CRA is only one with timer.\r\n117A - Second collections letter sent to schools',
        },
        {
          date: '10/17/2012',
          letterCode: '212',
          status: 'Bad Address - Locator Request Sent',
          description:
            'Originates from mail room Beep File (file of bad addresses to be sent to LexisNexis).  Remains in this status until LexisNexis comes back with updated address information.',
        },
        {
          date: '11/14/2012',
          letterCode: '117',
          status: 'Second Demand Letter',
          description:
            'Second demand letter where debtor has no active benefits to offset so debtor is informed that debt may be referred to CRA (60 timer), TOP, CAIVRS or Cross Servicing.  CRA is only one with timer.\r\n117A - Second collections letter sent to schools',
        },
        {
          date: '12/11/2012',
          letterCode: '510',
          status:
            'Mailing Status Inactive/Invalid - Forced to TOP/Cross Servicing',
          description:
            'Demand letters returned.  Unable to verify address with third party.  Account forced to TOP and/or CS.',
        },
        {
          date: '04/11/2013',
          letterCode: '080',
          status: 'Referred To Cross Servicing',
          description: 'Debt referred to Treasury for Cross servicing',
        },
        {
          date: '12/19/2014',
          letterCode: '681',
          status: 'Returned From Cross Servicing - At TOP',
          description:
            'Account returned from Treasury Cross Servicing. Account is at TOP.  TOP offsets will be applied to account as Federal funds become available.',
        },
      ],
      compositeDebtId: '441300',
    };
    const fakeStore = {
      getState: () => ({
        user: {
          login: {
            currentlyLoggedIn: true,
          },
        },
        combinedPortal: {
          debtLetters: {
            isFetching: false,
            debts: [],
            selectedDebt: '4',
          },
        },
      }),
      subscribe: () => {},
      dispatch: () => {},
    };
    const wrapper = render(
      <Provider store={fakeStore}>
        <BrowserRouter>
          <DebtSummaryCard debt={debt} />
        </BrowserRouter>
      </Provider>,
    );

    expect(wrapper.find('h2').text()).to.equal('Chapter 35 education debt');
  });

  it('should show housing debt note for Post-9/11 GI Bill housing debt', () => {
    const housingDebt = {
      adamKey: '5',
      fileNumber: '000000010',
      payeeNumber: '00',
      personEntitled: 'STUB_M',
      deductionCode: '16', // Post-9/11 GI Bill debt for housing
      diaryCode: '100',
      benefitType: 'CH33 Housing',
      amountOverpaid: 5000.0,
      amountWithheld: 0.0,
      originalAr: '5000',
      currentAr: '5000',
      debtHistory: [
        {
          date: '09/18/2012',
          letterCode: '100',
          status: 'First Demand Letter',
          description: 'First demand letter',
        },
      ],
      compositeDebtId: '441301',
    };

    const fakeStore = {
      getState: () => ({
        user: {
          login: {
            currentlyLoggedIn: true,
          },
        },
        combinedPortal: {
          debtLetters: {
            isFetching: false,
            debts: [],
            selectedDebt: '5',
          },
        },
      }),
      subscribe: () => {},
      dispatch: () => {},
    };

    const wrapper = render(
      <Provider store={fakeStore}>
        <BrowserRouter>
          <DebtSummaryCard debt={housingDebt} />
        </BrowserRouter>
      </Provider>,
    );

    // Check that the housing debt note is present
    const noteText = wrapper.text();
    expect(noteText).to.include(
      'As of August 5, 2025, we now add an ID number (called a "receivable ID")',
    );
    expect(noteText).to.include(
      'Monday through Friday, 7:30 a.m. to 7:00 p.m. ET',
    );
    // Check for the va-telephone component
    expect(wrapper.find('va-telephone')).to.have.lengthOf(1);
  });

  it('should NOT show housing debt note for non-housing debts', () => {
    const nonHousingDebt = {
      adamKey: '6',
      fileNumber: '000000011',
      payeeNumber: '00',
      personEntitled: 'STUB_M',
      deductionCode: '11', // Post-9/11 GI Bill debt for books and supplies (NOT housing)
      diaryCode: '100',
      benefitType: 'CH33 Books',
      amountOverpaid: 3000.0,
      amountWithheld: 0.0,
      originalAr: '3000',
      currentAr: '3000',
      debtHistory: [
        {
          date: '09/18/2012',
          letterCode: '100',
          status: 'First Demand Letter',
          description: 'First demand letter',
        },
      ],
      compositeDebtId: '441302',
    };

    const fakeStore = {
      getState: () => ({
        user: {
          login: {
            currentlyLoggedIn: true,
          },
        },
        combinedPortal: {
          debtLetters: {
            isFetching: false,
            debts: [],
            selectedDebt: '6',
          },
        },
      }),
      subscribe: () => {},
      dispatch: () => {},
    };

    const wrapper = render(
      <Provider store={fakeStore}>
        <BrowserRouter>
          <DebtSummaryCard debt={nonHousingDebt} />
        </BrowserRouter>
      </Provider>,
    );

    // Check that the housing debt note is NOT present
    const noteText = wrapper.text();
    expect(noteText).to.not.include(
      'As of August 5, 2025, we now add an ID number (called a "receivable ID")',
    );
    // Check that va-telephone component is NOT present
    expect(wrapper.find('va-telephone')).to.have.lengthOf(0);
  });
});
