import React from 'react';

import { expect } from 'chai';
import { mount } from 'enzyme';
import configureMockStore from 'redux-mock-store';
import { Provider } from 'react-redux';
import { cleanup } from '@testing-library/react';
import ConfirmationPage from '../../../containers/ConfirmationPage';

describe('ConfirmationPage', () => {
  let wrapper;
  let store;
  const mockStore = configureMockStore();
  const initialState = {
    form: {
      data: {
        fullName: {
          first: 'John',
          middle: '',
          last: 'Preparer',
        },
      },
      submission: {
        response: {
          confirmationNumber: '1234567890',
        },
        timestamp: '2022-01-01T00:00:00Z',
      },
    },
  };

  beforeEach(() => {
    store = mockStore(initialState);
    wrapper = mount(
      <Provider store={store}>
        <ConfirmationPage />
      </Provider>,
    );
  });

  afterEach(() => {
    wrapper.unmount();
    cleanup();
  });

  it('passes the correct props to ConfirmationPageView', () => {
    const confirmationPageViewProps = wrapper
      .find('ConfirmationPageView')
      .props();

    expect(confirmationPageViewProps.formType).to.equal('submission');
    expect(confirmationPageViewProps.submitterHeader).to.equal(
      'Who submitted this form',
    );
    expect(confirmationPageViewProps.submitterName).to.deep.equal({
      first: 'John',
      middle: '',
      last: 'Preparer',
    });
    expect(confirmationPageViewProps.submitDate).to.equal(
      '2022-01-01T00:00:00Z',
    );
    expect(confirmationPageViewProps.confirmationNumber).to.equal('1234567890');
    expect(confirmationPageViewProps.content).to.deep.equal({
      headlineText: 'You’ve submitted your personal records request',
      nextStepsText:
        'After we review your request, we’ll contact you to tell you what happens next in the request process.',
    });
  });
});
