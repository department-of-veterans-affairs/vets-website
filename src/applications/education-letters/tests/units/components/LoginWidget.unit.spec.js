// import { expect } from 'chai';
// import React from 'react';
// import { shallow } from 'enzyme';
// import { Provider } from 'react-redux';
// import configureMockStore from 'redux-mock-store';
// import LoginWidget from '../../../components/LoginWidget';

// describe.skip('Render Sign up/ login UI', () => {
//   const mockStore = configureMockStore();
//   const initialState = {
//     toggleLoginModal: () => {},
//     user: {
//       login: {
//         currentlyLoggedIn: false,
//         hasCheckedKeepAlive: true,
//       },
//     },
//   };
//
//   it('should show h3 font sized header', () => {
//     const store = mockStore(initialState);
//     const wrapper = shallow(<LoginWidget {...initialState} />);
//
//     console.log(wrapper);
//     expect(wrapper).to.exist;
//
//     wrapper.unmount();
//   });

// it('should show sign in button', () => {
//   const store = mockStore({});
//   const wrapper = mount(
//     <Provider store={store}>
//       <LoginWidget />
//     </Provider>,
//   );
//
//   expect(wrapper.text()).to.include('Sign in or create an account');
//   expect(wrapper.text()).to.not.include('Login or create an account');
//
//   wrapper.unmount();
// });
// });
