import React from 'react';
import { expect } from 'chai';
import { mount } from 'enzyme';

import BreadCrumbs from '../../../components/bread-crumbs/BreadCrumbs';

import { createFakeStopCodeStore } from '../utils/createFakeStores';

describe('health care questionnaire - bread crumbs -', () => {
  it('displays with appointment data', () => {
    const fakeStore = createFakeStopCodeStore();
    const wrapper = mount(<BreadCrumbs store={fakeStore} />);
    expect(
      wrapper.find('[data-testid="current-location-text"]').text(),
    ).to.equal('Answer primary care questionnaire');
    wrapper.unmount();
  });
  it('displays with out appointment data', () => {
    const fakeStore = createFakeStopCodeStore(null);
    const wrapper = mount(<BreadCrumbs store={fakeStore} />);
    expect(
      wrapper.find('[data-testid="current-location-text"]').text(),
    ).to.equal('Answer health questionnaire');
    wrapper.unmount();
  });
});
