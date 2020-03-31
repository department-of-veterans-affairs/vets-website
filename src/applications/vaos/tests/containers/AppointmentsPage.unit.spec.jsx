import React from 'react';
import { expect } from 'chai';
import sinon from 'sinon';
import { shallow, mount } from 'enzyme';
import { FETCH_STATUS } from '../../utils/constants';

import { AppointmentsPage } from '../../containers/AppointmentsPage';

describe('VAOS <AppointmentsPage>', () => {
  it('should fetch future appointments', () => {
    const defaultProps = {
      appointments: {
        future: [],
        futureStatus: FETCH_STATUS.loading,
        facilityData: {},
      },
    };

    const fetchFutureAppointments = sinon.spy();
    const fetchPastAppointments = sinon.spy();

    const tree = shallow(
      <AppointmentsPage
        fetchFutureAppointments={fetchFutureAppointments}
        fetchPastAppointments={fetchPastAppointments}
        {...defaultProps}
      />,
    );
    expect(fetchFutureAppointments.called).to.be.true;
    expect(tree.find('FutureAppointmentsList').exists()).to.be.true;
    tree.unmount();
  });

  it('should render tabs if showPastAppointments is true', () => {
    const defaultProps = {
      appointments: {
        future: [],
        futureStatus: FETCH_STATUS.loading,
        facilityData: {},
      },
    };

    const fetchFutureAppointments = sinon.spy();
    const fetchPastAppointments = sinon.spy();

    const tree = shallow(
      <AppointmentsPage
        fetchFutureAppointments={fetchFutureAppointments}
        fetchPastAppointments={fetchPastAppointments}
        showPastAppointments
        {...defaultProps}
      />,
    );

    expect(tree.find('Tabs').exists()).to.be.true;
    expect(tree.find('Tab').length).to.equal(2);
    expect(tree.find('TabPanel').length).to.equal(2);
    tree.unmount();
  });

  it('should not render tabs if showPastAppointments is false', () => {
    const defaultProps = {
      appointments: {
        future: [],
        futureStatus: FETCH_STATUS.loading,
        facilityData: {},
      },
      location: { query: { view: 'past' } },
    };

    const fetchFutureAppointments = sinon.spy();
    const fetchPastAppointments = sinon.spy();

    const tree = shallow(
      <AppointmentsPage
        fetchFutureAppointments={fetchFutureAppointments}
        fetchPastAppointments={fetchPastAppointments}
        {...defaultProps}
      />,
    );

    expect(fetchFutureAppointments.called).to.be.true;
    expect(fetchPastAppointments.called).to.be.false;
    expect(tree.find('Tabs').exists()).to.be.false;
    tree.unmount();
  });

  it('document title should match h1 text', () => {
    const defaultProps = {
      appointments: {
        future: [],
        futureStatus: FETCH_STATUS.succeeded,
        facilityData: {},
      },
    };

    const fetchFutureAppointments = sinon.spy();
    const fetchPastAppointments = sinon.spy();

    const pageTitle = 'VA appointments';
    const tree = shallow(
      <AppointmentsPage
        fetchFutureAppointments={fetchFutureAppointments}
        fetchPastAppointments={fetchPastAppointments}
        {...defaultProps}
      />,
    );
    expect(tree.find('h1').text()).to.equal(pageTitle);
    expect(document.title).contain(pageTitle);
    tree.unmount();
  });

  it('should focus if modal is dismissed', () => {
    const defaultProps = {
      appointments: {
        future: [],
        futureStatus: FETCH_STATUS.succeeded,
        facilityData: {},
      },
      isWelcomeModalDismissed: false,
    };

    const fetchFutureAppointments = sinon.spy();
    const fetchPastAppointments = sinon.spy();
    const div = document.createElement('div');
    document.body.appendChild(div);

    const tree = mount(
      <AppointmentsPage
        fetchFutureAppointments={fetchFutureAppointments}
        fetchPastAppointments={fetchPastAppointments}
        {...defaultProps}
      />,
      {
        attachTo: div,
      },
    );

    expect(document.activeElement.nodeName).to.not.equal('H1');
    tree.setProps({ isWelcomeModalDismissed: true });
    expect(document.activeElement.nodeName).to.equal('H1');

    tree.unmount();
    div.remove();
  });

  it('should fire a GA event when clicking schedule new appointment button', () => {
    const defaultProps = {
      appointments: {
        future: [],
        futureStatus: FETCH_STATUS.succeeded,
        facilityData: {},
      },
    };

    const startNewAppointmentFlow = sinon.spy();
    const fetchFutureAppointments = sinon.spy();
    const fetchPastAppointments = sinon.spy();

    const tree = shallow(
      <AppointmentsPage
        {...defaultProps}
        showScheduleButton
        fetchFutureAppointments={fetchFutureAppointments}
        fetchPastAppointments={fetchPastAppointments}
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

  it('should fire a GA event when clicking past appointments link', () => {
    const defaultProps = {
      appointments: {
        future: [],
        futureStatus: FETCH_STATUS.succeeded,
        facilityData: {},
      },
    };

    const startNewAppointmentFlow = sinon.spy();
    const fetchFutureAppointments = sinon.spy();
    const fetchPastAppointments = sinon.spy();

    const tree = shallow(
      <AppointmentsPage
        {...defaultProps}
        showScheduleButton
        fetchFutureAppointments={fetchFutureAppointments}
        fetchPastAppointments={fetchPastAppointments}
        startNewAppointmentFlow={startNewAppointmentFlow}
      />,
    );

    tree
      .find('a')
      .at(0)
      .simulate('click');
    expect(global.window.dataLayer[0].event).to.equal(
      'vaos-past-appointments-legacy-link-clicked',
    );
    tree.unmount();
  });

  it('should load future tab if no "view" query is provided', () => {
    const defaultProps = {
      appointments: {
        future: [],
        futureStatus: FETCH_STATUS.notStarted,
        facilityData: {},
      },
      location: {
        query: undefined,
      },
    };

    const startNewAppointmentFlow = sinon.spy();
    const fetchFutureAppointments = sinon.spy();
    const fetchPastAppointments = sinon.spy();

    const tree = shallow(
      <AppointmentsPage
        {...defaultProps}
        showScheduleButton
        showPastAppointments
        fetchFutureAppointments={fetchFutureAppointments}
        fetchPastAppointments={fetchPastAppointments}
        startNewAppointmentFlow={startNewAppointmentFlow}
      />,
    );

    expect(fetchFutureAppointments.called).to.be.true;
    expect(fetchPastAppointments.called).to.be.false;
    expect(tree.find('FutureAppointmentsList').exists()).to.be.true;
    tree.unmount();
  });

  it('should load past tab if "view" query is provided', () => {
    const defaultProps = {
      appointments: {
        future: [],
        futureStatus: FETCH_STATUS.notStarted,
        past: [],
        pastStatus: FETCH_STATUS.notStarted,
        facilityData: {},
      },
      location: {
        query: {
          view: 'past',
        },
      },
    };

    const startNewAppointmentFlow = sinon.spy();
    const fetchFutureAppointments = sinon.spy();
    const fetchPastAppointments = sinon.spy();

    const tree = shallow(
      <AppointmentsPage
        {...defaultProps}
        showScheduleButton
        showPastAppointments
        fetchFutureAppointments={fetchFutureAppointments}
        fetchPastAppointments={fetchPastAppointments}
        startNewAppointmentFlow={startNewAppointmentFlow}
      />,
    );

    expect(fetchFutureAppointments.called).to.be.false;
    expect(fetchPastAppointments.called).to.be.true;
    expect(tree.find('PastAppointmentsList').exists()).to.be.true;
    tree.unmount();
  });

  it('should fetch past on past dropdown change', () => {
    const defaultProps = {
      appointments: {
        future: [],
        futureStatus: FETCH_STATUS.notStarted,
        past: [],
        pastStatus: FETCH_STATUS.notStarted,
        facilityData: {},
      },
      location: {
        query: {
          view: 'past',
        },
      },
    };

    const startNewAppointmentFlow = sinon.spy();
    const fetchFutureAppointments = sinon.spy();
    const fetchPastAppointments = sinon.spy();

    const tree = shallow(
      <AppointmentsPage
        {...defaultProps}
        showScheduleButton
        showPastAppointments
        fetchFutureAppointments={fetchFutureAppointments}
        fetchPastAppointments={fetchPastAppointments}
        startNewAppointmentFlow={startNewAppointmentFlow}
      />,
    );

    const instance = tree.instance();
    instance.onPastAppointmentDateRangeChange({ target: { value: 1 } });
    expect(tree.state('selectedPastDateRangeIndex')).to.equal(1);
    expect(fetchPastAppointments.called).to.be.true;
    tree.unmount();
  });

  it('should fetch past appointments with selected date range startDate and endDate', () => {
    const defaultProps = {
      appointments: {
        future: [],
        futureStatus: FETCH_STATUS.notStarted,
        past: [],
        pastStatus: FETCH_STATUS.notStarted,
        facilityData: {},
      },
    };

    const startNewAppointmentFlow = sinon.spy();
    const fetchFutureAppointments = sinon.spy();
    const fetchPastAppointments = sinon.spy();

    const tree = shallow(
      <AppointmentsPage
        {...defaultProps}
        showScheduleButton
        showPastAppointments
        fetchFutureAppointments={fetchFutureAppointments}
        fetchPastAppointments={fetchPastAppointments}
        startNewAppointmentFlow={startNewAppointmentFlow}
      />,
    );

    const instance = tree.instance();
    instance.onPastAppointmentDateRangeChange({ target: { value: 1 } });
    expect(tree.state('selectedPastDateRangeIndex')).to.equal(1);
    expect(fetchPastAppointments.called).to.be.true;
    tree.unmount();
  });

  it('should fetch past and push route on change tab to past', () => {
    const push = sinon.spy();
    const defaultProps = {
      appointments: {
        future: [],
        futureStatus: FETCH_STATUS.notStarted,
        past: [],
        pastStatus: FETCH_STATUS.notStarted,
        facilityData: {},
      },
      router: {
        push,
      },
    };

    const startNewAppointmentFlow = sinon.spy();
    const fetchFutureAppointments = sinon.spy();
    const fetchPastAppointments = sinon.spy();

    const tree = shallow(
      <AppointmentsPage
        {...defaultProps}
        showScheduleButton
        showPastAppointments
        fetchFutureAppointments={fetchFutureAppointments}
        fetchPastAppointments={fetchPastAppointments}
        startNewAppointmentFlow={startNewAppointmentFlow}
      />,
    );

    const instance = tree.instance();
    expect(tree.state('tabIndex')).to.equal(0);
    instance.onSelectTab(1);
    expect(fetchPastAppointments.called).to.be.true;
    expect(push.called).to.be.true;
    expect(push.firstCall.args[0]).to.equal('?view=past');
    expect(tree.state('tabIndex')).to.equal(1);
    tree.unmount();
  });

  it('should fetch future and push route on change tab to future', () => {
    const push = sinon.spy();
    const defaultProps = {
      appointments: {
        future: [],
        futureStatus: FETCH_STATUS.notStarted,
        past: [],
        pastStatus: FETCH_STATUS.notStarted,
        facilityData: {},
      },
      router: {
        push,
      },
      location: {
        query: {
          view: 'past',
        },
      },
    };

    const startNewAppointmentFlow = sinon.spy();
    const fetchFutureAppointments = sinon.spy();
    const fetchPastAppointments = sinon.spy();

    const tree = shallow(
      <AppointmentsPage
        {...defaultProps}
        showScheduleButton
        showPastAppointments
        fetchFutureAppointments={fetchFutureAppointments}
        fetchPastAppointments={fetchPastAppointments}
        startNewAppointmentFlow={startNewAppointmentFlow}
      />,
    );

    const instance = tree.instance();
    expect(tree.state('tabIndex')).to.equal(1);
    instance.onSelectTab(0);
    expect(fetchFutureAppointments.called).to.be.true;
    expect(push.called).to.be.true;
    expect(push.firstCall.args[0]).to.equal('');
    expect(tree.state('tabIndex')).to.equal(0);
    tree.unmount();
  });

  it('should fetch past appointments with selected date range startDate and endDate', () => {
    const defaultProps = {
      appointments: {
        future: [],
        futureStatus: FETCH_STATUS.notStarted,
        past: [],
        pastStatus: FETCH_STATUS.notStarted,
        facilityData: {},
      },
    };

    const startNewAppointmentFlow = sinon.spy();
    const fetchFutureAppointments = sinon.spy();
    const fetchPastAppointments = sinon.spy();

    const tree = shallow(
      <AppointmentsPage
        {...defaultProps}
        showScheduleButton
        showPastAppointments
        fetchFutureAppointments={fetchFutureAppointments}
        fetchPastAppointments={fetchPastAppointments}
        startNewAppointmentFlow={startNewAppointmentFlow}
      />,
    );

    const instance = tree.instance();
    instance.fetchPastAppointments();
    expect(fetchPastAppointments.called).to.be.true;
    expect(fetchPastAppointments.firstCall.args[0]).to.equal(
      tree.state('selectedPastDateRange').startDate,
    );
    expect(fetchPastAppointments.firstCall.args[1]).to.equal(
      tree.state('selectedPastDateRange').endDate,
    );
    tree.unmount();
  });
});
