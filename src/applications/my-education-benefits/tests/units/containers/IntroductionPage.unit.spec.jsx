// import { render } from '@testing-library/react';
// import { Provider } from 'react-redux';
// import { expect } from 'chai';
// import configureStore from 'redux-mock-store';
// import React from 'react';
// import thunk from 'redux-thunk';
// import { IntroductionPage } from '../../../containers/IntroductionPage';

// const defaultProps = {
//   featureTogglesLoaded: true,
//   route: '/education/apply-for-benefits-form-22-1990/introduction',
// };

// describe.skip('Introduction Page', () => {
//   const middleware = [thunk];
//   const mockStore = configureStore(middleware);
//   const store = mockStore(defaultProps);

//   it('should render visitor state', () => {
//     const tree = render(
//       <Provider store={store}>
//         <IntroductionPage />
//       </Provider>,
//     );

//     expect(tree.container.querySelector('.schemaform-intro p')).text(
//       'Equal to VA Form 22-1990 (Application for VA Education Benefits)',
//     );
//     // expect(tree.container.querySelector('.schemaform-intro p')).to.exist;
//     tree.unmount();
//   });
// });
