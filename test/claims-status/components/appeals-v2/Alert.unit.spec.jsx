import React from 'react';
import { shallow } from 'enzyme';
import { expect } from 'chai';
import Alert from '../../../../src/js/claims-status/components/appeals-v2/Alert';

const defaultProps = {
  alert: {
    type: 'hearing-scheduled',
    date: '09-21-2017',
    details: {
      date: 'March th, 2018'
    }
  }
};

describe('<Alert/>', () => {
  it('should render', () => {
    const wrapper = shallow(<Alert {...defaultProps}/>);
    expect(wrapper.type()).to.equal('li');
  });
});
