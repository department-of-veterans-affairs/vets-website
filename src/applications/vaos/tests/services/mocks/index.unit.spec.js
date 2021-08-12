import { expect } from 'chai';
import generateMockSlots from '../../../services/mocks/var/slots';

describe('calendar mock data', () => {
  it('should generate 300 mock slots', () => {
    const slots = generateMockSlots();
    expect(slots.length).to.equal(300);
  });

  it('should have slots with the correct properties', () => {
    const slots = generateMockSlots();
    const first = slots[0];
    expect(Object.prototype.hasOwnProperty.call(first, 'startDateTime')).to.be
      .true;
    expect(Object.prototype.hasOwnProperty.call(first, 'bookingStatus')).to.be
      .true;
    expect(
      Object.prototype.hasOwnProperty.call(
        first,
        'remainingAllowedOverBookings',
      ),
    ).to.be.true;
    expect(Object.prototype.hasOwnProperty.call(first, 'availability')).to.be
      .true;
  });
});
