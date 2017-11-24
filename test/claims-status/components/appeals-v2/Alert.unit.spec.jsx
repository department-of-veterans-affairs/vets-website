import React from 'react';
import { shallow } from 'enzyme';
import { expect } from 'chai';
import Alert from '../../../../src/js/claims-status/components/appeals-v2/Alert';

describe('<Alert/>', () => {
  it('should render', () => {
    const wrapper = shallow(<Alert/>);
    expect(wrapper.type()).to.equal('li');
  });
});
