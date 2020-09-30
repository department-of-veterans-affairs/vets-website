import React from 'react';
import { shallow } from 'enzyme';
import { expect } from 'chai';
import DebtLettersSummary from '../components/DebtLettersSummary';

describe('DebtLettersSummary', () => {
  it('renders summary component', () => {
    const fakeStore = {
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
    const wrapper = shallow(<DebtLettersSummary store={fakeStore} />);
    expect(wrapper.dive().find(`Connect(DebtLettersSummary)`).length).to.equal(
      0,
    );
    wrapper.unmount();
  });
});
