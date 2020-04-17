import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';
import sinon from 'sinon';

import NoAppointments from '../../components/NoAppointments';

describe('VAOS <NoAppointments>', () => {
  it('should render without schedule button', () => {
    const tree = shallow(<NoAppointments />);

    expect(tree.find('h3').text()).to.equal('You don’t have any appointments');
    expect(tree.find('a').props().href).to.contain('find-locations');
    expect(tree.find('Link').exists()).to.be.false;
    tree.unmount();
  });

  it('should render schedule button', () => {
    const startNewAppointmentFlow = sinon.spy();

    const tree = shallow(
      <NoAppointments
        showScheduleButton
        startNewAppointmentFlow={startNewAppointmentFlow}
      />,
    );

    expect(
      tree
        .find('a')
        .at(0)
        .props().href,
    ).to.contain('find-locations');
    expect(tree.find('Link').props().to).to.contain('new-appointment');

    tree
      .find('Link')
      .props()
      .onClick();

    expect(startNewAppointmentFlow.called).to.be.true;
    tree.unmount();
  });

  it('should render Cerner portal button', () => {
    const tree = shallow(
      <NoAppointments showScheduleButton isCernerOnlyPatient />,
    );

    expect(
      tree
        .find('a')
        .at(0)
        .props().href,
    ).to.contain('patientportal');
    expect(tree.find('Link').exists()).to.be.false;
    tree.unmount();
  });
});
