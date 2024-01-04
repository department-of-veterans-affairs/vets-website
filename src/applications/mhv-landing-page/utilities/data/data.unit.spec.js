/* eslint-disable camelcase */
import { expect } from 'chai';
import { resolveToggleLink, countUnreadMessages } from './index';
import manifest from '../../manifest.json';

const initializeFeatureToggles = ({
  mhvLinkOneEnabled = false,
  mhvLinkTwoEnabled = false,
}) => {
  return {
    // eslint-disable-next-line camelcase
    mhv_link_one_enabled: mhvLinkOneEnabled,
    // eslint-disable-next-line camelcase
    mhv_link_two_enabled: mhvLinkTwoEnabled,
  };
};

describe(manifest.appName, () => {
  describe('utilities/data', () => {
    describe('resolveToggleLink', () => {
      it('resolves to the new href when available and no toggle matches', () => {
        const link = {
          href: '/new',
          oldHref: '/old',
          text: 'This is a link',
          toggle: '',
        };

        const toggles = initializeFeatureToggles({});

        const resolvedLink = resolveToggleLink(link, toggles);

        expect(resolvedLink.href).to.equal('/new');
      });

      it('resolves to the old href if the feature toggle is off', async () => {
        const link = {
          href: '/new',
          oldHref: '/old',
          text: 'This is a link',
          toggle: 'mhv_link_one_enabled',
        };

        const toggles = initializeFeatureToggles({
          mhvLinkOneEnabled: false,
        });
        const resolvedLink = resolveToggleLink(link, toggles);

        expect(resolvedLink.href).to.equal('/old');
      });

      it('resolves to the new href if the feature toggle is on', async () => {
        const link = {
          href: '/new',
          oldHref: '/old',
          text: 'This is a link',
          toggle: 'mhv_link_one_enabled',
        };

        const toggles = initializeFeatureToggles({
          mhvLinkOneEnabled: true,
        });
        const resolvedLink = resolveToggleLink(link, toggles);

        expect(resolvedLink.href).to.equal('/new');
      });
    });

    describe('countUnreadMessages', () => {
      it('unread count only uses inbox and custom folders', () => {
        // Custom folder Ids are > 0
        function customFolderId() {
          return Math.round(Math.random() * 99999) + 1;
        }

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
            folder(customFolderId(), 0),
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
            folder(customFolderId(), 0),
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
            folder(customFolderId(), 0),
            folder(customFolderId(), 1),
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
            folder(customFolderId(), 0),
            folder(customFolderId(), 0),
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
            folder(customFolderId(), 2),
            folder(customFolderId(), 3),
          ],
        });
        expect(count).to.equal(10);
      });
    });
  });
});
