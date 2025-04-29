import { addDays, startOfDay, addHours } from 'date-fns';
import { expect } from 'chai';
import MockDate from 'mockdate';

const draftAppointmentUtil = require('../../utils/provider');

describe('VAOS provider utils', () => {
  afterEach(() => {
    MockDate.reset();
  });
  const tomorrow = addDays(startOfDay(new Date()), 1);
  describe('createDraftAppointmentInfo', () => {
    const providerObjectTwoSlots = draftAppointmentUtil.createDraftAppointmentInfo(
      2,
      'add2f0f4-a1ea-4dea-a504-a54ab57c6802',
    );
    it('Creates a provider with specified number of slots', () => {
      expect(providerObjectTwoSlots.slots.slots.length).to.equal(2);
    });
    it('Creates slots for tomorrow an hour apart starting at 12', () => {
      expect(providerObjectTwoSlots.slots.slots[0].start).to.equal(
        addHours(tomorrow, 12).toISOString(),
      );
      expect(providerObjectTwoSlots.slots.slots[1].start).to.equal(
        addHours(tomorrow, 13).toISOString(),
      );
    });
    it('Creates empty slots array with 0', () => {
      const providerObjectNoSlots = draftAppointmentUtil.createDraftAppointmentInfo(
        0,
      );
      expect(providerObjectNoSlots.slots.slots.length).to.equal(0);
    });
  });
  describe('getSlotByDate', () => {
    it('returns the correct object for a given data', () => {
      const draftAppointment = draftAppointmentUtil.createDraftAppointmentInfo(
        2,
      );
      const date = draftAppointment.slots.slots[0].start;
      expect(
        draftAppointmentUtil.getSlotByDate(draftAppointment.slots.slots, date),
      ).to.equal(draftAppointment.slots.slots[0]);
    });
  });
  describe('getSlotById', () => {
    it('returns the correct object for a given id', () => {
      const draftAppointment = draftAppointmentUtil.createDraftAppointmentInfo(
        2,
      );
      const { id } = draftAppointment.slots.slots[0];
      expect(
        draftAppointmentUtil.getSlotById(draftAppointment.slots.slots, id),
      ).to.equal(draftAppointment.slots.slots[0]);
    });
  });
  describe('hasConflict', () => {
    MockDate.set('2024-12-05T00:00:00Z');
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
