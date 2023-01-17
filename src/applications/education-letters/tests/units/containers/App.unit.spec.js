import { expect } from 'chai';
import React from 'react';
import { mount } from 'enzyme';
import { Provider } from 'react-redux';
import configureMockStore from 'redux-mock-store';
import App from '../../../containers/App';

describe('Education Letters landing page', () => {
  const initialState = {
    user: {},
    toggleLoginModal: () => {},
  };

  const mockStore = configureMockStore();

  it('Render UI', () => {
    const store = mockStore({});
    const wrapper = mount(
      <Provider store={store}>
        <App {...initialState} />
      </Provider>,
    );

    expect(wrapper.text()).to.include('Download your VA education letter');

    expect(wrapper.text()).to.include(
      'If you’re a Veteran and you recently received your VA education decision letter, you can download it now',
    );

    wrapper.unmount();
  });
});
