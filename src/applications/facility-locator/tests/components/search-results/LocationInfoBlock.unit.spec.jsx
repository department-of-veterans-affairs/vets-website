import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';
import LocationInfoBlock from '../../../components/search-results-items/common/LocationInfoBlock';
import { LocationType } from '../../../constants';

describe('LocationInfoBlock', () => {
  it('should render a link to regular VA facility detail page', () => {
    const vaProviderLocation = {
      id: 'vha_558GF',
      attributes: {},
    };

    const wrapper = shallow(
      <LocationInfoBlock location={vaProviderLocation} />,
    );
    expect(wrapper.find('Link[to="facility/vha_558GF"]').length).to.equal(1);
    wrapper.unmount();
  });

  it('should NOT render a link to CCP detail page', () => {
    const ccpProviderLocation = {
      id: 'vha_558GF',
      type: LocationType.CC_PROVIDER,
      attributes: {},
    };

    const wrapper = shallow(
      <LocationInfoBlock location={ccpProviderLocation} query={{}} />,
    );
    expect(wrapper.find('Link[to="facility/vha_558GF"]').length).to.equal(0);
    wrapper.unmount();
  });
});
