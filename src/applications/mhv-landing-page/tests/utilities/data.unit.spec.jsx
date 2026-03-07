/* eslint-disable camelcase */
import { expect } from 'chai';
import FEATURE_FLAG_NAMES from '@department-of-veterans-affairs/platform-utilities/featureFlagNames';
import {
  countUnreadMessages,
  isLinkData,
  resolveLandingPageLinks,
} from '../../utilities/data/index';
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

    describe('resolveLandingPageLinks', () => {
      describe('paymentsLinks', () => {
        it('includes new appointments link for travel pay SMOC', () => {
          const featureToggles = {
            [FEATURE_FLAG_NAMES.travelPayPowerSwitch]: false,
          };
          const result = resolveLandingPageLinks(
            false,
            featureToggles,
            null,
            false,
          );
          const paymentsCard = result.cards.find(
            card => card.title === 'Payments',
          );
          const paymentsLinks = paymentsCard.links;

          // Should have 3 links
          expect(paymentsLinks).to.have.lengthOf(3);

          // Check the travel pay link text has been updated
          const travelPayLink = paymentsLinks.find(
            link => link.href === '/my-health/travel-pay/claims',
          );
          expect(travelPayLink).to.exist;
          expect(travelPayLink.text).to.equal(
            'Check travel reimbursement claim status',
          );

          // Check the new appointments link is the last link
          const lastLink = paymentsLinks[paymentsLinks.length - 1];
          expect(lastLink.href).to.equal('/my-health/appointments/past');
          expect(lastLink.text).to.equal(
            'Go to past appointments to file for travel pay',
          );
        });
      });
    });
  });
});
