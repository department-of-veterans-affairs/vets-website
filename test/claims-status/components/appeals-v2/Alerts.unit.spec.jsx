import React from 'react';
import { shallow } from 'enzyme';
import { expect } from 'chai';
import Alerts from '../../../../src/js/claims-status/components/appeals-v2/Alerts';

const defaultProps = {};

describe('<Alerts/>', () => {
  it('renders', () => {
    const wrapper = shallow(<Alerts/>);
    expect(wrapper.type).to.equal('div');
  });

  it('renders all alerts', () => {
    const wrapper = shallow(<Alerts {...defaultProps}/>);
  });
});
