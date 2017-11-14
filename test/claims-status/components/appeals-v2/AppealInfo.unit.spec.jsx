import React from 'react';
import { shallow } from 'enzyme';
import { expect } from 'chai';
import { AppealInfo } from '../../../../src/js/claims-status/containers/AppealInfo';

describe('<AppealInfo/>', () => {
  it('should render', () => {
    const wrapper = shallow(<AppealInfo/>);
    expect(wrapper.type()).to.equal('div');
  });

  it('should display one tabbed navigator', () => {
    const wrapper = shallow(<AppealInfo/>);
    const tabNavs = wrapper.find('AppealsV2TabNav');
    expect(tabNavs.length).to.equal(1);
  });

  it('should default to rendering status', () => {});

  it('should have access to the route', () => {});
});
