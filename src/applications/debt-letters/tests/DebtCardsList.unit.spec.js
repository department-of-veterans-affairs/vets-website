import React from 'react';
import { shallow } from 'enzyme';
import { expect } from 'chai';
import DebtLettersSummary from '../components/DebtLettersSummary';
import DebtCardsList from '../components/DebtCardsList';
import mockData from '../tests/e2e/fixtures/mocks/debts.json';

describe('DebtCardsList', () => {
  const fakeStore = {
    getState: () => ({
      user: {
        login: {
          currentlyLoggedIn: true,
        },
      },
      debtLetters: {
        isFetching: false,
        isError: false,
        isVBMSError: false,
        debts: [...mockData.debts],
      },
    }),
    subscribe: () => {},
    dispatch: () => {},
  };

  it('mounts wrapper component', () => {
    const wrapper = shallow(<DebtCardsList store={fakeStore} />);
    expect(wrapper.length).to.equal(1);
    wrapper.unmount();
  });

  it('renders correct number of debt cards', () => {
    const wrapper = shallow(<DebtCardsList store={fakeStore} />);
    expect(
      wrapper
        .dive()
        .dive()
        .find(`Connect(DebtLetterCard)`).length,
    ).to.equal(8);
    wrapper.unmount();
  });

  it('renders correct empty state', () => {
    const fakeStoreEmptyState = {
      getState: () => ({
        user: {
          login: {
            currentlyLoggedIn: true,
          },
        },
        debtLetters: {
          pending: false,
          pendingVBMS: false,
          isVBMSError: false,
          isError: false,
          debts: [],
        },
      }),
      subscribe: () => {},
      dispatch: () => {},
    };
    const wrapper = shallow(<DebtLettersSummary store={fakeStoreEmptyState} />);
    expect(wrapper.dive().find(`Connect(DebtLetterCard)`).length).to.equal(0);
    expect(
      wrapper
        .dive()
        .dive()
        .find(`RenderDebtCards`)
        .dive()
        .find(`EmptyItemsAlert`)
        .dive()
        .find('h2')
        .at(0)
        .text(),
    ).to.equal('Our records show that you don’t have any current debts');
    wrapper.unmount();
  });
});
