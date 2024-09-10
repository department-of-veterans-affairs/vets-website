// import { render } from '@testing-library/react';
// import { Provider } from 'react-redux';
// import configureStore from 'redux-mock-store';
// import React from 'react';
// import thunk from 'redux-thunk';
// import { App } from '../../../containers/App';
// import responses from '../../../testing/responses';
//
// const defaultProps = {
//   isLoggedIn: false,
//   children: {},
//   claimantInfo: {
//     ...responses['GET /meb_api/v0/claimant_info'],
//   },
//   eligibility: [],
//   featureTogglesLoaded: true,
//   firstName: '',
//   formData: {},
//   getDirectDeposit: () => {},
//   getEligibility: () => {},
//   getPersonalInfo: () => {},
//   isLOA3: true,
//   location: {},
//   setFormData: () => {},
// };
//
// describe('App', () => {
//   const middleware = [thunk];
//   const mockStore = configureStore(middleware);
//   const store = mockStore(defaultProps);
//
//   it('should render visitor state', () => {
//     const tree = render(
//       <Provider store={store}>
//         <App />
//       </Provider>,
//     );
//
//     console.log(tree);
//     tree.unmount();
//   });
// });
