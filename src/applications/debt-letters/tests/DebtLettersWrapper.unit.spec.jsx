import React from 'react';
import { shallow, mount } from 'enzyme';
import { expect } from 'chai';
import DebtLettersWrapper from '../components/DebtLettersWrapper';
import CallToActionWidget from 'platform/site-wide/cta-widget';

describe('DebtLettersWrapper', () => {
  //   isLoggedIn: state.user.login.currentlyLoggedIn,
  //   isFetching: state.debtLetters.isFetching,
  //   debts: state.debtLetters.debts,
  //   isError: state.debtLetters.isError,
  it('mounts wrapper component', () => {
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
    const wrapper = shallow(<DebtLettersWrapper store={fakeStore} />);
    expect(wrapper.length).to.equal(1);
    wrapper.unmount();
  });
  it('renders CTA if user isnt logged in', () => {
    const fakeStore = {
      getState: () => ({
        user: {
          login: {
            currentlyLoggedIn: false,
          },
        },
        debtLetters: {
          isFetching: false,
          debts: [],
          isError: false,
        },
      }),
      subscribe: () => {},
      dispatch: () => {},
    };
    const wrapper = shallow(<DebtLettersWrapper store={fakeStore} />);
    expect(wrapper.dive().find('Connect(CallToActionWidget)').length).to.equal(
      1,
    );
    wrapper.unmount();
  });
  it('renders loading indicator if loading', () => {
    const fakeStore = {
      getState: () => ({
        user: {
          login: {
            currentlyLoggedIn: true,
          },
        },
        debtLetters: {
          isFetching: true,
          debts: [],
          isError: false,
        },
      }),
      subscribe: () => {},
      dispatch: () => {},
    };
    const wrapper = mount(<DebtLettersWrapper store={fakeStore} />);
    wrapper.unmount();
  });
});
