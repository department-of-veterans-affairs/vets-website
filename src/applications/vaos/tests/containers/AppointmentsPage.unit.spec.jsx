import React from 'react';
import { expect } from 'chai';
import sinon from 'sinon';
import { shallow, mount } from 'enzyme';

import { AppointmentsPage } from '../../containers/AppointmentsPage';

describe('VAOS <AppointmentsPage>', () => {
  it('document title should match h1 text', () => {
    const pageTitle = 'VA appointments';
    const tree = shallow(<AppointmentsPage />);
    expect(tree.find('h1').text()).to.equal(pageTitle);
    expect(document.title).contain(pageTitle);
    tree.unmount();
  });

  it('should focus if modal is dismissed', () => {
    const defaultProps = {
      isWelcomeModalDismissed: false,
    };

    const div = document.createElement('div');
    document.body.appendChild(div);

    const tree = mount(<AppointmentsPage {...defaultProps} />, {
      attachTo: div,
    });

    expect(document.activeElement.nodeName).to.not.equal('H1');
    tree.setProps({ isWelcomeModalDismissed: true });
    expect(document.activeElement.nodeName).to.equal('H1');

    tree.unmount();
    div.remove();
  });

  it('should fire a GA event when clicking schedule new appointment button', () => {
    const startNewAppointmentFlow = sinon.spy();

    const tree = shallow(
      <AppointmentsPage
        showScheduleButton
        startNewAppointmentFlow={startNewAppointmentFlow}
      />,
    );

    tree
      .find('ScheduleNewAppointment')
      .props()
      .startNewAppointmentFlow();
    expect(global.window.dataLayer[0].event).to.equal(
      'vaos-schedule-appointment-button-clicked',
    );
    tree.unmount();
  });

  it('should render tabs if showPastAppointments is true', () => {
    const tree = shallow(
      <AppointmentsPage showScheduleButton showPastAppointments />,
    );

    expect(tree.find('withRouter(TabNav)').exists()).to.be.true;
    tree.unmount();
  });

  it('should not render tabs if showPastAppointments is false', () => {
    const tree = shallow(<AppointmentsPage showScheduleButton />);

    expect(tree.find('withRouter(TabNav)').exists()).to.be.false;
    tree.unmount();
  });
});
