import { expect } from 'chai';
import {
  countUnreadMessages,
  createUrlWithQuery,
  currency,
  roundToNearest,
} from '../../utils/helpers';

describe('createUrlWithQuery function', () => {
  it('should correctly append query parameters', () => {
    expect(
      createUrlWithQuery('/my_health/v1/messaging/folders', {
        page: 1,
        useCache: false,
      }),
    ).to.equal('/my_health/v1/messaging/folders?page=1&useCache=false');
  });
});

describe('currency function', () => {
  it('should format a number to American dollar', () => {
    expect(currency(44)).to.equal('$44.00');
  });
  it('should format a number to American dollar', () => {
    expect(currency(23)).to.not.equal('€23');
  });
});

describe('countUnreadMessages function', () => {
  it('should count all unread messages in all folders, except for those in the Sent folder', () => {
    expect(
      countUnreadMessages({
        data: [
          {
            attributes: {
              folderId: 0,
              name: 'Inbox',
              unreadCount: 3,
            },
            id: '0',
          },
          {
            attributes: {
              folderId: -1,
              name: 'Sent',
              unreadCount: 2,
            },
            id: '-1',
          },
          {
            attributes: {
              folderId: 435,
              name: 'Favorites',
              unreadCount: 3,
            },
            id: '435',
          },
        ],
      }),
    ).to.equal(6);
  });

  it('should return unread messages if there only exists one folder', () => {
    expect(
      countUnreadMessages({
        data: {
          attributes: {
            folderId: 0,
            name: 'Inbox',
            unreadCount: 3,
          },
          id: '0',
        },
      }),
    ).to.equal(3);
  });

  it('should return 0 if there are no folders', () => {
    expect(
      countUnreadMessages({
        data: {},
      }),
    ).to.equal(0);
  });
});

describe('roundToNearest function', () => {
  it('should return value rounded to the nearest interval', () => {
    expect(roundToNearest({ interval: 5000, value: 13000 })).to.equal(15000);
    expect(roundToNearest({ interval: 5000, value: 6500 })).to.equal(5000);
    expect(roundToNearest({ interval: 5000, value: 7500 })).to.not.equal(5000);
  });
});
