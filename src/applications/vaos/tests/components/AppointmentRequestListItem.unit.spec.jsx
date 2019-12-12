import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';
import sinon from 'sinon';

import AppointmentRequestListItem from '../../components/AppointmentRequestListItem';
import { APPOINTMENT_TYPES } from '../../utils/constants';

describe('VAOS <AppointmentRequestListItem>', () => {
  it('should render pending VA appointment request', () => {
    const appointment = {
      appointmentType: 'Testing',
      optionDate1: '05/22/2019',
      optionTime1: 'PM',
      optionDate2: '05/23/2019',
      optionTime2: 'AM',
      typeOfCareId: '1',
      friendlyLocationName: 'Some location',
      status: 'Submitted',
      bestTimetoCall: ['Morning'],
      purposeOfVisit: 'Routine Follow-up',
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

    const tree = shallow(
      <AppointmentRequestListItem
        appointment={appointment}
        fetchMessages={fetchMessages}
        messages={messages}
        showCancelButton
        type={APPOINTMENT_TYPES.request}
      />,
    );

    expect(tree.text()).to.contain('Pending');
    expect(tree.text()).to.contain('still to be determined');

    expect(tree.text()).to.contain('VA Appointment');
    expect(tree.text()).to.contain('Testing appointment');

    expect(tree.find('.vaos-appts__cancel-btn').text()).to.equal(
      'Cancel appointment',
    );

    const toggleExpand = tree.find('AdditionalInfo');
    toggleExpand.props().onClick();

    const preferredDates = tree.find('.vaos-appts__preferred-dates li');

    expect(preferredDates.at(0).text()).to.equal(
      'Wed, May 22, 2019 in the afternoon',
    );

    expect(preferredDates.at(1).text()).to.equal(
      'Thu, May 23, 2019 in the morning',
    );

    const messageTree = tree.find('.vaos_appts__message');
    expect(messageTree.find('dt').text()).to.equal('Follow-up/Routine');
    expect(messageTree.find('dd').text()).to.equal('Some message');

    tree.unmount();
  });

  it('should render cancelled VA appointment request', () => {
    const appointment = {
      appointmentType: 'Audiology (hearing Aid Support)',
      optionDate1: '05/22/2019',
      optionTime1: 'PM',
      typeOfCareId: '1',
      friendlyLocationName: 'Some location',
      status: 'Cancelled',
      bestTimetoCall: [],
      facility: {
        city: 'Northampton',
        state: 'MA',
        facilityCode: '983',
      },
      id: 'guid',
    };
    const tree = shallow(
      <AppointmentRequestListItem
        appointment={appointment}
        type={APPOINTMENT_TYPES.request}
      />,
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
      appointmentType: 'Testing',
      optionDate1: '05/22/2019',
      optionTime1: 'PM',
      optionDate2: '05/23/2019',
      optionTime2: 'AM',
      typeOfCareId: 'CCAUD',
      friendlyLocationName: 'Some location',
      status: 'Submitted',
      bestTimetoCall: ['Morning'],
      facility: {
        city: 'Northampton',
        state: 'MA',
        facilityCode: '983',
      },
      id: 'guid',
      ccAppointmentRequest: {
        preferredProviders: [
          {
            firstName: 'Jane',
            lastName: 'Doe',
            practiceName: 'Test Practice',
          },
        ],
      },
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

    const tree = shallow(
      <AppointmentRequestListItem
        appointment={appointment}
        fetchMessages={fetchMessages}
        messages={messages}
        showCancelButton
        type={APPOINTMENT_TYPES.ccRequest}
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

    const preferredDates = tree.find('.vaos-appts__preferred-dates li');

    expect(preferredDates.at(0).text()).to.equal(
      'Wed, May 22, 2019 in the afternoon',
    );

    expect(preferredDates.at(1).text()).to.equal(
      'Thu, May 23, 2019 in the morning',
    );

    tree.unmount();
  });
});
