import { expect } from 'chai';
import {
  getRecipientStatus,
  sortTriageList,
  getBlockedFacilityNames,
  buildBlockedItemsList,
  getBlockedTriageAlertConfig,
  getAnalyticsAlertType,
} from '../../util/blockedTriageGroupUtils';
import {
  RecipientStatus,
  Recipients,
  ParentComponent,
  BlockedTriageAlertText,
} from '../../util/constants';

const { alertTitle, alertMessage } = BlockedTriageAlertText;

describe('blockedTriageGroupUtils', () => {
  describe('getRecipientStatus', () => {
    it('returns null when recipient is null', () => {
      const recipients = { allRecipients: [], blockedRecipients: [] };
      expect(getRecipientStatus(recipients, null)).to.be.null;
    });

    it('returns NOT_ASSOCIATED when recipient is not in allRecipients', () => {
      const recipients = {
        allRecipients: [{ id: 1, name: 'Team 1' }],
        blockedRecipients: [],
      };
      const recipient = { recipientId: 999, name: 'Unknown Team' };
      expect(getRecipientStatus(recipients, recipient)).to.equal(
        RecipientStatus.NOT_ASSOCIATED,
      );
    });

    it('returns BLOCKED when recipient is in blockedRecipients', () => {
      const recipients = {
        allRecipients: [{ id: 1, name: 'Team 1' }],
        blockedRecipients: [{ id: 1, name: 'Team 1' }],
      };
      const recipient = { recipientId: 1, name: 'Team 1' };
      expect(getRecipientStatus(recipients, recipient)).to.equal(
        RecipientStatus.BLOCKED,
      );
    });

    it('returns ALLOWED when recipient is associated but not blocked', () => {
      const recipients = {
        allRecipients: [{ id: 1, name: 'Team 1' }],
        blockedRecipients: [],
      };
      const recipient = { recipientId: 1, name: 'Team 1' };
      expect(getRecipientStatus(recipients, recipient)).to.equal(
        RecipientStatus.ALLOWED,
      );
    });

    it('matches by triageGroupName when recipientId does not match', () => {
      const recipients = {
        allRecipients: [{ id: 1, name: 'Team 1' }],
        blockedRecipients: [],
      };
      const recipient = { recipientId: 999, triageGroupName: 'Team 1' };
      expect(getRecipientStatus(recipients, recipient)).to.equal(
        RecipientStatus.ALLOWED,
      );
    });
  });

  describe('sortTriageList', () => {
    it('returns empty array for null/undefined input', () => {
      expect(sortTriageList(null)).to.deep.equal([]);
      expect(sortTriageList(undefined)).to.deep.equal([]);
    });

    it('sorts alphabetically by name', () => {
      const list = [
        { name: 'Zebra Team' },
        { name: 'Alpha Team' },
        { name: 'Beta Team' },
      ];
      const sorted = sortTriageList(list);
      expect(sorted[0].name).to.equal('Alpha Team');
      expect(sorted[1].name).to.equal('Beta Team');
      expect(sorted[2].name).to.equal('Zebra Team');
    });

    it('sorts non-alphabetic names first, then alphabetic', () => {
      const list = [
        { name: 'Alpha Team' },
        { name: '###Special Team###' },
        { name: '***Another Special***' },
      ];
      const sorted = sortTriageList(list);
      // Non-alphabetic names should be sorted first (by localeCompare), then alphabetic
      // The last item should be the alphabetic one
      expect(sorted[2].name).to.equal('Alpha Team');
    });

    it('uses suggestedNameDisplay when available', () => {
      const list = [
        { name: 'Zebra', suggestedNameDisplay: 'Alpha Display' },
        { name: 'Alpha', suggestedNameDisplay: 'Zebra Display' },
      ];
      const sorted = sortTriageList(list);
      expect(sorted[0].suggestedNameDisplay).to.equal('Alpha Display');
    });
  });

  describe('getBlockedFacilityNames', () => {
    const mockEhrData = {
      '662': {
        facilityId: '662',
        vamcSystemName: 'Test Facility 1',
      },
      '636': {
        facilityId: '636',
        vamcSystemName: 'Test Facility 2',
      },
    };

    it('returns empty array for null/empty input', () => {
      expect(getBlockedFacilityNames(null, mockEhrData)).to.deep.equal([]);
      expect(getBlockedFacilityNames([], mockEhrData)).to.deep.equal([]);
    });

    it('converts station numbers to facility objects', () => {
      const result = getBlockedFacilityNames(['662'], mockEhrData);
      expect(result).to.have.length(1);
      expect(result[0].stationNumber).to.equal('662');
      expect(result[0].name).to.equal('Test Facility 1');
      expect(result[0].type).to.equal(Recipients.FACILITY);
    });

    it('filters out facilities not found in EHR data', () => {
      const result = getBlockedFacilityNames(['999', '662'], mockEhrData);
      expect(result).to.have.length(1);
      expect(result[0].stationNumber).to.equal('662');
    });
  });

  describe('buildBlockedItemsList', () => {
    it('returns empty array when no blocked items', () => {
      expect(buildBlockedItemsList([], [])).to.deep.equal([]);
      expect(buildBlockedItemsList(null, null)).to.deep.equal([]);
    });

    it('returns sorted blocked recipients when no facilities', () => {
      const recipients = [
        { name: 'Zebra Team', stationNumber: '662' },
        { name: 'Alpha Team', stationNumber: '636' },
      ];
      const result = buildBlockedItemsList(recipients, []);
      expect(result[0].name).to.equal('Alpha Team');
    });

    it('excludes teams from fully blocked facilities', () => {
      const recipients = [
        { name: 'Team at 662', stationNumber: '662' },
        { name: 'Team at 636', stationNumber: '636' },
      ];
      const facilities = [
        {
          stationNumber: '662',
          name: 'Facility 662',
          type: Recipients.FACILITY,
        },
      ];
      const result = buildBlockedItemsList(recipients, facilities);
      // Should include team at 636 and the facility 662, but not team at 662
      const hasTeamAt662 = result.some(r => r.name === 'Team at 662');
      expect(hasTeamAt662).to.be.false;
    });
  });

  describe('getBlockedTriageAlertConfig', () => {
    const baseRecipients = {
      noAssociations: false,
      allTriageGroupsBlocked: false,
      associatedBlockedTriageGroupsQty: 0,
      blockedRecipients: [],
      blockedFacilities: [],
    };

    it('returns null when associatedBlockedTriageGroupsQty is undefined', () => {
      const result = getBlockedTriageAlertConfig({
        recipients: {
          ...baseRecipients,
          associatedBlockedTriageGroupsQty: undefined,
        },
        parentComponent: ParentComponent.COMPOSE_FORM,
        ehrDataByVhaId: {},
      });
      expect(result).to.be.null;
    });

    it('returns NO_ASSOCIATIONS config when noAssociations is true', () => {
      const result = getBlockedTriageAlertConfig({
        recipients: { ...baseRecipients, noAssociations: true },
        parentComponent: ParentComponent.FOLDER_HEADER,
        ehrDataByVhaId: {},
      });
      expect(result.shouldShow).to.be.true;
      expect(result.title).to.equal(alertTitle.NO_ASSOCIATIONS);
      expect(result.message).to.equal(alertMessage.NO_ASSOCIATIONS);
    });

    it('returns ALL_TEAMS_BLOCKED config when allTriageGroupsBlocked is true', () => {
      const result = getBlockedTriageAlertConfig({
        recipients: { ...baseRecipients, allTriageGroupsBlocked: true },
        parentComponent: ParentComponent.FOLDER_HEADER,
        ehrDataByVhaId: {},
      });
      expect(result.shouldShow).to.be.true;
      expect(result.title).to.equal(alertTitle.ALL_TEAMS_BLOCKED);
      expect(result.message).to.equal(alertMessage.ALL_TEAMS_BLOCKED);
    });

    it('returns NOT_ASSOCIATED config for unassociated current recipient with no other blocked', () => {
      const result = getBlockedTriageAlertConfig({
        recipients: {
          ...baseRecipients,
          allRecipients: [{ id: 1, name: 'Other Team' }],
        },
        currentRecipient: { recipientId: 999, name: 'Missing Team' },
        parentComponent: ParentComponent.REPLY_FORM,
        ehrDataByVhaId: {},
      });
      expect(result.shouldShow).to.be.true;
      expect(result.title).to.include('Your account is no longer connected to');
      expect(result.status).to.equal(RecipientStatus.NOT_ASSOCIATED);
    });

    it('returns MULTIPLE_TEAMS_BLOCKED for unassociated current recipient with other blocked', () => {
      const result = getBlockedTriageAlertConfig({
        recipients: {
          ...baseRecipients,
          allRecipients: [{ id: 1, name: 'Other Team' }],
          blockedRecipients: [
            { id: 1, name: 'Blocked Team', stationNumber: '662' },
          ],
        },
        currentRecipient: { recipientId: 999, name: 'Missing Team' },
        parentComponent: ParentComponent.COMPOSE_FORM,
        ehrDataByVhaId: {},
      });
      expect(result.shouldShow).to.be.true;
      expect(result.title).to.equal(alertTitle.MULTIPLE_TEAMS_BLOCKED);
      expect(result.blockedList).to.have.length(2);
    });

    it('returns null for NOT_ASSOCIATED recipient when isOhMessage is true', () => {
      const result = getBlockedTriageAlertConfig({
        recipients: {
          ...baseRecipients,
          allRecipients: [],
        },
        currentRecipient: { recipientId: 999, name: 'Missing Team' },
        parentComponent: ParentComponent.REPLY_FORM,
        ehrDataByVhaId: {},
        isOhMessage: true,
      });
      expect(result).to.be.null;
    });

    it('returns BLOCKED config for blocked current recipient', () => {
      const blockedTeam = { id: 1, name: 'Blocked Team' };
      const result = getBlockedTriageAlertConfig({
        recipients: {
          ...baseRecipients,
          allRecipients: [blockedTeam],
          blockedRecipients: [blockedTeam],
        },
        currentRecipient: { recipientId: 1, name: 'Blocked Team' },
        parentComponent: ParentComponent.MESSAGE_THREAD,
        ehrDataByVhaId: {},
      });
      expect(result.shouldShow).to.be.true;
      expect(result.title).to.include("You can't send messages to");
      expect(result.status).to.equal(RecipientStatus.BLOCKED);
    });

    it('returns MULTIPLE_TEAMS_BLOCKED config when multiple teams blocked', () => {
      const result = getBlockedTriageAlertConfig({
        recipients: {
          ...baseRecipients,
          blockedRecipients: [
            { id: 1, name: 'Team 1', stationNumber: '662' },
            { id: 2, name: 'Team 2', stationNumber: '636' },
          ],
        },
        parentComponent: ParentComponent.COMPOSE_FORM,
        ehrDataByVhaId: {},
      });
      expect(result.shouldShow).to.be.true;
      expect(result.title).to.equal(alertTitle.MULTIPLE_TEAMS_BLOCKED);
      expect(result.blockedList).to.have.length(2);
    });
  });

  describe('getAnalyticsAlertType', () => {
    it('returns empty string for null/undefined title', () => {
      expect(getAnalyticsAlertType(null)).to.equal('');
      expect(getAnalyticsAlertType(undefined)).to.equal('');
    });

    it('sanitizes facility names', () => {
      const result = getAnalyticsAlertType(
        "You can't send messages to care teams at VA Facility Name",
      );
      expect(result).to.equal(
        "You can't send messages to care teams at FACILITY",
      );
    });

    it('sanitizes team names', () => {
      const result = getAnalyticsAlertType(
        "You can't send messages to Team Name",
      );
      expect(result).to.equal("You can't send messages to TG_NAME");
    });

    it('sanitizes disconnected team names', () => {
      const result = getAnalyticsAlertType(
        'Your account is no longer connected to Team Name',
      );
      expect(result).to.equal('Your account is no longer connected to TG_NAME');
    });

    it('preserves non-PII titles as-is', () => {
      expect(
        getAnalyticsAlertType(
          "You can't send messages to your care teams right now",
        ),
      ).to.equal("You can't send messages to your care teams right now");

      expect(
        getAnalyticsAlertType(
          "You can't send messages to some of your care teams",
        ),
      ).to.equal("You can't send messages to some of your care teams");
    });
  });
});
