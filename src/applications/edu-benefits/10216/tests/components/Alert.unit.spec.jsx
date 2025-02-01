import { render } from '@testing-library/react';
import React from 'react';
import { expect } from 'chai';
import sinon from 'sinon';
import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import createCommonStore from '@department-of-veterans-affairs/platform-startup/store';
import { Provider } from 'react-redux';
import Alert from '../../components/Alert';

const defaultStore = createCommonStore();

describe('Alert', () => {
  const localStorageMock = {
    getItem: sinon.stub(),
    setItem: sinon.stub(),
    removeItem: sinon.stub(),
    clear: sinon.stub(),
  };
  global.localStorage = localStorageMock;
  it('renders without issues', () => {
    const { container } = render(
      <Provider store={defaultStore}>
        <Alert />{' '}
      </Provider>,
    );

    expect(container).to.exist;
    expect(container.querySelector('va-alert')).to.exist;
  });
  //   it('renders with a warning status', () => {
  //     const { container } = render(
  //       <Provider store={defaultStore}>
  //         <Alert />{' '}
  //       </Provider>,
  //     );
  //     expect(container.querySelector('va-alert').getAttribute('status')).to.equal(
  //       'warning',
  //     );
  //   });
  //   it('renders with an info status', () => {
  //     localStorage.setItem('isAccredited', 'true');
  //     const { container } = render(
  //       <Provider store={defaultStore}>
  //         <Alert />{' '}
  //       </Provider>,
  //     );
  //     expect(container.querySelector('va-alert').getAttribute('status')).to.equal(
  //       'info',
  //     );
  //   });
  //   it('renders with the correct headline', () => {
  //     localStorage.setItem('isAccredited', 'true');
  //     const { container } = render(
  //       <Provider store={defaultStore}>
  //         <Alert />{' '}
  //       </Provider>,
  //     );
  //     expect(container.querySelector('h2').textContent).to.equal(
  //       'Complete all submission steps',
  //     );
  //   });
  //   it('renders with the correct alert message when its not confirmation page', () => {
  //     localStorage.setItem('isAccredited', false);
  //     const { container } = render(
  //       <Provider
  //         store={mockStore({ navigation: { route: { path: '/somepath' } } })}
  //       >
  //         <Alert />{' '}
  //       </Provider>,
  //     );
  //     expect(container.querySelector('p').textContent).to.equal(
  //       `Your school facility code indicates the school is not accredited.
  //               In addition to completing VA Form 22-10216, you’ll also need to
  //               complete and submit VA Form 22-10215. You will be directed to that
  //               form after completing this one.`,
  //     );
  //   });
});
