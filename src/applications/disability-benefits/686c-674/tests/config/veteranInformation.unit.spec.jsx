import React from 'react';
import { expect } from 'chai';
import { mount } from 'enzyme';
import { Provider } from 'react-redux';
import createCommonStore from 'platform/startup/store';
import VeteranInformationComponent from '../../config/chapters/veteran-information/veteran-information/VeteranInformationComponent.js';

const defaultStore = createCommonStore();

const mockUser = {
  gender: 'M',
  dob: '1975-11-26',
  userFullName: {
    first: 'JAIME',
    last: 'BROOKS',
  },
};

describe('<VeteranInformationComponent />', () => {
  it('Should Render', () => {
    const wrapper = mount(
      <Provider store={defaultStore}>
        <VeteranInformationComponent user={mockUser} />
      </Provider>,
    );

    expect(wrapper.find('div.usa-alert-info')).to.exist;
    wrapper.unmount();
  });
});
