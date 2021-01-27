import React from 'react';
import { expect } from 'chai';
import { mount } from 'enzyme';

import GetHelpFooter from '../../../components/get-help/GetHelpFooter';

import { createFakeFooterStore } from '../utils/createFakeStores';

describe('health care questionnaire - confirmation page  -', () => {
  it('displays clinic information', () => {
    const fakeStore = createFakeFooterStore(
      { phoneNumber: '1231231234' },
      'Magic Kingdom',
    );
    const wrapper = mount(<GetHelpFooter store={fakeStore} />);
    expect(wrapper.find('[data-testid="clinic-details"]').text()).to.contains(
      'Magic Kingdom',
    );
    expect(wrapper.find('a').exists()).to.be.true;

    wrapper.unmount();
  });
  it('displays facility information', () => {
    const fakeStore = createFakeFooterStore({
      facility: {
        displayName: 'Magic Kingdom',
        phoneNumber: '1231231234',
      },
    });
    const wrapper = mount(<GetHelpFooter store={fakeStore} />);
    expect(wrapper.find('[data-testid="facility-details"]').text()).to.contains(
      'Magic Kingdom',
    );
    expect(wrapper.find('a').exists()).to.be.true;

    wrapper.unmount();
  });
  it('displays default information', () => {
    const fakeStore = createFakeFooterStore();
    const wrapper = mount(<GetHelpFooter store={fakeStore} />);
    expect(wrapper.find('[data-testid="default-details"]').text()).to.contains(
      'Contact your VA provider',
    );
    expect(wrapper.find('a').exists()).to.be.true;

    wrapper.unmount();
  });
});
