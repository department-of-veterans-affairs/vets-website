import { generateMockSlots } from '../../utils/calendar';

describe('calendar mock data', () => {
  it('should generate 300 mock slots', () => {
    const slots = generateMockSlots();
    expect(slots.length).toBe(300);
  });

  it('should have slots with the correct properties', () => {
    const slots = generateMockSlots();
    const first = slots[0];
    expect(Object.prototype.hasOwnProperty.call(first, 'startDateTime')).toBe(
      true,
    );
    expect(Object.prototype.hasOwnProperty.call(first, 'bookingStatus')).toBe(
      true,
    );
    expect(
      Object.prototype.hasOwnProperty.call(
        first,
        'remainingAllowedOverBookings',
      ),
    ).toBe(true);
    expect(Object.prototype.hasOwnProperty.call(first, 'availability')).toBe(
      true,
    );
  });
});
