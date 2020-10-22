import React from 'react';
import { expect } from 'chai';
import sinon from 'sinon';
import { shallow } from 'enzyme';
import moment from '../../lib/moment-tz.js';

import AddToCalendar, { generateICS } from '../../components/AddToCalendar';

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
  describe('generateICS', () => {
    const now = moment();
    it('should generate valid ICS calendar commands', () => {
      const momentDate = moment(now);
      const dtStamp = momentDate.format('YYYYMMDDTHHmmss');
      const dtStart = momentDate.format('YYYYMMDDTHHmmss');
      const dtEnd = momentDate
        .clone()
        .add(60, 'minutes')
        .format('YYYYMMDDTHHmmss');

      const ics = generateICS(
        'Community Care',
        '. ',
        'Address 1 City, State Zip',
        dtStart,
        dtEnd,
      );
      expect(ics).to.contain('BEGIN:VCALENDAR');
      expect(ics).to.contain('VERSION:2.0');
      expect(ics).to.contain('PRODID:VA');
      expect(ics).to.contain('BEGIN:VEVENT');
      expect(ics).to.contain('UID:');
      expect(ics).to.contain('SUMMARY:Community Care');
      expect(ics).to.contain('DESCRIPTION:. ');
      expect(ics).to.contain('LOCATION:Address 1 City, State Zip');
      expect(ics).to.contain(`DTSTAMP:${dtStamp}`);
      expect(ics).to.contain(`DTSTART:${dtStart}`);
      expect(ics).to.contain(`DTEND:${dtEnd}`);
      expect(ics).to.contain('END:VEVENT');
      expect(ics).to.contain('END:VCALENDAR');
    });
    it('should properly chunk long descriptions', () => {
      const momentDate = moment(now);
      const dtStamp = momentDate.format('YYYYMMDDTHHmmss');
      const dtStart = momentDate.format('YYYYMMDDTHHmmss');
      const dtEnd = momentDate
        .clone()
        .add(60, 'minutes')
        .format('YYYYMMDDTHHmmss');
      const description = `Testing long line descriptions
Testing long descriptions Testing long descriptions Testing long descriptions
Testing long descriptions Testing long descriptions Testing long descriptions
Testing long descriptions`;

      const ics = generateICS(
        'Community Care',
        description,
        'Address 1 City, State Zip',
        dtStart,
        dtEnd,
      );
      expect(ics).to.contain('BEGIN:VCALENDAR');
      expect(ics).to.contain('VERSION:2.0');
      expect(ics).to.contain('PRODID:VA');
      expect(ics).to.contain('BEGIN:VEVENT');
      expect(ics).to.contain('UID:');
      expect(ics).to.contain('SUMMARY:Community Care');
      expect(ics).to.contain(
        'DESCRIPTION:Testing long line descriptions\\nTesting long descriptions Test\r\n\ting long descriptions Testing long descriptions\\nTesting long descriptions\r\n\t Testing long descriptions Testing long descriptions\\nTesting long descrip\r\n\ttions',
      );
      expect(ics).to.contain('LOCATION:Address 1 City, State Zip');
      expect(ics).to.contain(`DTSTAMP:${dtStamp}`);
      expect(ics).to.contain(`DTSTART:${dtStart}`);
      expect(ics).to.contain(`DTEND:${dtEnd}`);
      expect(ics).to.contain('END:VEVENT');
      expect(ics).to.contain('END:VCALENDAR');
    });
  });
});
