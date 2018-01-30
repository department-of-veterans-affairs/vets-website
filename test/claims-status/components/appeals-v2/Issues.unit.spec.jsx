import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';
import Issues from '../../../../src/js/claims-status/components/appeals-v2/Issues';

describe.only('<Issues/>', () => {
  it('should render', () => {
    const wrapper = shallow(<Issues/>);
    expect(wrapper.type()).to.equal('div');
  });

  it('should render two collapsible panels', () => {
    const wrapper = shallow(<Issues/>);
    expect(wrapper.find('CollapsiblePanel').length).to.equal(2);
  });

});
