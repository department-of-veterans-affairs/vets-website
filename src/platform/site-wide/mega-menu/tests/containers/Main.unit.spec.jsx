import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';

import { Main } from '../../containers/Main';


describe('<Main>', () => {
  it('should render', () => {
    const sectionTitles = ['Health and Benefits', 'About VA', 'Find a VA Location'];
    const wrapper = shallow(<Main/>);

    expect(wrapper.find('Connect(Component)').length).to.equal(3);
    expect(wrapper.find('.login-container').exists()).to.be.true;

    wrapper.find('Connect(Component)').forEach((component, i) => {
      expect(component.props().title).to.equal(sectionTitles[i]);
    });
  });
});
