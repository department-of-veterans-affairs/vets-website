import React from 'react';
import { render } from 'enzyme';
import { expect } from 'chai';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import DebtDetailsCard from '../components/DebtDetailsCard';

describe('DebtDetailsCard', () => {
  const createFakeStore = (debts = []) => ({
    getState: () => ({
      user: {
        login: {
          currentlyLoggedIn: true,
        },
      },
      combinedPortal: {
        debtLetters: {
          isFetching: false,
          debts,
          selectedDebt: '4',
        },
      },
    }),
    subscribe: () => {},
    dispatch: () => {},
  });

  it('verify debt details card contents', () => {
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
    const fakeStore = createFakeStore();
    const wrapper = render(
      <Provider store={fakeStore}>
        <BrowserRouter>
          <DebtDetailsCard debt={debt} />
        </BrowserRouter>
      </Provider>,
    );

    expect(wrapper.find('h2').text()).to.equal(
      'Pay your $10,000.00 balance now or request help',
    );
    expect(wrapper.find('p').text()).includes(
      'To avoid collection actions on your bill, you must pay your full balance or request financial help.',
    );
  });

  it('should always render OTPP version since its the standard implementation now', () => {
    const debt = {
      compositeDebtId: '441300',
      currentAr: 5000,
      diaryCode: '117',
      debtHistory: [
        {
          date: '2023-01-01',
          letterCode: '100',
        },
      ],
    };
    const fakeStore = createFakeStore();
    const wrapper = render(
      <Provider store={fakeStore}>
        <BrowserRouter>
          <DebtDetailsCard debt={debt} />
        </BrowserRouter>
      </Provider>,
    );

    expect(
      wrapper.find('va-link-action[data-testid="link-resolve"]'),
    ).to.have.lengthOf(1);
    expect(
      wrapper.find('va-link-action[data-testid="link-resolve"]').attr('text'),
    ).to.equal('Resolve this overpayment');
  });

  it('should handle debt with no debtHistory', () => {
    const debt = {
      compositeDebtId: '441300',
      currentAr: 5000,
      diaryCode: '117',
      debtHistory: null,
    };
    const fakeStore = createFakeStore();
    const wrapper = render(
      <Provider store={fakeStore}>
        <BrowserRouter>
          <DebtDetailsCard debt={debt} />
        </BrowserRouter>
      </Provider>,
    );

    // Component should still render, just with empty date
    expect(wrapper.html()).to.exist;
    // Check if the component renders without crashing
    expect(wrapper.find('h2').length).to.be.at.least(1);
  });

  it('should handle debt with empty debtHistory array', () => {
    const debt = {
      compositeDebtId: '441300',
      currentAr: 5000,
      diaryCode: '117',
      debtHistory: [],
    };
    const fakeStore = createFakeStore();
    const wrapper = render(
      <Provider store={fakeStore}>
        <BrowserRouter>
          <DebtDetailsCard debt={debt} />
        </BrowserRouter>
      </Provider>,
    );

    // Component should still render, just with empty date
    expect(wrapper.html()).to.exist;
    // Check if the component renders without crashing
    expect(wrapper.find('h2').length).to.be.at.least(1);
  });

  it('should handle debt with invalid date in debtHistory', () => {
    const debt = {
      compositeDebtId: '441300',
      currentAr: 5000,
      diaryCode: '117',
      debtHistory: [
        {
          date: 'invalid-date',
          letterCode: '100',
        },
      ],
    };
    const fakeStore = createFakeStore();
    const wrapper = render(
      <Provider store={fakeStore}>
        <BrowserRouter>
          <DebtDetailsCard debt={debt} />
        </BrowserRouter>
      </Provider>,
    );

    // Component should still render, just with empty date
    expect(wrapper.html()).to.exist;
    // Check if the component renders without crashing
    expect(wrapper.find('h2').length).to.be.at.least(1);
  });

  it('should render for multiple diary codes', () => {
    const diaryCodes = ['680', '117', '123', '449', '450', '453', '456', '458'];

    diaryCodes.forEach(diaryCode => {
      const debt = {
        compositeDebtId: '441300',
        currentAr: 5000,
        diaryCode,
        debtHistory: [
          {
            date: '2023-01-01',
            letterCode: '100',
          },
        ],
      };
      const fakeStore = createFakeStore();
      const wrapper = render(
        <Provider store={fakeStore}>
          <BrowserRouter>
            <DebtDetailsCard debt={debt} />
          </BrowserRouter>
        </Provider>,
      );

      // Check that component renders for each diary code
      expect(wrapper.html()).to.exist;
    });
  });

  it('should handle debt with zero currentAr', () => {
    const debt = {
      compositeDebtId: '441300',
      currentAr: 0,
      diaryCode: '117',
      debtHistory: [
        {
          date: '2023-01-01',
          letterCode: '100',
        },
      ],
    };
    const fakeStore = createFakeStore();
    const wrapper = render(
      <Provider store={fakeStore}>
        <BrowserRouter>
          <DebtDetailsCard debt={debt} />
        </BrowserRouter>
      </Provider>,
    );

    expect(wrapper.html()).to.exist;
    expect(wrapper.text()).to.include('$0.00');
  });

  it('should display correct links based on debtCardContent configuration', () => {
    const debtWithLinks = {
      compositeDebtId: '441300',
      currentAr: 5000,
      diaryCode: '117',
      debtHistory: [
        {
          date: '2023-01-01',
          letterCode: '100',
        },
      ],
    };

    const debtWithoutLinks = {
      compositeDebtId: '441301',
      currentAr: 0,
      diaryCode: '481', // This diary code has no links
      debtHistory: [
        {
          date: '2023-01-01',
          letterCode: '914',
        },
      ],
    };

    const fakeStore = createFakeStore();

    const wrapperWithLinks = render(
      <Provider store={fakeStore}>
        <BrowserRouter>
          <DebtDetailsCard debt={debtWithLinks} />
        </BrowserRouter>
      </Provider>,
    );

    const wrapperWithoutLinks = render(
      <Provider store={fakeStore}>
        <BrowserRouter>
          <DebtDetailsCard debt={debtWithoutLinks} />
        </BrowserRouter>
      </Provider>,
    );

    expect(wrapperWithLinks.find('va-link-action').length).to.be.greaterThan(0);
    expect(wrapperWithoutLinks.find('va-link-action')).to.have.lengthOf(0);
  });

  it('should handle multiple debts with different configurations', () => {
    const debts = [
      {
        compositeDebtId: '441300',
        currentAr: 5000,
        diaryCode: '117',
        debtHistory: [{ date: '2023-01-01', letterCode: '100' }],
      },
      {
        compositeDebtId: '441301',
        currentAr: 0,
        diaryCode: '680',
        debtHistory: null,
      },
      {
        compositeDebtId: '441302',
        currentAr: 10000,
        diaryCode: '680',
        debtHistory: [],
      },
    ];

    debts.forEach(debt => {
      const fakeStore = createFakeStore();
      const wrapper = render(
        <Provider store={fakeStore}>
          <BrowserRouter>
            <DebtDetailsCard debt={debt} />
          </BrowserRouter>
        </Provider>,
      );

      expect(wrapper.html()).to.exist;
    });
  });

  it('should render debt with diary code 100', () => {
    const debt = {
      compositeDebtId: '441300',
      currentAr: 5000,
      diaryCode: '100',
      debtHistory: [
        {
          date: '2023-01-01',
          letterCode: '100',
        },
      ],
    };
    const fakeStore = createFakeStore();
    const wrapper = render(
      <Provider store={fakeStore}>
        <BrowserRouter>
          <DebtDetailsCard debt={debt} />
        </BrowserRouter>
      </Provider>,
    );

    expect(wrapper.html()).to.exist;
    expect(wrapper.text()).to.include('balance now or request help');
  });

  it('should render debt with diary code 600 for payment plan', () => {
    const debt = {
      compositeDebtId: '441300',
      currentAr: 5000,
      diaryCode: '600',
      debtHistory: [
        {
          date: '2023-01-01',
          letterCode: '600',
        },
      ],
    };
    const fakeStore = createFakeStore();
    const wrapper = render(
      <Provider store={fakeStore}>
        <BrowserRouter>
          <DebtDetailsCard debt={debt} />
        </BrowserRouter>
      </Provider>,
    );

    expect(wrapper.html()).to.exist;
    expect(wrapper.text()).to.include('Continue making monthly payments');
  });

  it('should render debt with treasury referral diary code 080', () => {
    const debt = {
      compositeDebtId: '441300',
      currentAr: 5000,
      diaryCode: '080',
      debtHistory: [
        {
          date: '2023-01-01',
          letterCode: '080',
        },
      ],
    };
    const fakeStore = createFakeStore();
    const wrapper = render(
      <Provider store={fakeStore}>
        <BrowserRouter>
          <DebtDetailsCard debt={debt} />
        </BrowserRouter>
      </Provider>,
    );

    expect(wrapper.html()).to.exist;
    expect(wrapper.text()).to.include('Department of the Treasury');
  });
});
