import React from 'react';
import { shallow } from 'enzyme';
import { expect } from 'chai';
import Alerts from '../../../../src/js/claims-status/components/appeals-v2/Alerts';
import { mockData } from '../../../../src/js/claims-status/utils/helpers';

const defaultProps = {
  alerts: mockData.data[0].attributes.alerts
};

describe('<Alerts/>', () => {
  it('renders', () => {
    const wrapper = shallow(<Alerts {...defaultProps}/>);
    expect(wrapper.type()).to.equal('div');
  });

  it('should render all alerts', () => {
    const wrapper = shallow(<Alerts {...defaultProps}/>);
    const alertsList = wrapper.find('Alert');
    expect(alertsList.length).to.equal(defaultProps.alerts.length);
  });

  it('should return null if alerts prop missing', () => {
    const wrapper = shallow(<Alerts/>);
    expect(wrapper.type()).to.equal(null);
  });

  it('should return null if alerts array empty', () => {
    const props = { alerts: [] };
    const wrapper = shallow(<Alerts {...props}/>);
    expect(wrapper.type()).to.equal(null);
  });
});
