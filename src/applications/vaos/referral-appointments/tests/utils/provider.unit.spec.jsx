import { addDays, startOfDay, addHours } from 'date-fns';
import { expect } from 'chai';
import MockDate from 'mockdate';
import { waitFor } from '@testing-library/react';

const draftAppointmentUtil = require('../../utils/provider');

describe('VAOS provider utils', () => {
  afterEach(() => {
    MockDate.reset();
  });
  const tomorrow = addDays(startOfDay(new Date()), 1);
  describe('createDraftAppointmentInfo', () => {
    const providerObjectTwoSlots = draftAppointmentUtil.createDraftAppointmentInfo(
      2,
    );
    it('Creates a provider with specified number of slots', () => {
      waitFor(() => {
        expect(providerObjectTwoSlots.attributes.slots.length).to.equal(2);
      });
    });
    it('Creates slots for tomorrow an hour apart starting at 12', () => {
      waitFor(() => {
        expect(providerObjectTwoSlots.attributes.slots[0].start).to.equal(
          addHours(tomorrow, 12).toISOString(),
        );
        expect(providerObjectTwoSlots.attributes.slots[1].start).to.equal(
          addHours(tomorrow, 13).toISOString(),
        );
      });
    });
    it('Creates empty slots array with 0', () => {
      const providerObjectNoSlots = draftAppointmentUtil.createDraftAppointmentInfo(
        0,
      );
      expect(providerObjectNoSlots.attributes.slots.length).to.equal(0);
    });
  });
  describe('getSlotByDate', () => {
    it('returns the correct object for a given data', () => {
      const draftAppointment = draftAppointmentUtil.createDraftAppointmentInfo(
        2,
      );
      const date = draftAppointment.attributes.slots[0].start;
      expect(
        draftAppointmentUtil.getSlotByDate(
          draftAppointment.attributes.slots,
          date,
        ),
      ).to.equal(draftAppointment.attributes.slots[0]);
    });
  });
  describe('hasConflict', () => {
    before(() => {
      MockDate.set('2024-12-05T00:00:00Z');
    });
    after(() => {
      MockDate.reset();
    });
    const tz = 'America/Los_Angeles';
    const appointmentsByMonth = {
      '2024-12': [
        {
          start: '2024-12-06T09:00:00-08:00',
          timezone: tz,
          minutesDuration: 60,
        },
      ],
    };
    it('returns false when there is no conflict', () => {
      expect(
        draftAppointmentUtil.hasConflict(
          '2024-12-06T16:00:00Z',
          appointmentsByMonth,
          tz,
        ),
      ).to.be.false;
    });
    it('returns true when there is no conflict', () => {
      expect(
        draftAppointmentUtil.hasConflict(
          '2024-12-06T17:00:00Z',
          appointmentsByMonth,
          tz,
        ),
      ).to.be.true;
    });
  });
});
