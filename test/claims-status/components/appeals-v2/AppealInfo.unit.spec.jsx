import React from 'react';
import { shallow } from 'enzyme';
import { expect } from 'chai';
import { AppealInfo } from '../../../../src/js/claims-status/containers/AppealInfo';

describe.only('<AppealInfo/>', () => {
  it('should render', () => {
    const wrapper = shallow(<AppealInfo/>);
    expect(wrapper.type()).to.equal('div');
  });

  it('should display one tabbed navigator', () => {
    const wrapper = shallow(<AppealInfo/>);
    const tabNavs = wrapper.find('AppealsV2TabNav');
    expect(tabNavs.length).to.equal(1);
  });

  it('should default to rendering status', () => {
    const wrapper = shallow(<AppealInfo/>);
    // might need to set a route in the test first...
    expect(wrapper.find('AppealsV2StatusPage').length).to.equal(1);
    expect(wrapper.find('AppealsV2DetailPage').length).to.equal(0);

  });

  it('should have access to the route', () => {});
});
