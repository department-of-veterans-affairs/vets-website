/* eslint-disable camelcase */
import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';
import _LoginContainer from 'platform/user/authentication/components/LoginContainer';
import { Provider } from 'redux';
import configureMockStore from 'redux-mock-store';

const mockStoreConfig = configureMockStore();
const store = mockStoreConfig({
  featureToggles: {
    ssoe: true,
    login_gov_enabled: false,
    login_gov_create_account: false,
    login_gov_mhv: false,
    login_gov_myvahealth: false,
  },
});
const LoginContainer = _LoginContainer.WrappedComponent;
// const getData = ({
//   isUnifiedSignIn,
//   loggedOut,
//   isSSOe,
//   loginGovEnabled,
//   loginGovCreate,
//   loginGovMHV,
//   loginGovCerner,
// } = {}) => ({
//   mockStore: {
//     getState: () => ({
//       featureToggles: {
//         ssoe: isSSOe ?? true,
//         login_gov_enabled: loginGovEnabled ?? false,
//         login_gov_create_account: loginGovCreate ?? false,
//         login_gov_mhv: loginGovMHV ?? false,
//         login_gov_myvahealth: loginGovCerner ?? false,
//       },
//     }),
//   },
//   props: {
//     isUnifiedSignIn: isUnifiedSignIn ?? false,
//     loggedOut: loggedOut ?? false,
//   },
//   subscribe: () => {},
//   dispatch: () => {},
// });

describe('LoginContainer', () => {
  it('should render', () => {
    const wrapper = shallow(
      <Provider store={store}>
        <LoginContainer />
      </Provider>,
    );
    expect(wrapper.exists()).to.be.true;
    expect(wrapper.find('img').exists()).to.be.true;
    wrapper.unmount();
  });
});

describe('mapStateToProps', () => {
  // const store = {
  //   state: {
  //     featureFlags: {
  //       ssoe: false,
  //       login_gov: false,
  //       login_gov_create_account: false,
  //       login_gov_mhv: false,
  //       login_gov_myvahealth: false,
  //     },
  //   },
  // };
  // describe('useSSOe', () => {
  //   it('should be true if user is signed in with SSOe', () => {
  //     expect(mapStateToProps(store).useSSOe).to.be.false;
  //   });
  // });
  // describe('loginGovEnabled', () => {
  //   it('should conditionally be set based on feature toggles', () => {});
  // });
  // describe('loginGovMHVEnabled', () => {
  //   it('should conditionally be set based on feature toggles', () => {});
  // });
  // describe('loginGovMyVAHealthEnabled', () => {
  //   it('should conditionally be set based on feature toggles', () => {});
  // });
  // describe('loginGovCreateAccountEnabled', () => {
  //   it('should conditionally be set based on feature toggles', () => {});
  // });
});
