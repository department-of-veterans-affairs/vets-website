import React from 'react';
import { shallow } from 'enzyme';
import { expect } from 'chai';
import { AppealInfo } from '../../../../src/js/claims-status/containers/AppealInfo';

const appealIdParam = '7387389';

const defaultProps = {
  params: { id: appealIdParam },
  route: { path: `${appealIdParam}` },
};

describe.only('<AppealInfo/>', () => {
  it('should render', () => {
    const wrapper = shallow(<AppealInfo {...defaultProps}/>);
    expect(wrapper.type()).to.equal('div');
  });

  it('should display a tabbed navigator', () => {
    const wrapper = shallow(<AppealInfo {...defaultProps}/>);
    const tabNavs = wrapper.find('AppealsV2TabNav');
    expect(tabNavs.length).to.equal(1);
  });

  it('should default to rendering status', () => {
    const wrapper = shallow(<AppealInfo {...defaultProps}/>);
    expect(wrapper.find('AppealsV2StatusPage').length).to.equal(1);
    expect(wrapper.find('AppealsV2DetailPage').length).to.equal(0);
  });

  it('should have access to the appeal id in route params', () => {
    window.history.pushState({}, '', `track-claims/appeals-v2/${appealIdParam}/status`);
    const wrapper = shallow(<AppealInfo {...defaultProps}/>);
    const appealId = wrapper.state('params.id');
    expect(appealId).to.equal(appealIdParam);
    window.history.back();
  });
});
