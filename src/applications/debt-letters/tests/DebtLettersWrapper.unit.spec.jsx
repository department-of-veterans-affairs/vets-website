import React from 'react';
import { shallow } from 'enzyme';
import { expect } from 'chai';
import DebtLettersWrapper from '../components/DebtLettersWrapper';

describe('DebtLettersWrapper', () => {
  const fakeStore = {
    getState: () => ({
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
  it('mounts wrapper component', () => {
    const wrapper = shallow(<DebtLettersWrapper store={fakeStore} />);
    expect(wrapper.length).to.equal(1);
    wrapper.unmount();
  });
});
