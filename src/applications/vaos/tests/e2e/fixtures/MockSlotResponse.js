import moment from 'moment';

/**
 * @typedef {import('moment-timezone').Moment} Moment
 */

/**
 * Mock available appointment slots class.
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
   * @param {Moment} arguments.start - Open slot start date and time.
   * @memberof MockSlotResponse
   */
  constructor({ id, start }) {
    this.id = id.toString();
    this.type = 'MockSlotResponse';
    this.attributes = {
      start: start.utc().format(),
      end: moment(start)
        .utc()
        .format(),
    };
  }

  static createResponses({ startTimes = [] } = {}) {
    return startTimes.map(
      (start, index) => new MockSlotResponse({ id: index + 1, start }),
    );
  }
}
