import React from 'react';
import { expect } from 'chai';
import { mount } from 'enzyme';
import moment from 'moment';
import sinon from 'sinon';

import AppointmentRequestListItem from '../../components/AppointmentRequestListItem';
import { APPOINTMENT_TYPES, APPOINTMENT_STATUS } from '../../utils/constants';

describe('VAOS <AppointmentRequestListItem>', () => {
  it('should render pending VA appointment request', () => {
    const appointment = {
      appointmentType: APPOINTMENT_TYPES.request,
      isCommunityCare: false,
      typeOfCare: 'Testing',
      dateOptions: [
        {
          date: moment('2019-05-22'),
          optionTime: 'PM',
        },
        {
          date: moment('2019-05-23'),
          optionTime: 'AM',
        },
      ],
      facilityName: 'Some location',
      status: APPOINTMENT_STATUS.pending,
      bestTimetoCall: ['Morning'],
      reason: 'Follow-up/Routine',
      facility: {
        city: 'Northampton',
        state: 'MA',
        facilityCode: '983',
      },
      id: 'guid',
    };

    const messages = {
      guid: [
        {
          attributes: {
            messageText: 'Some message',
          },
        },
      ],
    };

    const fetchMessages = sinon.spy();

    const tree = mount(
      <AppointmentRequestListItem
        appointment={appointment}
        fetchMessages={fetchMessages}
        messages={messages}
        showCancelButton
      />,
    );

    expect(tree.text()).to.contain('Pending');
    expect(tree.text()).to.contain('still to be determined');

    expect(tree.text()).to.contain('VA Appointment');
    expect(tree.text()).to.contain('Testing appointment');

    expect(tree.find('.vaos-appts__cancel-btn').text()).to.equal(
      'Cancel appointment',
    );

    const toggleExpand = tree
      .find('AdditionalInfo')
      .find('.additional-info-button');
    toggleExpand.simulate('click');

    const preferredDates = tree.find('ul li');

    expect(preferredDates.at(0).text()).to.equal(
      'Wed, May 22, 2019 in the afternoon',
    );

    expect(preferredDates.at(1).text()).to.equal(
      'Thu, May 23, 2019 in the morning',
    );

    const messageTree = tree.find('.vaos_appts__message');
    expect(messageTree.find('dt').text()).to.equal('Follow-up/Routine');
    expect(messageTree.find('dd').text()).to.equal('Some message');

    expect(tree.find('.vaos-u-word-break--break-word').exists()).to.be.true;

    tree.unmount();
  });

  it('should render cancelled VA appointment request', () => {
    const appointment = {
      appointmentType: APPOINTMENT_TYPES.request,
      typeOfCare: 'Audiology (hearing Aid Support)',
      dateOptions: [
        {
          date: moment('2019-05-22'),
          optionTime: 'PM',
        },
      ],
      facilityName: 'Some location',
      status: APPOINTMENT_STATUS.cancelled,
      bestTimetoCall: [],
      facility: {
        city: 'Northampton',
        state: 'MA',
        facilityCode: '983',
      },
      id: 'guid',
    };
    const tree = mount(
      <AppointmentRequestListItem appointment={appointment} />,
    );

    expect(tree.text()).to.contain('Canceled');

    expect(tree.text()).to.contain(
      'Audiology (hearing aid support) appointment',
    );

    expect(tree.find('.vaos-appts__cancel-btn').length).to.equal(0);
    tree.unmount();
  });

  it('should render pending CC appointment request', () => {
    const appointment = {
      appointmentType: APPOINTMENT_TYPES.ccRequest,
      isCommunityCare: true,
      typeOfCare: 'Testing',
      dateOptions: [
        {
          date: moment('2019-05-22'),
          optionTime: 'PM',
        },
        {
          date: moment('2019-05-23'),
          optionTime: 'AM',
        },
      ],
      facilityName: 'Some location',
      status: APPOINTMENT_STATUS.pending,
      bestTimetoCall: ['Morning'],
      reason: 'Routine Follow-up',
      facility: {
        city: 'Northampton',
        state: 'MA',
        facilityCode: '983',
      },
      id: 'guid',
      preferredProviders: [
        {
          firstName: 'Jane',
          lastName: 'Doe',
          practiceName: 'Test Practice',
        },
      ],
    };

    const messages = {
      guid: [
        {
          attributes: {
            messageText: 'Some message',
          },
        },
      ],
    };

    const fetchMessages = sinon.spy();

    const tree = mount(
      <AppointmentRequestListItem
        appointment={appointment}
        fetchMessages={fetchMessages}
        messages={messages}
        showCancelButton
      />,
    );

    expect(tree.text()).to.contain('Pending');
    expect(tree.text()).to.contain('still to be determined');

    expect(tree.text()).to.contain('Testing appointment');
    expect(tree.text()).to.contain('Community Care');
    expect(tree.text()).to.contain('Test Practice');
    expect(tree.text()).to.contain('Jane Doe');

    expect(tree.find('.vaos-appts__cancel-btn').text()).to.equal(
      'Cancel appointment',
    );

    const toggleExpand = tree.find('AdditionalInfo');
    toggleExpand.props().onClick();
    const preferredDates = tree
      .find('ul')
      .at(1)
      .find('li');

    expect(preferredDates.at(0).text()).to.equal(
      'Wed, May 22, 2019 in the afternoon',
    );

    expect(preferredDates.at(1).text()).to.equal(
      'Thu, May 23, 2019 in the morning',
    );

    expect(tree.find('.vaos-u-word-break--break-word').exists()).to.be.true;

    tree.unmount();
  });
});
