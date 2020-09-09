import React from 'react';
import { shallow } from 'enzyme';
import { expect } from 'chai';
import DebtLettersSummary from '../components/DebtLettersSummary';

describe('DebtLettersSummary', () => {
  it('renders correct summary component', () => {
    const fakeStoreV1 = {
      getState: () => ({
        featureToggles: {
          debtLettersShowLetters: true,
        },
        user: {
          login: {
            currentlyLoggedIn: true,
          },
        },
        debtLetters: {
          isFetching: false,
          isVBMSError: true,
          isError: true,
          debts: [],
        },
      }),
      subscribe: () => {},
      dispatch: () => {},
    };
    const wrapper = shallow(<DebtLettersSummary store={fakeStoreV1} />);
    expect(
      wrapper.dive().find(`Connect(DebtLettersSummaryV1)`).length,
    ).to.equal(1);
    expect(
      wrapper.dive().find(`Connect(DebtLettersSummaryV2)`).length,
    ).to.equal(0);
    wrapper.unmount();
  });

  it('renders correct summary component V2', () => {
    const fakeStoreV1 = {
      getState: () => ({
        featureToggles: {
          debtLettersShowLetters: true,
          debtLettersShowLettersV2: true,
        },
        user: {
          login: {
            currentlyLoggedIn: true,
          },
        },
        debtLetters: {
          isFetching: false,
          isVBMSError: true,
          isError: true,
          debts: [],
        },
      }),
      subscribe: () => {},
      dispatch: () => {},
    };
    const wrapper = shallow(<DebtLettersSummary store={fakeStoreV1} />);
    expect(
      wrapper.dive().find(`Connect(DebtLettersSummaryV1)`).length,
    ).to.equal(0);
    expect(
      wrapper.dive().find(`Connect(DebtLettersSummaryV2)`).length,
    ).to.equal(1);
    wrapper.unmount();
  });
});
