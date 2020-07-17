import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';
import sinon from 'sinon';

import ScheduleNewAppointment from '../../components/ScheduleNewAppointment';

describe('VAOS <ScheduleNewAppointment>', () => {
  it('should render schedule button', () => {
    const startNewAppointmentFlow = sinon.spy();

    const tree = shallow(
      <ScheduleNewAppointment
        startNewAppointmentFlow={startNewAppointmentFlow}
      />,
    );

    expect(tree.find('h2').text()).to.equal('Create a new appointment');
    expect(tree.find('Link').props().to).to.contain('new-appointment');
    expect(tree.text()).not.to.contain('Community Care');
    expect(tree.text()).to.contain('Send a request');

    tree
      .find('Link')
      .props()
      .onClick();

    expect(startNewAppointmentFlow.called).to.be.true;
    tree.unmount();
  });

  it('should render CC message', () => {
    const tree = shallow(<ScheduleNewAppointment showCommunityCare />);

    expect(tree.find('h2').text()).to.equal('Create a new appointment');
    expect(tree.find('Link').props().to).to.contain('new-appointment');
    expect(tree.text()).to.contain('Community Care');
    expect(tree.text()).to.contain('Send a request');
    tree.unmount();
  });

  it('should render DS message', () => {
    const tree = shallow(<ScheduleNewAppointment showDirectScheduling />);

    expect(tree.find('h2').text()).to.equal('Create a new appointment');
    expect(tree.find('Link').props().to).to.contain('new-appointment');
    expect(tree.text()).not.to.contain('Community Care');
    expect(tree.text()).not.to.contain('Send a request');
    tree.unmount();
  });

  it('should render CC and DS message', () => {
    const tree = shallow(
      <ScheduleNewAppointment showCommunityCare showDirectScheduling />,
    );

    expect(tree.find('h2').text()).to.equal('Create a new appointment');
    expect(tree.find('Link').props().to).to.contain('new-appointment');
    expect(tree.text()).to.contain('Community Care');
    expect(tree.text()).not.to.contain('Send a request');
    tree.unmount();
  });

  it('should render Cerner portal button', () => {
    const tree = shallow(<ScheduleNewAppointment isCernerOnlyPatient />);

    expect(tree.find('h2').text()).to.equal('Need to schedule an appointment?');
    expect(tree.find('a').props().href).to.contain('patientportal');
    expect(tree.find('Link').exists()).to.be.false;
    tree.unmount();
  });
});
