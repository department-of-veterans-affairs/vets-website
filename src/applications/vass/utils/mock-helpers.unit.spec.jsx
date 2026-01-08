import { expect } from 'chai';
import { generateSlots } from './mock-helpers';

describe('generateSlots', () => {
  it('should generate default 14 days of slots with 12 slots per day', () => {
    const slots = generateSlots();

    // 14 days, filtering out weekends (approximately 10 weekdays)
    // 10 weekdays * 12 slots = 120 slots
    expect(slots.length).to.be.greaterThan(0);
    expect(slots.length).to.equal(10 * 12); // Assuming 10 weekdays in 14 days
  });

  it('should return slots with start and end properties', () => {
    const slots = generateSlots(7, 4);

    expect(slots[0]).to.have.property('dtStartUtc');
    expect(slots[0]).to.have.property('dtEndUtc');
    expect(slots[0].dtStartUtc).to.be.a('string');
    expect(slots[0].dtEndUtc).to.be.a('string');
  });

  it('should create 30-minute duration slots', () => {
    const slots = generateSlots(7, 1);

    const start = new Date(slots[0].dtStartUtc);
    const end = new Date(slots[0].dtEndUtc);
    const durationMinutes = (end - start) / (1000 * 60);

    expect(durationMinutes).to.equal(30);
  });

  it('should start at 16:00 UTC or 8:00 PST', () => {
    const slots = generateSlots(7, 1);

    const firstSlotStart = new Date(slots[0].dtStartUtc);
    expect(firstSlotStart.getUTCHours()).to.equal(16); // 16:00 UTC
    expect(firstSlotStart.getUTCMinutes()).to.equal(0);
  });

  it('should generate slots with 30-minute intervals', () => {
    const slots = generateSlots(7, 3);

    const firstDay = slots.slice(0, 3);

    expect(new Date(firstDay[0].dtStartUtc).getUTCHours()).to.equal(16);
    expect(new Date(firstDay[0].dtStartUtc).getUTCMinutes()).to.equal(0);

    expect(new Date(firstDay[1].dtStartUtc).getUTCHours()).to.equal(16);
    expect(new Date(firstDay[1].dtStartUtc).getUTCMinutes()).to.equal(30);

    expect(new Date(firstDay[2].dtStartUtc).getUTCHours()).to.equal(17);
    expect(new Date(firstDay[2].dtStartUtc).getUTCMinutes()).to.equal(0);
  });

  it('should exclude weekends', () => {
    const slots = generateSlots(7, 1);

    // Check that no slots fall on Saturday (6) or Sunday (0)
    const hasWeekendSlots = slots.some(slot => {
      const dayOfWeek = new Date(slot.dtStartUtc).getDay();
      return dayOfWeek === 0 || dayOfWeek === 6;
    });

    expect(hasWeekendSlots).to.be.false;
  });

  it('should generate correct number of slots for custom parameters', () => {
    const slots = generateSlots(7, 5); // 7 days, 5 slots per day

    // 7 days typically has 5 weekdays
    expect(slots.length).to.equal(5 * 5);
  });

  it('should start from tomorrow, not today', () => {
    const slots = generateSlots(7, 1);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const slotDate = new Date(slots[0].dtStartUtc);
    slotDate.setHours(0, 0, 0, 0);

    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    expect(slotDate.getTime()).to.be.at.least(tomorrow.getTime());
  });

  it('should return ISO 8601 formatted strings', () => {
    const slots = generateSlots(7, 1);

    // ISO 8601 format includes 'T' and 'Z'
    expect(slots[0].dtStartUtc).to.match(
      /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/,
    );
    expect(slots[0].dtEndUtc).to.match(
      /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/,
    );
  });
});
