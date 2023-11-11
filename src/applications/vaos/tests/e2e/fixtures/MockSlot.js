import moment from 'moment';

/**
 * @typedef {import('moment-timezone').Moment} Moment
 */

/**
 * Mock available appointment slots class.
 *
 * @export
 * @class MockSlot
 */
export class MockSlot {
  /**
   * Creates an instance of MockSlot.
   * @param {Object} arguments
   * @param {String} id
   * @param {Moment} start - Open slot start date and time.
   * @memberof MockSlot
   */
  constructor({ id, start }) {
    this.id = id.toString();
    this.type = 'MockSlot';
    this.attributes = {
      start: start.utc().format(),
      end: moment(start)
        .utc()
        .format(),
    };
  }
}
