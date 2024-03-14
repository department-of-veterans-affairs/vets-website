import React from 'react';
import { expect } from 'chai';
import { act, waitFor } from '@testing-library/react';
import { mount } from 'enzyme';
import configureMockStore from 'redux-mock-store';
import { Provider } from 'react-redux';
import sinon from 'sinon';
import Alert from '../../components/Alert';

// Create a mock store
const mockStore = configureMockStore();
const store = mockStore({});

describe('<Alert />', () => {
  let clock;

  it('renders with status and message props', async () => {
    const wrapper = mount(
      <Provider store={store}>
        <Alert status="error" message="error message" />
      </Provider>,
    );
    await waitFor(() => {
      expect(wrapper.find(Alert).text()).to.include('error message');
      expect(wrapper.find(Alert).props().status).to.equal('error');

      wrapper.unmount();
    });
  });

  it('dispatches RESET_ERROR and RESET_SUCCESS_MESSAGE after 15 seconds', () => {
    clock = sinon.useFakeTimers({
      toFake: ['setTimeout', 'clearTimeout'],
    });
    const wrapper = mount(
      <Provider store={store}>
        <Alert status="info" message="Test message" />
      </Provider>,
    );

    act(() => {
      clock.tick(15000);
    });
    const actions = store.getActions();
    act(() => {
      expect(actions).to.deep.include({ type: 'RESET_ERROR' });
      expect(actions).to.deep.include({ type: 'RESET_SUCCESS_MESSAGE' });
      wrapper.unmount();
    });
  });
});
