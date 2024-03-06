// import React from 'react';
// import { Provider } from 'react-redux';
// import { render } from '@testing-library/react';
// import { expect } from 'chai';
// import IntroductionPage from '../../components/IntroductionPage';
//
// const store = {
//   getState: () => ({
//     user: {
//       login: {
//         currentlyLoggedIn: true,
//       },
//       profile: {
//         savedForms: [],
//         prefillsAvailable: [],
//       },
//     },
//     form: {
//       formId: '21P-530',
//       savedStatus: '',
//       loadedData: {
//         metadata: {},
//       },
//       data: {},
//       contestedIssues: {},
//     },
//     featureToggles: {
//       loading: false,
//       [`burials_form_enabled`]: true,
//     },
//   }),
//   subscribe: () => {},
//   dispatch: () => {},
// };
//
// const mockRoute = {
//   pageList: [
//     {
//       path: 'wrong-path',
//     },
//     {
//       path: 'testing',
//     },
//   ],
//   formConfig: {
//     prefillEnabled: false,
//     downtime: false,
//   },
// };
//
// describe('IntroductionPage', () => {
//   it('renders the IntroductionPage component', () => {
//     const { queryByText } = render(
//       <Provider store={store}>
//         <IntroductionPage
//           route={mockRoute}
//           location={{ basename: '/some-path' }}
//         />
//       </Provider>,
//     );
//     // console.log(screen.debug());
//
//     expect(queryByText('Apply for burial benefits')).to.exist;
//     expect(queryByText('Follow the steps below to apply for burial benefits.'))
//       .to.exist;
//   });
// });
