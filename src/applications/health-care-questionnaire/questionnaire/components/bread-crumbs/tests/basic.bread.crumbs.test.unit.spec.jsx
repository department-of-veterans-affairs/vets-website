import React from 'react';
import { expect } from 'chai';
import { mount } from 'enzyme';

import BreadCrumbs from '../../../components/bread-crumbs/BreadCrumbs';

import { createBreadCrumbStore } from './utils';
import sampleLocation from './sample.location.json';

describe('health care questionnaire - bread crumbs -', () => {
  it('displays with appointment data', () => {
    const fakeStore = createBreadCrumbStore(sampleLocation);
    const wrapper = mount(<BreadCrumbs store={fakeStore} />);
    expect(
      wrapper.find('[data-testid="current-location-text"]').text(),
    ).to.equal('Answer primary care questionnaire');
    wrapper.unmount();
  });
  it('displays with out appointment data', () => {
    const fakeStore = createBreadCrumbStore({});
    const wrapper = mount(<BreadCrumbs store={fakeStore} />);
    expect(
      wrapper.find('[data-testid="current-location-text"]').text(),
    ).to.equal('Answer health questionnaire');
    wrapper.unmount();
  });
});
