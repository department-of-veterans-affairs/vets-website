import { expect } from 'chai';
import React from 'react';
import { mount } from 'enzyme';
import { Provider } from 'react-redux';
import configureMockStore from 'redux-mock-store';
import Layout from '../../../components/Layout';

describe('Render layout breadcrumbs', () => {
  const mockStore = configureMockStore();

  it('Layout should contain breadcrumbs', async () => {
    const store = mockStore({});
    const wrapper = mount(
      <Provider store={store}>
        <Layout />
      </Provider>,
    );

    expect(wrapper.text()).to.include('Education and training');
    wrapper.unmount();
  });
});
