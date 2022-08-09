import React from 'react';
import { expect } from 'chai';
import { mount } from 'enzyme';

import GetHelpFooter from '../GetHelpFooter';

import { createFakeFooterStore } from './utils';

describe('health care questionnaire - get help footer  -', () => {
  it('displays clinic information', () => {
    const fakeStore = createFakeFooterStore({
      name: 'Magic Kingdom',
      phone: '1231231234',
    });
    const wrapper = mount(<GetHelpFooter store={fakeStore} />);
    expect(wrapper.find('[data-testid="clinic-details"]').text()).to.contains(
      'Magic Kingdom',
    );
    expect(wrapper.find('a').exists()).to.be.true;

    wrapper.unmount();
  });
  it('displays facility information', () => {
    const fakeStore = createFakeFooterStore(
      {},
      {
        name: 'Magic Kingdom',
        phone: '12d31231234',
      },
    );
    const wrapper = mount(<GetHelpFooter store={fakeStore} />);
    expect(wrapper.find('[data-testid="facility-details"]').text()).to.contains(
      'Magic Kingdom',
    );
    expect(wrapper.find('a').exists()).to.be.true;

    wrapper.unmount();
  });
  it('only facility id is found', () => {
    const fakeStore = createFakeFooterStore(
      {},
      {
        identifier: [
          {
            system:
              'https://platform-api.va.gov/services/fhir/v0/r4/NamingSystem/va-facility-identifier',
            value: '1234',
          },
        ],
      },
    );
    const wrapper = mount(<GetHelpFooter store={fakeStore} />);
    expect(
      wrapper.find('[data-testid="default-details-with-id"]').text(),
    ).to.contains('Contact your VA provider');
    expect(wrapper.find('a').exists()).to.be.true;

    wrapper.unmount();
  });
  it('default contact message', () => {
    const fakeStore = createFakeFooterStore();
    const wrapper = mount(<GetHelpFooter store={fakeStore} />);
    expect(wrapper.find('[data-testid="default-details"]').text()).to.contains(
      'Contact your VA provider',
    );
    expect(wrapper.find('a').exists()).to.be.true;

    wrapper.unmount();
  });
});
