import React from 'react';
import { expect } from 'chai';
import sinon from 'sinon';
import { shallow } from 'enzyme';
import moment from '../../utils/moment-tz.js';

import AddToCalendar from '../../components/AddToCalendar';

describe('VAOS <AddToCalendar>', () => {
  describe('Add VA appointment to calendar', () => {
    const tree = shallow(
      <AddToCalendar
        summary="VA Appointment"
        description="Follow-up/Routine: some description"
        location="A location"
        duration={60}
        startDateTime={moment('2020-01-02').toDate()}
      />,
    );

    const link = tree.find('a');

    it('should render', () => {
      expect(tree.exists()).to.be.true;
    });

    it('should contain valid ICS end command', () => {
      expect(link.props().href).to.contain(encodeURIComponent('END:VCALENDAR'));
    });

    it('should contain description', () => {
      expect(link.props().href).to.contain(
        encodeURIComponent('some description'),
      );
    });

    it('should download ICS commands to a file named "VA_Appointment.ics"', () => {
      expect(link.props().download).to.equal('VA_Appointment.ics');
    });

    it('should have an aria label', () => {
      expect(link.props()['aria-label']).to.equal(
        `Add January 2, 2020 appointment to your calendar`,
      );
    });

    tree.unmount();
  });

  describe('Add appointment request to calendar in IE', () => {
    const oldValue = window.navigator.msSaveOrOpenBlob;
    Object.defineProperty(window.navigator, 'msSaveOrOpenBlob', {
      value: sinon.spy(),
      writable: true,
    });
    const tree = shallow(
      <AddToCalendar
        summary="VA Appointment"
        description="Some description"
        location="A location"
        duration={60}
        startDateTime={moment('2020-01-02').toDate()}
      />,
    );

    const button = tree.find('button');

    it('should render', () => {
      expect(button.exists()).to.be.true;
    });

    it('should download ICS file on click', async () => {
      Object.defineProperty(window.navigator, 'msSaveOrOpenBlob', {
        value: sinon.spy(),
      });
      button.props().onClick();
      const filename = window.navigator.msSaveOrOpenBlob.firstCall.args[1];
      expect(window.navigator.msSaveOrOpenBlob.called).to.be.true;
      expect(filename).to.equal('VA_Appointment.ics');
    });

    it('should have an aria label', () => {
      expect(button.props()['aria-label']).to.equal(
        `Add January 2, 2020 appointment to your calendar`,
      );
    });

    tree.unmount();
    Object.defineProperty(window.navigator, 'msSaveOrOpenBlob', {
      value: oldValue,
      writable: true,
    });
  });
});
