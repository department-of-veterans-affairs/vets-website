import React from 'react';
import { expect } from 'chai';
import { Provider } from 'react-redux';
import { render } from '@testing-library/react';
import TransitionContainer from 'applications/mhv-inherited-proofing/container/TransitionContainer';

// platform
import createCommonStore from 'platform/startup/store';

describe('TransitionContainer', () => {
  const createStore = () => {
    return createCommonStore({
      isLoggedIn: true,
    });
  };

  it('should render', () => {
    const store = createStore();

    const tree = render(
      <Provider store={store}>
        <TransitionContainer />
      </Provider>,
    );

    expect(tree.findAllByAltText('transfer-account')).to.not.be.null;

    tree.unmount();
  });
});
