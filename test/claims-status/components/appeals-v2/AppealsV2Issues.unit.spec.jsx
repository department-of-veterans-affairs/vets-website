import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';
import Issues from '../../../../src/js/claims-status/containers/AppealsV2Issues';

describe('<Issues/>', () => {
  it('should render', () => {
    const wrapper = shallow(<Issues/>);
    expect(wrapper.type()).to.equal('div');
  });
});
