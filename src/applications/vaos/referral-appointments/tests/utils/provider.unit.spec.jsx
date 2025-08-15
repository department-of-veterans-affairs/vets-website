import { addDays, startOfDay, addHours } from 'date-fns';
import { expect } from 'chai';
import MockDate from 'mockdate';
import { waitFor } from '@testing-library/react';
import { mockToday } from '../../../tests/mocks/constants';

const draftAppointmentUtil = require('../../utils/provider');

describe('VAOS provider utils', () => {
  afterEach(() => {
    MockDate.reset();
  });
  const tomorrow = addDays(startOfDay(mockToday), 1);
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
});
