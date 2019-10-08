import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';

import PendingAppointmentListItem from '../../components/PendingAppointmentListItem';

describe('VAOS <PendingAppointmentListItem>', () => {
  it('should render pending VA appointment item', () => {
    const appointment = {
      appointmentType: 'Testing',
      optionDate1: '05/22/2019',
      optionTime1: 'PM',
      typeOfCareId: '1',
      friendlyLocationName: 'Some location',
      facility: {
        city: 'Northampton',
        state: 'MA',
      },
      appointmentRequestId: 'guid',
    };
    const tree = shallow(
      <PendingAppointmentListItem appointment={appointment} />,
    );

    expect(tree.find('h2').text()).to.equal(appointment.appointmentType);
    expect(
      tree
        .find('ul > li')
        .at(0)
        .text(),
    ).to.equal('May 22, 2019 in the afternoon');

    expect(
      tree
        .find('li > div > div')
        .at(1)
        .text(),
    ).to.contain('Some location');

    expect(tree.find('Link').props().to).to.equal(
      `appointments/pending/${appointment.appointmentRequestId}`,
    );

    tree.unmount();
  });

  it('should render pending CC appointment item', () => {
    const appointment = {
      appointmentType: 'Testing',
      optionDate1: '05/22/2019',
      optionTime1: 'PM',
      typeOfCareId: 'CCTest',
      friendlyLocationName: 'Some location',
      facility: {
        city: 'Northampton',
        state: 'MA',
      },
      ccAppointmentRequest: {
        preferredCity: 'Leeds',
        preferredState: 'NH',
      },
    };
    const tree = shallow(
      <PendingAppointmentListItem appointment={appointment} />,
    );

    expect(tree.find('h2').text()).to.equal(appointment.appointmentType);
    expect(
      tree
        .find('ul > li')
        .at(0)
        .text(),
    ).to.equal('May 22, 2019 in the afternoon');

    const locationDiv = tree.find('li > div > div').at(1);

    expect(locationDiv.text()).to.contain('Preferred location:');
    expect(locationDiv.text()).to.contain('Leeds, NH');

    tree.unmount();
  });
});
