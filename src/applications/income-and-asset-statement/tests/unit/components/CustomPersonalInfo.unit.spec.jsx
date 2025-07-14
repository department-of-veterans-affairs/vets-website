import React from 'react';
import { mount } from 'enzyme';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import { expect } from 'chai';

import CustomPersonalInfo from '../../../components/CustomPersonalInfo';

describe('CustomPersonalInfo Component', () => {
  const middleware = [thunk];
  const mockStore = configureStore(middleware);

  it('renders PersonalInformation component', () => {
    const wrapper = mount(
      <Provider store={mockStore({})}>
        <CustomPersonalInfo
          data={{
            veteranSocialSecurityNumber: '1234',
            vaFileNumber: '5678',
          }}
        />
      </Provider>,
    );

    expect(wrapper.find('PersonalInformation')).to.have.lengthOf(1);
    wrapper.unmount();
  });
});
