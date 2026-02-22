/* eslint-disable camelcase */
import { expect } from 'chai';
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
      describe('spotlight links', () => {
        it('returns different spotlight links for patients vs non-patients', () => {
          const featureToggles = {};
          const { hubs, nonPatientHubs } = resolveLandingPageLinks(
            true,
            featureToggles,
            null,
            false,
          );

          // Find spotlight section in patient hubs
          const patientSpotlight = hubs.find(
            hub => hub.title === 'In the spotlight',
          );
          // Find spotlight section in non-patient hubs
          const nonPatientSpotlight = nonPatientHubs.find(
            hub => hub.title === 'In the spotlight',
          );

          expect(patientSpotlight).to.exist;
          expect(nonPatientSpotlight).to.exist;

          // Patient spotlight should have the new links
          expect(patientSpotlight.links).to.have.lengthOf(3);
          expect(patientSpotlight.links[0].text).to.equal(
            "Don't miss a message from VA",
          );
          expect(patientSpotlight.links[1].text).to.equal(
            'Travel pay: apply now on your phone',
          );
          expect(patientSpotlight.links[2].text).to.equal(
            'VA mobile apps for a healthy new year',
          );

          // Non-patient spotlight should have the existing links
          expect(nonPatientSpotlight.links).to.have.lengthOf(3);
          expect(nonPatientSpotlight.links[0].text).to.equal(
            'Medical record hold periods are changing',
          );
          expect(nonPatientSpotlight.links[1].text).to.equal(
            'Treat your pain at VA',
          );
          expect(nonPatientSpotlight.links[2].text).to.equal(
            'Managing PTSD while you age',
          );

          // Verify they are different arrays
          expect(patientSpotlight.links).to.not.deep.equal(
            nonPatientSpotlight.links,
          );
        });

        it('patient spotlight links use eauth deep-linking', () => {
          const featureToggles = {};
          const { hubs } = resolveLandingPageLinks(true, featureToggles);

          const patientSpotlight = hubs.find(
            hub => hub.title === 'In the spotlight',
          );

          // All links should contain eauth.va.gov for authenticated users
          patientSpotlight.links.forEach(link => {
            expect(link.href).to.include('eauth.va.gov');
            expect(link.href).to.include('deeplinking=');
          });
        });
      });
    });
  });
});
