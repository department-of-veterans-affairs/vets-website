import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';

import AppointmentRequestListItem from '../../components/AppointmentRequestListItem';

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
      facility: {
        city: 'Northampton',
        state: 'MA',
        facilityCode: '983',
      },
      appointmentRequestId: 'guid',
      messages: [
        {
          attributes: {
            messageText: 'Some message',
          },
        },
      ],
    };
    const tree = shallow(
      <AppointmentRequestListItem appointment={appointment} />,
    );

    const statusSpans = tree.find('h2 > span');
    expect(statusSpans.at(0).text()).to.equal('Pending');
    expect(statusSpans.at(1).text()).to.equal('Date and time to be determined');

    expect(
      tree.find('div.vads-u-flex--1.vads-u-margin-y--1p5 > span').text(),
    ).to.equal('Testing appointment');

    expect(tree.find('.usa-button-secondary').text()).to.equal('Cancel');

    const toggleExpand = tree.find('.vaos-appts__expand-link');
    toggleExpand.simulate('click');

    const preferredDates = tree.find('.vaos-appts__preferred-dates li');

    expect(preferredDates.at(0).text()).to.equal(
      'Wed, May 22, 2019 in the afternoon',
    );

    expect(preferredDates.at(1).text()).to.equal(
      'Thu, May 23, 2019 in the morning',
    );

    const messages = tree.find('.vaos_appts__message');
    expect(messages.find('dt').text()).to.equal('Additional Information');
    expect(messages.find('dd').text()).to.equal('Some message');

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
      facility: {
        city: 'Northampton',
        state: 'MA',
        facilityCode: '983',
      },
      appointmentRequestId: 'guid',
    };
    const tree = shallow(
      <AppointmentRequestListItem appointment={appointment} />,
    );

    expect(tree.find('h2').text()).to.equal('Canceled');

    expect(
      tree.find('div.vads-u-flex--1.vads-u-margin-y--1p5 > span').text(),
    ).to.equal('Audiology (hearing Aid Support) appointment');

    expect(tree.find('.usa-button-secondary').length).to.equal(0);
    tree.unmount();
  });
});
