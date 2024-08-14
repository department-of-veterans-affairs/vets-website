/* eslint-disable camelcase */
import { expect } from 'chai';
import { countUnreadMessages, isLinkData } from '../../utilities/data/index';
import manifest from '../../manifest.json';

describe(manifest.appName, () => {
  describe('utilities/data', () => {
    describe('countUnreadMessages', () => {
      it('unread count only uses inbox and custom folders', () => {
        // Note the system folder IDs are constant and set by the API
        const folderIds = {
          inbox: 0,
          sent: -1,
          drafts: -2,
          deleted: -3,
        };

        const folder = (id, unreadCount) => {
          return {
            id,
            type: 'folders',
            attributes: {
              folderId: id,
              unreadCount,
              count: 10, // Helps check the count is not used
              systemFolder: id <= 0,
            },
          };
        };

        // All empty folders
        let count = countUnreadMessages({
          data: [
            folder(folderIds.inbox, 0),
            folder(folderIds.sent, 0),
            folder(folderIds.drafts, 0),
            folder(folderIds.deleted, 0),
            folder(100, 0),
          ],
        });
        expect(count).to.equal(0);

        // Inbox has unread messages
        count = countUnreadMessages({
          data: [
            folder(folderIds.inbox, 1),
            folder(folderIds.sent, 0),
            folder(folderIds.drafts, 0),
            folder(folderIds.deleted, 0),
            folder(100, 0),
          ],
        });
        expect(count).to.equal(1);

        // Custom folder has unread messages
        count = countUnreadMessages({
          data: [
            folder(folderIds.inbox, 0),
            folder(folderIds.sent, 0),
            folder(folderIds.drafts, 0),
            folder(folderIds.deleted, 0),
            folder(100, 0),
            folder(101, 1),
          ],
        });
        expect(count).to.equal(1);

        // No unread received messages for the user
        count = countUnreadMessages({
          data: [
            folder(folderIds.inbox, 0),
            folder(folderIds.sent, 1),
            folder(folderIds.drafts, 1),
            folder(folderIds.deleted, 1),
            folder(100, 0),
            folder(101, 0),
          ],
        });
        expect(count).to.equal(0);

        // Multi count
        count = countUnreadMessages({
          data: [
            folder(folderIds.inbox, 5),
            folder(folderIds.sent, 1),
            folder(folderIds.drafts, 1),
            folder(folderIds.deleted, 1),
            folder(100, 2),
            folder(101, 3),
          ],
        });
        expect(count).to.equal(10);
      });
    });
    describe('isLinkData', () => {
      it('checks that inputs are objects have href and text properties', () => {
        const validLinkData = {
          href: '/link',
          text: 'text',
        };
        expect(isLinkData(validLinkData)).to.be.true;

        const missingHref = { text: 'foo' };
        expect(isLinkData(missingHref)).to.be.false;

        const missingText = { href: '/link' };
        expect(isLinkData(missingText)).to.be.false;

        // Test non-objects, since
        expect(isLinkData(null)).to.be.false;
        expect(isLinkData(false)).to.be.false;
      });
    });
  });
});
