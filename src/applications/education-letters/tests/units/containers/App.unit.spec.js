import { expect } from 'chai';
import React from 'react';
import { mount } from 'enzyme';
import { Provider } from 'react-redux';
import configureMockStore from 'redux-mock-store';
import App from '../../../containers/App';

describe('Render Education Letters landing page', () => {
  const mockStore = configureMockStore();

  it('should render FormTitle and intro', () => {
    const store = mockStore({});
    const wrapper = mount(
      <Provider store={store}>
        <App />
      </Provider>,
    );

    expect(wrapper.text()).to.include('Download your VA education letter');
    expect(wrapper.text()).to.include(
      'If you’re a Veteran and you recently received your VA education decision letter, you can download it now',
    );
    wrapper.unmount();
  });

  it('should render the VA alert', () => {
    const store = mockStore({});
    const wrapper = mount(
      <Provider store={store}>
        <App />
      </Provider>,
    );

    expect(wrapper.text()).to.include(
      'You’ll have access to other types of education letters here in the',
    );

    expect(wrapper.text()).to.include(
      'Right now you can only download your education decision letter.',
    );
    wrapper.unmount();
  });
});
