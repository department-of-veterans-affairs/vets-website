import React from 'react';
import { expect } from 'chai';
import { mount } from 'enzyme';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';

import DuplicateContactInfoModal from '../../components/DuplicateContactInfoModal';

const initialState = {
  form: {
    data: {
      email: {
        email: 'test@test.com',
      },
    },
  },
  data: {
    duplicateEmail: [{ dupe: true, acknowledged: undefined }],
    duplicatePhone: [],
    openModal: true,
  },
};

describe('DuplicateContactInfoModal', () => {
  const mockStore = configureStore();

  const store = mockStore(initialState);

  it('should render with data', () => {
    const wrapper = mount(
      <Provider store={store}>
        <DuplicateContactInfoModal />
      </Provider>,
    );

    expect(wrapper.text()).to.include('This will impact how we:');

    wrapper.unmount();
  });
});
