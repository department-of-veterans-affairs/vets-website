import React from 'react';
import { expect } from 'chai';
import { Provider } from 'react-redux';
import thunk from 'redux-thunk';
import configureStore from 'redux-mock-store';
import { render } from '@testing-library/react';
import ConfirmationPage from '../../../containers/ConfirmationPage';
import responses from '../../../testing/responses';

const defaultProps = {
  login: {
    currentlyLoggedIn: true,
  },
  ...responses['GET /v0/user'].data.attributes,
  claimStatus: {
    receivedDate: '2022-03-11',
    claimStatus: 'ELIGIBLE',
  },
  getClaimStatus: () => {},
  userFullName: { first: 'Hector', middle: 'J', last: 'Allen' },
};

describe('Confirmation Page', () => {
  const middleware = [thunk];
  const mockStore = configureStore(middleware);
  const store = mockStore(defaultProps);

  it('should render the confirmation page', () => {
    const tree = render(
      <Provider store={store}>
        <ConfirmationPage />
      </Provider>,
    );
    expect(tree.container.querySelector('.meb-confirmation-page')).to.exist;
    tree.unmount();
  });
});

// it('should render logged in users confirmation page', async () => {
//   const screen = renderWithStoreAndRouter(<ConfirmationPage />, {
//     defaultProps,
//     reducers: reducer,
//     path: '/education/apply-for-gi-bill-form-22-1990/confirmation',
//   });
//   console.log(await screen.findByText('Loading your results'));
// });
//
// it('should render logged in users confirmation page', async () => {
//   const tree = render(
//     <Provider store={store}>
//       <ConfirmationPage />
//     </Provider>,
//   );
//
//   expect(tree.container.querySelector('.meb-confirmation-page')).to.exist;
//   tree.unmount();
// });
//
//
// test('should render logged in users confirmation page', async () => {
//   console.log(await screen.findByText(/Hector/i));
//   expect(await screen.findByText(/Hector/i)).toBeInTheDocument();
// });
