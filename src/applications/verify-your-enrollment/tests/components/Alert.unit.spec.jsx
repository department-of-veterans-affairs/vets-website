import React from 'react';
import { expect } from 'chai';
import { waitFor } from '@testing-library/react';
import { mount } from 'enzyme';
import configureMockStore from 'redux-mock-store';
import { Provider } from 'react-redux';
import Alert from '../../components/Alert';

// Create a mock store
const mockStore = configureMockStore();
const store = mockStore({});

describe('<Alert />', () => {
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
  it('should renders title props', async () => {
    const wrapper = mount(
      <Provider store={store}>
        <Alert
          status="warning"
          message="some warring message"
          title="some title"
        />
      </Provider>,
    );
    await waitFor(() => {
      expect(wrapper.find('h2').text()).to.equal('some title');
      wrapper.unmount();
    });
  });
});
