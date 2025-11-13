import { expect } from 'chai';
import MockDate from 'mockdate';
import {
  generateSlotsForDay,
  transformSlotsForCommunityCare,
} from '../../../services/mocks/utils/slots';
import { mockToday } from '../../../tests/mocks/constants';

const draftAppointmentUtil = require('../../utils/provider');

describe('VAOS provider utils', () => {
  afterEach(() => {
    MockDate.reset();
  });
  describe('createDraftAppointmentInfo', () => {
    it('Creates empty slots array with 0', () => {
      const providerObjectNoSlots = draftAppointmentUtil.createDraftAppointmentInfo();
      expect(providerObjectNoSlots.attributes.slots.length).to.equal(0);
    });
  });
  describe('getSlotByDate', () => {
    it('returns the correct object for a given data', () => {
      const slots = generateSlotsForDay(mockToday, {
        slotsPerDay: 1,
        slotDuration: 60,
        businessHours: {
          start: 12,
          end: 18,
        },
      });
      const transformedSlots = transformSlotsForCommunityCare(slots);
      const date = transformedSlots[0].start;
      expect(
        draftAppointmentUtil.getSlotByDate(transformedSlots, date),
      ).to.equal(transformedSlots[0]);
    });
  });
});
