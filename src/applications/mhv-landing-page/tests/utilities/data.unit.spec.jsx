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
      describe('spotlight links', () => {
        it('returns different spotlight links for patients vs non-patients', () => {
          const featureToggles = {};
          const { hubs, nonPatientHubs } = resolveLandingPageLinks(
            true,
            featureToggles,
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

          // Non-patient spotlight should have the same new links with public URLs
          expect(nonPatientSpotlight.links).to.have.lengthOf(3);
          expect(nonPatientSpotlight.links[0].text).to.equal(
            "Don't miss a message from VA",
          );
          expect(nonPatientSpotlight.links[0].href).to.include(
            'www.myhealth.va.gov',
          );
          expect(nonPatientSpotlight.links[1].text).to.equal(
            'Travel pay: apply now on your phone',
          );
          expect(nonPatientSpotlight.links[1].href).to.include(
            'www.myhealth.va.gov',
          );
          expect(nonPatientSpotlight.links[2].text).to.equal(
            'VA mobile apps for a healthy new year',
          );
          expect(nonPatientSpotlight.links[2].href).to.include(
            'www.myhealth.va.gov',
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

      describe('paymentsLinks', () => {
        it('includes new appointments link when travelPaySubmitMileageExpense is enabled', () => {
          const featureToggles = {
            [FEATURE_FLAG_NAMES.travelPaySubmitMileageExpense]: true,
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

        it('includes new appointments link when travelPayPowerSwitch is enabled', () => {
          const featureToggles = {
            [FEATURE_FLAG_NAMES.travelPaySubmitMileageExpense]: false,
            [FEATURE_FLAG_NAMES.travelPayPowerSwitch]: true,
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

          // Should have 4 links (copay, travel pay, BTSSS, appointments)
          expect(paymentsLinks).to.have.lengthOf(4);

          // Check the travel pay link text
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

        it('includes new appointments link when both feature flags are disabled', () => {
          const featureToggles = {
            [FEATURE_FLAG_NAMES.travelPaySubmitMileageExpense]: false,
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

          // Should have 3 links (copay, BTSSS, appointments)
          expect(paymentsLinks).to.have.lengthOf(3);

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
