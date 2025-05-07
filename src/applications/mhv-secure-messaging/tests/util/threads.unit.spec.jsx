import { expect } from 'chai';
import { getRecentMessages } from '../../util/threads';

describe('getRecentMessages', () => {
  it('should return messages sent within the last 6 months by default', () => {
    const threadList = [
      { sentDate: new Date().toISOString() },
      {
        sentDate: new Date(
          new Date().setMonth(new Date().getMonth() - 7),
        ).toISOString(),
      },
    ];

    const result = getRecentMessages(threadList);

    expect(result).to.have.lengthOf(1);
    expect(result[0].sentDate).to.equal(threadList[0].sentDate);
  });

  it('should return messages sent within the specified number of months', () => {
    const threadList = [
      { sentDate: new Date().toISOString() },
      {
        sentDate: new Date(
          new Date().setMonth(new Date().getMonth() - 3),
        ).toISOString(),
      },
      {
        sentDate: new Date(
          new Date().setMonth(new Date().getMonth() - 8),
        ).toISOString(),
      },
    ];

    const result = getRecentMessages(threadList, 4);

    expect(result).to.have.lengthOf(2);
    expect(result[0].sentDate).to.equal(threadList[0].sentDate);
    expect(result[1].sentDate).to.equal(threadList[1].sentDate);
  });

  it('should return an empty array if no messages are within the specified time frame', () => {
    const threadList = [
      {
        sentDate: new Date(
          new Date().setMonth(new Date().getMonth() - 7),
        ).toISOString(),
      },
    ];

    const result = getRecentMessages(threadList);

    expect(result).to.be.an('array').that.is.empty;
  });
});
