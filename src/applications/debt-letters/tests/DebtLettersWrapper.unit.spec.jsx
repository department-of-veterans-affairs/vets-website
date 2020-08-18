import React from 'react';
import { shallow } from 'enzyme';
import { expect } from 'chai';
import DebtLettersWrapper from '../components/DebtLettersWrapper';

describe('DebtLettersWrapper', () => {
  it('mounts wrapper component', () => {
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
          debts: [],
        },
      }),
      subscribe: () => {},
      dispatch: () => {},
    };
    const wrapper = shallow(<DebtLettersWrapper store={fakeStore} />);
    expect(wrapper.length).to.equal(1);
    wrapper.unmount();
  });
});
