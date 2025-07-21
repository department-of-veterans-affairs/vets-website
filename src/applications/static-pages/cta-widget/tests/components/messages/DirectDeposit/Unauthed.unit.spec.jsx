import React from 'react';
import sinon from 'sinon';
import userEvent from '@testing-library/user-event';
import { expect } from 'chai';
import { render } from '@testing-library/react';
import { Provider } from 'react-redux';
import Unauthed from '../../../../components/messages/DirectDeposit/Unauthed';

describe('Unauthed', () => {
  it('should dispatch on button click', () => {
    const mockStore = {
      dispatch: sinon.spy(),
      getState: () => ({}),
      subscribe: () => {},
    };
    const { container } = render(
      <Provider store={mockStore}>
        <Unauthed />
      </Provider>,
    );
    const button = container.querySelector('va-button');
    expect(button).to.exist;
    userEvent.click(button);
    expect(mockStore.dispatch.calledOnce).to.be.true;
  });
});
