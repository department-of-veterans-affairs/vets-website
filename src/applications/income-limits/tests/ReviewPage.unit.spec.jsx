import React from 'react';
import { Provider } from 'react-redux';
import { render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { expect } from 'chai';
import sinon from 'sinon';

import ReviewPage from '../containers/ReviewPage';

describe('Review Page', () => {
  const pushSpy = sinon.spy();

  const mockStore = {
    getState: () => ({
      incomeLimits: {
        editMode: false,
        form: {
          dependents: '2',
          zipCode: '10108',
        },
      },
    }),
    subscribe: () => {},
    dispatch: () => {},
  };

  it('should correctly render the review page', () => {
    const props = {
      dependentsInput: '2',
      editMode: false,
      router: {
        push: pushSpy,
      },
      toggleEditMode: () => {},
      zipCodeInput: '10108',
    };

    const screen = render(
      <Provider store={mockStore}>
        <ReviewPage {...props} />
      </Provider>,
    );

    userEvent.click(screen.getAllByText('Edit')[0]);
    expect(pushSpy.called).to.be.true;
  });
});
