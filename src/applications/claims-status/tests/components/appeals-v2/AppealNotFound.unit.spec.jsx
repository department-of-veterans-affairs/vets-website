import React from 'react';
import { shallow } from 'enzyme';
import { expect } from 'chai';
import AppealNotFound from '../../../components/appeals-v2/AppealNotFound';

describe('<AppealNotFound/>', () => {
  test('renders', () => {
    const wrapper = shallow(<AppealNotFound/>);
    expect(wrapper.type()).to.equal('div');
  });

  test('renders a heading', () => {
    const wrapper = shallow(<AppealNotFound/>);
    expect(wrapper.find('h1').length).to.equal(1);
  });

  test('renders a React Router link back to claims page', () => {
    const wrapper = shallow(<AppealNotFound/>);
    expect(wrapper.find('Link').length).to.equal(1);
  });
});
