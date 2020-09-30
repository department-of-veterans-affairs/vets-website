import React from 'react';
import { shallow } from 'enzyme';
import { expect } from 'chai';
import DebtLettersSummary from '../components/DebtLettersSummary';

describe('DebtLettersSummary', () => {
  it('renders correct summary component', () => {
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
          isVBMSError: false,
          isError: false,
          debts: [],
        },
      }),
      subscribe: () => {},
      dispatch: () => {},
    };
    const wrapper = shallow(<DebtLettersSummary store={fakeStore} />);
    expect(wrapper.length).to.equal(1);
    wrapper.unmount();
  });
});
