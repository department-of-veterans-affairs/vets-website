import { addMinutes } from 'date-fns';
import { formatInTimeZone } from 'date-fns-tz';

/**
 * Mock available appointment slots response.
 *
 * @export
 * @class MockSlotResponse
 */
export default class MockSlotResponse {
  /**
   * Creates an instance of MockSlotResponse.
   *
   * @param {Object} arguments
   * @param {String} arguments.id
   * @param {Date} arguments.start - Open slot start date and time.
   * @memberof MockSlotResponse
   */
  constructor({ id = '1', start, duration = 0 }) {
    this.id = id.toString();
    this.type = 'MockSlotResponse';
    this.attributes = {
      start: formatInTimeZone(start, 'UTC', "yyyy-MM-dd'T'HH:mm:ss'Z'"),
      end: formatInTimeZone(
        addMinutes(start, duration),
        'UTC',
        "yyyy-MM-dd'T'HH:mm:ss'Z'",
      ),
    };
  }

  static createResponses({ startTimes = [] } = {}) {
    return startTimes.map(
      (start, index) => new MockSlotResponse({ id: index + 1, start }),
    );
  }
}
