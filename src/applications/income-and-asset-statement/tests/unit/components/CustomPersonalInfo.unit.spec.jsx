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

  it('renders PersonalInformation inside connected component', () => {
    const wrapper = mount(
      <Provider store={mockStore({})}>
        <CustomPersonalInfo
          formData={{
            claimantType: 'VETERAN',
          }}
          data={{
            veteranSocialSecurityNumber: '1234',
            vaFileNumber: '5678',
          }}
        />
      </Provider>,
    );

    expect(wrapper.find('PersonalInformation')).to.have.lengthOf(1);
    expect(wrapper.text()).to.include('We need more information');
    wrapper.unmount();
  });
});
