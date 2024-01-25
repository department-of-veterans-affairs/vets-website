import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';

import ScorecardTags from '../../components/ScorecardTags';

describe('<ScorecardTags/>', () => {
  it('should render', () => {
    const wrapper = shallow(<ScorecardTags />);
    expect(wrapper.html()).to.not.be.undefined;
    wrapper.unmount();
  });
  it('should render Women Only', () => {
    const wrapper = shallow(<ScorecardTags womenOnly={1} />);
    expect(
      wrapper
        .find('div')
        .at(0)
        .text(),
    ).to.equal('Women Only');
    wrapper.unmount();
  });
  it('should render Men Only', () => {
    const wrapper = shallow(<ScorecardTags menOnly={1} />);
    expect(
      wrapper
        .find('div')
        .at(0)
        .text(),
    ).to.equal('Men Only');
    wrapper.unmount();
  });
  it('should render hbcu', () => {
    const wrapper = shallow(<ScorecardTags hbcu={1} />);
    expect(
      wrapper
        .find('div')
        .at(0)
        .text(),
    ).to.equal('Historically Black college or university');
    wrapper.unmount();
  });
  it('should render hbcu', () => {
    const wrapper = shallow(
      <ScorecardTags relAffil="Wisconsin Evangelical Lutheran Synodh" />,
    );
    expect(
      wrapper
        .find('div')
        .at(1)
        .text(),
    ).to.equal('');
    wrapper.unmount();
  });
});
