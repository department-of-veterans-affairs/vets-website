import { waitFor } from '@testing-library/react';
import { expect } from 'chai';
import sinon from 'sinon';
import {
  folderPathByFolderId,
  getLastSentMessage,
  getSize,
  navigateToFolderByFolderId,
  navigateToFoldersPage,
  setCaretToPos,
  setUnsavedNavigationError,
  titleCase,
  updateDrafts,
  findAllowedFacilities,
  handleRemoveAttachmentButtonId,
  handleRemoveAttachmentModalId,
  getLastPathName,
  formatPathName,
  dateFormat,
  threadsDateFormat,
  sortRecipients,
  decodeHtmlEntities,
  isOlderThan,
  isValidDateValue,
  isCustomFolder,
  handleHeader,
  getPageTitle,
  updateMessageInThread,
  convertPathNameToTitleCase,
  messageSignatureFormatter,
  resetUserSession,
  checkTriageGroupAssociation,
  updateTriageGroupRecipientStatus,
  formatRecipient,
  findBlockedFacilities,
  getStationNumberFromRecipientId,
  findActiveDraftFacility,
  sortTriageList,
  scrollTo,
  scrollToTop,
  scrollIfFocusedAndNotInView,
  buildRxRenewalMessageBody,
} from '../../util/helpers';
import {
  DefaultFolders as Folders,
  Paths,
  ErrorMessages,
  RecipientStatus,
  Recipients,
} from '../../util/constants';
import threadWithDraftResponse from '../fixtures/message-thread-with-draft-response.json';

describe('MHV Secure Messaging helpers', () => {
  it('folderPathByFolderId should return correct path', () => {
    expect(folderPathByFolderId(Folders.INBOX.id)).to.equal(Paths.INBOX);
    expect(folderPathByFolderId(Folders.DRAFTS.id)).to.equal(Paths.DRAFTS);
    expect(folderPathByFolderId(Folders.SENT.id)).to.equal(Paths.SENT);
    expect(folderPathByFolderId(Folders.DELETED.id)).to.equal(Paths.DELETED);
    const folderId = '1234';
    expect(folderPathByFolderId(folderId)).to.equal(
      `${Paths.FOLDERS}${folderId}/`,
    );
    expect(folderPathByFolderId(null)).to.equal('/');
  });

  it('navigateToFolderByFolderId should redirect to correct path', () => {
    const mockHistory = {
      push: sinon.spy(),
    };
    const folderId = '123';
    navigateToFolderByFolderId(folderId, mockHistory);
    sinon.assert.calledWith(mockHistory.push, '/folders/123/');
  });

  it('navigateToFoldersPage should redirect to correct path', () => {
    const mockHistory = {
      push: sinon.spy(),
    };
    navigateToFoldersPage(mockHistory);
    sinon.assert.calledWith(mockHistory.push, '/folders/');
  });

  it('titleCase should return correct title case', () => {
    expect(titleCase('test')).to.equal('Test');
  });

  it('getLastSentMessage should return correct last sent message', () => {
    expect(
      getLastSentMessage(threadWithDraftResponse.data).attributes.messageId,
    ).to.equal(3002892);
  });

  it('setCaretToPos should set the caret to the correct position', () => {
    const input = document.createElement('input');
    input.value = 'test';
    document.body.appendChild(input);
    input.focus();
    // Node v22 sets caret to end by default, so set it to 0 explicitly
    input.setSelectionRange(0, 0);
    expect(input.selectionStart).to.equal(0);
    expect(input.selectionEnd).to.equal(0);
    setCaretToPos(input, 2);
    expect(input.selectionStart).to.equal(2);
    expect(input.selectionEnd).to.equal(2);
    setCaretToPos(input, 0);
    expect(input.selectionStart).to.equal(0);
    expect(input.selectionEnd).to.equal(0);
  });

  it('setUnsavedNavigationError should set the correct unable to save draft error', () => {
    const setNavigationErrorSpy = sinon.spy();
    const navigationError = {
      ...ErrorMessages.ComposeForm.UNABLE_TO_SAVE_DRAFT_ATTACHMENT,
    };
    setUnsavedNavigationError(
      ErrorMessages.Navigation.UNABLE_TO_SAVE_DRAFT_ATTACHMENT_ERROR,
      setNavigationErrorSpy,
      ErrorMessages,
    );
    sinon.assert.calledWith(setNavigationErrorSpy, navigationError);
  });

  it('setUnsavedNavigationError should set the correct unable to save error', () => {
    const setNavigationError = sinon.spy();
    const navigationError = {
      title: ErrorMessages.ComposeForm.UNABLE_TO_SAVE.title,
      p1: ErrorMessages.ComposeForm.UNABLE_TO_SAVE.p1,
      confirmButtonText:
        ErrorMessages.ComposeForm.UNABLE_TO_SAVE.confirmButtonText,
      cancelButtonText:
        ErrorMessages.ComposeForm.UNABLE_TO_SAVE.cancelButtonText,
    };
    setUnsavedNavigationError(
      ErrorMessages.Navigation.UNABLE_TO_SAVE_ERROR,
      setNavigationError,
      ErrorMessages,
    );
    sinon.assert.calledWith(setNavigationError, navigationError);
  });

  it('updateDrafts should update drafts', () => {
    const drafts = [
      {
        id: 1,
        attributes: {
          message: 'existing array draft',
        },
      },
    ];
    const draft = {
      0: {
        id: 1,
        message: 'converted to array draft',
      },
    };
    const existingArrDraft = updateDrafts(drafts);
    expect(existingArrDraft).to.eql(drafts);

    const convertedArrDraft = updateDrafts(draft);
    expect(convertedArrDraft).to.eql([draft[0]]);
  });

  describe('getSize function', () => {
    it('should return size in bytes for values less than 1024', () => {
      expect(getSize(0)).to.equal('0 B');
      expect(getSize(1)).to.equal('1 B');
      expect(getSize(512)).to.equal('512 B');
      expect(getSize(1023)).to.equal('1023 B');
    });

    it('should return size in KB for values between 1024 and 1048575', () => {
      expect(getSize(1024)).to.equal('1.0 KB');
      expect(getSize(1536)).to.equal('1.5 KB');
      expect(getSize(524288)).to.equal('512.0 KB');
      expect(getSize(1048575)).to.equal('1024.0 KB');
    });

    it('should return size in MB for values greater than or equal to 1048576', () => {
      expect(getSize(1048576)).to.equal('1.0 MB');
      expect(getSize(2097152)).to.equal('2.0 MB');
      expect(getSize(3145728)).to.equal('3.0 MB');
    });

    it('should handle exact boundary values correctly (1024 bytes = 1.0 KB, 1048576 bytes = 1.0 MB)', () => {
      expect(getSize(1024)).to.equal('1.0 KB');
      expect(getSize(1048576)).to.equal('1.0 MB');
    });

    it('should round decimal values to one decimal place for KB and MB', () => {
      expect(getSize(1536)).to.equal('1.5 KB'); // 1536 / 1024 = 1.5
      expect(getSize(1572864)).to.equal('1.5 MB'); // 1572864 / 1048576 = 1.5
      expect(getSize(2621440)).to.equal('2.5 MB'); // 2621440 / 1048576 = 2.5
    });

    it('should handle zero bytes correctly', () => {
      expect(getSize(0)).to.equal('0 B');
    });

    it('should handle large values in MB without overflow', () => {
      expect(getSize(1073741824)).to.equal('1024.0 MB'); // 1 GB in bytes
      expect(getSize(2147483648)).to.equal('2048.0 MB'); // 2 GB in bytes
    });

    it('should handle negative values as bytes (fallback behavior)', () => {
      expect(getSize(-1)).to.equal('-1 B');
      expect(getSize(-1024)).to.equal('-1024 B');
    });
  });

  describe('findAllowedFacilities function', () => {
    it('should return empty arrays for empty recipients', () => {
      const result = findAllowedFacilities([]);
      expect(result).to.eql({
        allowedVistaFacilities: [],
        allowedOracleFacilities: [],
      });
    });

    it('should add to allowedVistaFacilities when blockedStatus is false and ohTriageGroup is false', () => {
      const recipients = [
        {
          stationNumber: '123',
          blockedStatus: false,
          ohTriageGroup: false,
        },
      ];
      const result = findAllowedFacilities(recipients);
      expect(result).to.eql({
        allowedVistaFacilities: ['123'],
        allowedOracleFacilities: [],
      });
    });

    it('should add to allowedOracleFacilities when blockedStatus is false and ohTriageGroup is true', () => {
      const recipients = [
        {
          stationNumber: '456',
          blockedStatus: false,
          ohTriageGroup: true,
        },
      ];
      const result = findAllowedFacilities(recipients);
      expect(result).to.eql({
        allowedVistaFacilities: [],
        allowedOracleFacilities: ['456'],
      });
    });

    it('should not add when blockedStatus is true', () => {
      const recipients = [
        {
          stationNumber: '789',
          blockedStatus: true,
          ohTriageGroup: false,
        },
        {
          stationNumber: '101',
          blockedStatus: true,
          ohTriageGroup: true,
        },
      ];
      const result = findAllowedFacilities(recipients);
      expect(result).to.eql({
        allowedVistaFacilities: [],
        allowedOracleFacilities: [],
      });
    });

    it('should handle multiple recipients with mixed statuses', () => {
      const recipients = [
        {
          stationNumber: '123',
          blockedStatus: false,
          ohTriageGroup: false,
        },
        {
          stationNumber: '456',
          blockedStatus: false,
          ohTriageGroup: true,
        },
        {
          stationNumber: '789',
          blockedStatus: true,
          ohTriageGroup: false,
        },
        {
          stationNumber: '101',
          blockedStatus: false,
          ohTriageGroup: false,
        },
      ];
      const result = findAllowedFacilities(recipients);
      expect(result).to.eql({
        allowedVistaFacilities: ['123', '101'],
        allowedOracleFacilities: ['456'],
      });
    });

    it('should deduplicate stationNumbers using Sets', () => {
      const recipients = [
        {
          stationNumber: '123',
          blockedStatus: false,
          ohTriageGroup: false,
        },
        {
          stationNumber: '123',
          blockedStatus: false,
          ohTriageGroup: false,
        },
        {
          stationNumber: '456',
          blockedStatus: false,
          ohTriageGroup: true,
        },
        {
          stationNumber: '456',
          blockedStatus: false,
          ohTriageGroup: true,
        },
      ];
      const result = findAllowedFacilities(recipients);
      expect(result).to.eql({
        allowedVistaFacilities: ['123'],
        allowedOracleFacilities: ['456'],
      });
    });

    it('should handle recipients with missing properties gracefully', () => {
      const recipients = [
        {
          stationNumber: '123',
          blockedStatus: false,
          // ohTriageGroup missing, should default to false in logic
        },
      ];
      const result = findAllowedFacilities(recipients);
      expect(result).to.eql({
        allowedVistaFacilities: ['123'],
        allowedOracleFacilities: [],
      });
    });
  });

  describe('handleRemoveAttachmentButtonId', () => {
    it('should return button id with lastModified when id is undefined', () => {
      const file = { lastModified: 1234567890 };
      const result = handleRemoveAttachmentButtonId(file);
      expect(result).to.equal('remove-attachment-button-1234567890');
    });

    it('should return button id with file id when id is defined', () => {
      const file = { id: 'abc123', lastModified: 1234567890 };
      const result = handleRemoveAttachmentButtonId(file);
      expect(result).to.equal('remove-attachment-button-abc123');
    });
  });

  describe('handleRemoveAttachmentModalId', () => {
    it('should return modal id with lastModified when id is undefined', () => {
      const file = { lastModified: 1234567890 };
      const result = handleRemoveAttachmentModalId(file);
      expect(result).to.equal('remove-attachment-modal-1234567890');
    });

    it('should return modal id with file id when id is defined', () => {
      const file = { id: 'abc123', lastModified: 1234567890 };
      const result = handleRemoveAttachmentModalId(file);
      expect(result).to.equal('remove-attachment-modal-abc123');
    });
  });

  describe('getLastPathName', () => {
    it('should return capitalized last path name', () => {
      expect(getLastPathName('/messages/inbox')).to.equal('Inbox');
      expect(getLastPathName('/messages/sent/')).to.equal('Sent');
      expect(getLastPathName('/folders/123')).to.equal('123');
    });

    it('should handle single path segment', () => {
      expect(getLastPathName('/inbox')).to.equal('Inbox');
    });

    it('should handle paths with trailing slash', () => {
      expect(getLastPathName('/messages/drafts/')).to.equal('Drafts');
    });
  });

  describe('formatPathName', () => {
    it('should return custom string for root path', () => {
      expect(formatPathName('/', 'Home')).to.equal('Home');
    });

    it('should return capitalized last path part', () => {
      expect(formatPathName('/messages/inbox')).to.equal('Inbox');
      expect(formatPathName('/messages/sent')).to.equal('Sent');
    });

    it('should handle empty parts array', () => {
      expect(formatPathName('/', 'Messages')).to.equal('Messages');
    });
  });

  describe('dateFormat', () => {
    it('should format date with default format', () => {
      const timestamp = '2024-01-15T10:30:00Z';
      const result = dateFormat(timestamp);
      expect(result).to.include('January 15, 2024');
      expect(result).to.match(/\d{1,2}:\d{2} [ap]\.m\./);
    });

    it('should format date with custom format', () => {
      const timestamp = '2024-01-15T10:30:00Z';
      const result = dateFormat(timestamp, 'YYYY-MM-DD');
      expect(result).to.equal('2024-01-15');
    });

    it('should use custom meridiem formatting', () => {
      const timestamp = '2024-01-15T08:30:00Z';
      const result = dateFormat(timestamp);
      expect(result).to.match(/[ap]\.m\./);
    });
  });

  describe('threadsDateFormat', () => {
    it('should format date with at separator', () => {
      const timestamp = '2024-01-15T10:30:00Z';
      const result = threadsDateFormat(timestamp);
      expect(result).to.include(' at ');
      expect(result).to.include('January 15, 2024');
    });

    it('should format date with custom format', () => {
      const timestamp = '2024-01-15T10:30:00Z';
      const result = threadsDateFormat(timestamp, 'YYYY-MM-DD');
      expect(result).to.equal('2024-01-15');
    });
  });

  describe('sortRecipients', () => {
    it('should sort recipients alphabetically', () => {
      const recipients = [
        { name: 'Zebra Team' },
        { name: 'Alpha Team' },
        { name: 'Beta Team' },
      ];
      const result = sortRecipients(recipients);
      expect(result[0].name).to.equal('Alpha Team');
      expect(result[1].name).to.equal('Beta Team');
      expect(result[2].name).to.equal('Zebra Team');
    });

    it('should handle empty array', () => {
      const result = sortRecipients([]);
      expect(result).to.eql([]);
    });

    it('should sort non-alphabetic names', () => {
      const recipients = [
        { name: '123 Team' },
        { name: 'Alpha Team' },
        { name: '456 Team' },
      ];
      const result = sortRecipients(recipients);
      // The sorting places names starting with numbers first due to locale compare
      expect(result.length).to.equal(3);
      expect(result.some(r => r.name === 'Alpha Team')).to.equal(true);
    });
  });

  describe('decodeHtmlEntities', () => {
    it('should decode HTML entities', () => {
      expect(decodeHtmlEntities('&lt;div&gt;')).to.equal('<div>');
      expect(decodeHtmlEntities('&amp;')).to.equal('&');
      expect(decodeHtmlEntities('&quot;')).to.equal('"');
    });

    it('should handle plain text', () => {
      expect(decodeHtmlEntities('plain text')).to.equal('plain text');
    });

    it('should sanitize malicious content', () => {
      const result = decodeHtmlEntities('<script>alert("xss")</script>');
      expect(result).to.not.include('<script>');
    });
  });

  describe('isOlderThan', () => {
    it('should return true when timestamp is older than specified days', () => {
      const oldDate = new Date();
      oldDate.setDate(oldDate.getDate() - 50);
      expect(isOlderThan(oldDate.toISOString(), 45)).to.equal(true);
    });

    it('should return false when timestamp is newer than specified days', () => {
      const recentDate = new Date();
      recentDate.setDate(recentDate.getDate() - 30);
      expect(isOlderThan(recentDate.toISOString(), 45)).to.equal(false);
    });

    it('should return false when timestamp equals specified days', () => {
      const exactDate = new Date();
      exactDate.setDate(exactDate.getDate() - 45);
      expect(isOlderThan(exactDate.toISOString(), 45)).to.equal(false);
    });
  });

  describe('isCustomFolder', () => {
    it('should return true for positive folder ids', () => {
      expect(isCustomFolder(1)).to.equal(true);
      expect(isCustomFolder(100)).to.equal(true);
    });

    it('should return false for zero or negative folder ids', () => {
      expect(isCustomFolder(0)).to.equal(false);
      expect(isCustomFolder(-1)).to.equal(false);
      expect(isCustomFolder(-2)).to.equal(false);
    });
  });

  describe('handleHeader', () => {
    it('should return correct header for inbox folder', () => {
      const result = handleHeader({ folderId: 0, name: 'Inbox' });
      expect(result.folderName).to.equal('Inbox');
      expect(result.ddTitle).to.equal('Messages: Inbox h1');
      expect(result.ddPrivacy).to.equal('allow');
    });

    it('should return correct header for custom folder', () => {
      const result = handleHeader({ folderId: 123, name: 'My Folder' });
      expect(result.folderName).to.equal('My Folder');
      expect(result.ddTitle).to.equal('Custom Folder h1');
      expect(result.ddPrivacy).to.equal('mask');
    });

    it('should return correct header for sent folder', () => {
      const result = handleHeader({ folderId: -1, name: 'Sent' });
      expect(result.folderName).to.equal('Sent');
      expect(result.ddTitle).to.equal('Messages: Sent h1');
      expect(result.ddPrivacy).to.equal('allow');
    });
  });

  describe('getPageTitle', () => {
    it('should return correct title for inbox folder', () => {
      const result = getPageTitle({ folderName: 'Inbox', pathname: '/inbox/' });
      expect(result).to.include('Messages: Inbox');
    });

    it('should return correct title for custom folder', () => {
      const result = getPageTitle({
        folderName: 'My Folder',
        pathname: '/folders/123/',
      });
      expect(result).to.include('Messages: More folders');
    });

    it('should return correct title for folders page', () => {
      const result = getPageTitle({ pathname: Paths.FOLDERS });
      expect(result).to.include('More folders');
    });
  });

  describe('updateMessageInThread', () => {
    it('should update message in thread with new data', () => {
      const thread = [
        {
          messageId: 123,
          threadId: 1,
          folderId: 0,
          subject: 'Test',
          body: 'Old body',
        },
      ];
      const response = {
        data: {
          attributes: {
            messageId: 123,
            subject: 'Test',
            body: 'New body',
          },
        },
        included: [
          {
            id: 'att1',
            links: { download: 'http://example.com/att1' },
            attributes: { name: 'file.pdf' },
          },
        ],
      };

      const result = updateMessageInThread(thread, response);
      expect(result[0].body).to.equal('New body');
      expect(result[0].preloaded).to.equal(true);
      expect(result[0].attachments).to.have.lengthOf(1);
      expect(result[0].attachments[0].name).to.equal('file.pdf');
    });

    it('should preserve existing message when id does not match', () => {
      const thread = [{ messageId: 456, body: 'Original' }];
      const response = {
        data: { attributes: { messageId: 123, body: 'Updated' } },
      };

      const result = updateMessageInThread(thread, response);
      expect(result[0].body).to.equal('Original');
    });
  });

  describe('convertPathNameToTitleCase', () => {
    it('should convert underscore separated path to title case', () => {
      expect(convertPathNameToTitleCase('/new_message')).to.equal(
        'New Message',
      );
      expect(convertPathNameToTitleCase('/draft_reply')).to.equal(
        'Draft Reply',
      );
    });

    it('should remove slashes and trim whitespace', () => {
      expect(convertPathNameToTitleCase('/test_path/')).to.equal('Test Path');
    });
  });

  describe('messageSignatureFormatter', () => {
    it('should format signature when includeSignature is true', () => {
      const signature = {
        includeSignature: true,
        signatureName: 'John Doe',
        signatureTitle: 'Veteran',
      };
      const result = messageSignatureFormatter(signature);
      expect(result).to.equal('\n\n\nJohn Doe\nVeteran');
    });

    it('should return null when includeSignature is false', () => {
      const signature = {
        includeSignature: false,
        signatureName: 'John Doe',
        signatureTitle: 'Veteran',
      };
      const result = messageSignatureFormatter(signature);
      expect(result).to.equal(null);
    });

    it('should return null when signature object is null', () => {
      const result = messageSignatureFormatter(null);
      expect(result).to.equal(null);
    });
  });

  describe('resetUserSession', () => {
    beforeEach(() => {
      localStorage.clear();
    });

    afterEach(() => {
      localStorage.clear();
    });

    it('should set localStorage values after timeout', async () => {
      const localStorageValues = { testKey: 'testValue' };
      const result = resetUserSession(localStorageValues);

      expect(result.signOutMessage).to.equal('non-empty string');
      expect(result.timeOutId).to.exist;

      await waitFor(
        () => {
          expect(localStorage.getItem('testKey')).to.equal('testValue');
        },
        { timeout: 1500 },
      );
      clearTimeout(result.timeOutId);
    });

    it('should not overwrite existing localStorage values', async () => {
      localStorage.setItem('existingKey', 'existingValue');
      const localStorageValues = { existingKey: 'newValue' };
      const result = resetUserSession(localStorageValues);

      await waitFor(
        () => {
          expect(localStorage.getItem('existingKey')).to.equal('existingValue');
        },
        { timeout: 1500 },
      );
      clearTimeout(result.timeOutId);
    });
  });

  describe('checkTriageGroupAssociation', () => {
    it('should match by recipient id', () => {
      const tempRecipient = { recipientId: 123 };
      const recipient = { id: 123, name: 'Team A' };
      const result = checkTriageGroupAssociation(tempRecipient)(recipient);
      expect(result).to.equal(true);
    });

    it('should match by name', () => {
      const tempRecipient = { name: 'Team A' };
      const recipient = { id: 456, name: 'Team A' };
      const result = checkTriageGroupAssociation(tempRecipient)(recipient);
      expect(result).to.equal(true);
    });

    it('should match by triageGroupName', () => {
      const tempRecipient = { triageGroupName: 'Team A' };
      const recipient = { id: 456, name: 'Team A' };
      const result = checkTriageGroupAssociation(tempRecipient)(recipient);
      expect(result).to.equal(true);
    });

    it('should not match when no fields match', () => {
      const tempRecipient = { recipientId: 123, name: 'Team A' };
      const recipient = { id: 456, name: 'Team B' };
      const result = checkTriageGroupAssociation(tempRecipient)(recipient);
      expect(result).to.equal(false);
    });
  });

  describe('updateTriageGroupRecipientStatus', () => {
    it('should set status to BLOCKED when recipient is blocked', () => {
      const recipients = {
        blockedRecipients: [{ id: 123, name: 'Team A' }],
        allRecipients: [{ id: 123, name: 'Team A' }],
      };
      const tempRecipient = { recipientId: 123, name: 'Team A' };
      const result = updateTriageGroupRecipientStatus(
        recipients,
        tempRecipient,
      );

      expect(result.isBlocked).to.equal(true);
      expect(result.isAssociated).to.equal(true);
      expect(result.formattedRecipient.status).to.equal(
        RecipientStatus.BLOCKED,
      );
    });

    it('should set status to NOT_ASSOCIATED when recipient is not associated', () => {
      const recipients = {
        blockedRecipients: [],
        allRecipients: [],
      };
      const tempRecipient = { recipientId: 123, name: 'Team A' };
      const result = updateTriageGroupRecipientStatus(
        recipients,
        tempRecipient,
      );

      expect(result.isBlocked).to.equal(false);
      expect(result.isAssociated).to.equal(false);
      expect(result.formattedRecipient.status).to.equal(
        RecipientStatus.NOT_ASSOCIATED,
      );
    });

    it('should set status to ALLOWED when recipient is associated and not blocked', () => {
      const recipients = {
        blockedRecipients: [],
        allRecipients: [{ id: 123, name: 'Team A' }],
      };
      const tempRecipient = { recipientId: 123, name: 'Team A' };
      const result = updateTriageGroupRecipientStatus(
        recipients,
        tempRecipient,
      );

      expect(result.isBlocked).to.equal(false);
      expect(result.isAssociated).to.equal(true);
      expect(result.formattedRecipient.status).to.equal(
        RecipientStatus.ALLOWED,
      );
    });
  });

  describe('formatRecipient', () => {
    it('should format recipient with blocked status', () => {
      const recipient = {
        triageTeamId: 123,
        name: 'Team A',
        blockedStatus: true,
      };
      const result = formatRecipient(recipient);

      expect(result.id).to.equal(123);
      expect(result.type).to.equal(Recipients.CARE_TEAM);
      expect(result.status).to.equal(RecipientStatus.BLOCKED);
    });

    it('should format recipient with allowed status', () => {
      const recipient = {
        triageTeamId: 456,
        name: 'Team B',
        blockedStatus: false,
      };
      const result = formatRecipient(recipient);

      expect(result.id).to.equal(456);
      expect(result.type).to.equal(Recipients.CARE_TEAM);
      expect(result.status).to.equal(RecipientStatus.ALLOWED);
    });
  });

  describe('findBlockedFacilities', () => {
    it('should identify fully blocked facilities', () => {
      const recipients = [
        { attributes: { stationNumber: '123', blockedStatus: true } },
        { attributes: { stationNumber: '123', blockedStatus: true } },
        { attributes: { stationNumber: '456', blockedStatus: false } },
      ];
      const result = findBlockedFacilities(recipients);

      expect(result.fullyBlockedFacilities).to.include('123');
      expect(result.fullyBlockedFacilities).to.not.include('456');
      expect(result.allFacilities).to.include('123');
      expect(result.allFacilities).to.include('456');
    });

    it('should not mark facility as fully blocked if any team is allowed', () => {
      const recipients = [
        { attributes: { stationNumber: '123', blockedStatus: true } },
        { attributes: { stationNumber: '123', blockedStatus: false } },
      ];
      const result = findBlockedFacilities(recipients);

      expect(result.fullyBlockedFacilities).to.not.include('123');
    });

    it('should handle empty recipients array', () => {
      const result = findBlockedFacilities([]);
      expect(result.fullyBlockedFacilities).to.eql([]);
      expect(result.allFacilities).to.eql([]);
    });
  });

  describe('getStationNumberFromRecipientId', () => {
    it('should return station number for matching recipient', () => {
      const recipients = [
        { triageTeamId: 123, stationNumber: '456' },
        { triageTeamId: 789, stationNumber: '012' },
      ];
      const result = getStationNumberFromRecipientId(123, recipients);
      expect(result).to.equal('456');
    });

    it('should return null when recipient not found', () => {
      const recipients = [{ triageTeamId: 123, stationNumber: '456' }];
      const result = getStationNumberFromRecipientId(999, recipients);
      expect(result).to.equal(null);
    });

    it('should return null when recipients is null or undefined', () => {
      expect(getStationNumberFromRecipientId(123, null)).to.equal(null);
      expect(getStationNumberFromRecipientId(123, undefined)).to.equal(null);
    });
  });

  describe('findActiveDraftFacility', () => {
    it('should return facility matching vhaId', () => {
      const facilities = [
        { vhaId: '123', name: 'Facility A' },
        { vhaId: '456', name: 'Facility B' },
      ];
      const result = findActiveDraftFacility('123', facilities);
      expect(result.name).to.equal('Facility A');
    });

    it('should return null when facility not found', () => {
      const facilities = [{ vhaId: '123', name: 'Facility A' }];
      const result = findActiveDraftFacility('999', facilities);
      expect(result).to.equal(null);
    });
  });

  describe('sortTriageList', () => {
    it('should sort list by name alphabetically', () => {
      const list = [
        { name: 'Zebra Team' },
        { name: 'Alpha Team' },
        { name: 'Beta Team' },
      ];
      const result = sortTriageList(list);
      expect(result[0].name).to.equal('Alpha Team');
      expect(result[1].name).to.equal('Beta Team');
      expect(result[2].name).to.equal('Zebra Team');
    });

    it('should handle null or undefined list', () => {
      expect(sortTriageList(null)).to.eql([]);
      expect(sortTriageList(undefined)).to.eql([]);
    });

    it('should handle empty list', () => {
      expect(sortTriageList([])).to.eql([]);
    });
  });

  describe('scrollTo', () => {
    it('should not throw error when element is null', () => {
      expect(() => {
        scrollTo(null);
      }).to.not.throw();
    });

    it('should not throw error when element is undefined', () => {
      expect(() => {
        scrollTo(undefined);
      }).to.not.throw();
    });

    it('should accept behavior parameter', () => {
      const element = document.createElement('div');
      expect(() => {
        scrollTo(element, 'auto');
      }).to.not.throw();
    });
  });

  describe('scrollToTop', () => {
    it('should not throw error when called', () => {
      expect(() => {
        scrollToTop();
      }).to.not.throw();
    });
  });

  describe('scrollIfFocusedAndNotInView', () => {
    it('should not throw error when no element is focused', () => {
      expect(() => {
        scrollIfFocusedAndNotInView();
      }).to.not.throw();
    });

    it('should accept offset parameter', () => {
      const element = document.createElement('div');
      document.body.appendChild(element);
      element.focus();

      expect(() => {
        scrollIfFocusedAndNotInView(100);
      }).to.not.throw();

      document.body.removeChild(element);
    });

    it('should handle when element is in view', () => {
      const element = document.createElement('button');
      document.body.appendChild(element);
      element.focus();

      expect(() => {
        scrollIfFocusedAndNotInView(0);
      }).to.not.throw();

      document.body.removeChild(element);
    });
  });

  describe('buildRxRenewalMessageBody', () => {
    const mockRx = {
      prescriptionName: 'Lisinopril 10mg',
      prescriptionNumber: '1234567890',
      providerFirstName: 'Dr.',
      providerLastName: 'Smith',
      refillRemaining: 2,
      expirationDate: '2024-12-31',
      reason: 'Refill needed',
      quantity: '30 tablets',
      sortedDispensedDate: '2023-08-04',
      sig: 'Take one tablet by mouth daily',
    };

    it('should return message body with empty values when rxError is true', () => {
      const result = buildRxRenewalMessageBody(mockRx, true);

      expect(result).to.include('Medication name, strength, and form:');
      expect(result).to.include('Prescription number:');
      expect(result).to.include('Instructions:');
      expect(result).to.include('Provider who prescribed it:');
      expect(result).to.include('Number of refills left:');
      expect(result).to.include('Prescription expiration date:');
      expect(result).to.include('Reason for use:');
      expect(result).to.include('Last filled on:');
      expect(result).to.include('Quantity:');
      expect(result).to.not.include('Lisinopril 10mg');
      expect(result).to.not.include('1234567890');
      expect(result).to.not.include('Take one tablet by mouth daily');
      expect(result).to.not.include('Dr. Smith');
      expect(result).to.not.include('2');
      expect(result).to.not.include('December 31, 2024');
      expect(result).to.not.include('Refill needed');
      expect(result).to.not.include('30 tablets');
      expect(result).to.not.include('August 4, 2023');
    });

    it('should format message body correctly with valid rx data when rxError is false', () => {
      const result = buildRxRenewalMessageBody(mockRx, false);

      expect(result).to.include(
        'Medication name, strength, and form: Lisinopril 10mg',
      );
      expect(result).to.include('Prescription number: 1234567890');
      expect(result).to.include('Instructions: Take one tablet by mouth daily');
      expect(result).to.include('Provider who prescribed it: Dr. Smith');
      expect(result).to.include('Number of refills left: 2');
      expect(result).to.include(
        'Prescription expiration date: December 31, 2024',
      );
      expect(result).to.include('Reason for use: Refill needed');
      expect(result).to.include('Quantity: 30 tablets');
      expect(result).to.include('Last filled on: August 4, 2023');
    });

    it('should handle missing provider names and show placeholder', () => {
      const rxWithoutProvider = {
        ...mockRx,
        providerFirstName: null,
        providerLastName: null,
      };
      const result = buildRxRenewalMessageBody(rxWithoutProvider, false);

      expect(result).to.include(
        'Provider who prescribed it: Provider name not available',
      );
    });

    it('should handle partial provider names', () => {
      const rxWithPartialProvider = {
        ...mockRx,
        providerFirstName: 'Dr.',
        providerLastName: null,
      };
      const result = buildRxRenewalMessageBody(rxWithPartialProvider, false);

      expect(result).to.include('Provider who prescribed it: Dr.');
    });

    it('should handle numeric refillRemaining', () => {
      const rxWithNumericRefills = {
        ...mockRx,
        refillRemaining: 5,
      };
      const result = buildRxRenewalMessageBody(rxWithNumericRefills, false);

      expect(result).to.include('Number of refills left: 5');
    });

    it('should handle string refillRemaining', () => {
      const rxWithStringRefills = {
        ...mockRx,
        refillRemaining: '3',
      };
      const result = buildRxRenewalMessageBody(rxWithStringRefills, false);

      expect(result).to.include('Number of refills left: 3');
    });

    it('should handle invalid refillRemaining and show placeholder', () => {
      const rxWithInvalidRefills = {
        ...mockRx,
        refillRemaining: null,
      };
      const result = buildRxRenewalMessageBody(rxWithInvalidRefills, false);

      expect(result).to.include(
        'Number of refills left: Number of refills left not available',
      );
    });

    it('should handle zero refillRemaining', () => {
      const rxWithZeroRefills = {
        ...mockRx,
        refillRemaining: 0,
      };
      const result = buildRxRenewalMessageBody(rxWithZeroRefills, false);

      expect(result).to.include('Number of refills left: 0');
    });

    it('should handle empty string refillRemaining and show placeholder', () => {
      const rxWithEmptyRefills = {
        ...mockRx,
        refillRemaining: '',
      };
      const result = buildRxRenewalMessageBody(rxWithEmptyRefills, false);

      expect(result).to.include(
        'Number of refills left: Number of refills left not available',
      );
    });

    it('should format expiration date correctly', () => {
      const rxWithDate = {
        ...mockRx,
        expirationDate: '2023-06-15',
      };
      const result = buildRxRenewalMessageBody(rxWithDate, false);

      expect(result).to.include('Prescription expiration date: June 15, 2023');
    });

    it('should handle missing expiration date and show placeholder', () => {
      const rxWithInvalidDate = {
        ...mockRx,
        expirationDate: null,
      };
      const result = buildRxRenewalMessageBody(rxWithInvalidDate, false);

      expect(result).to.include(
        'Prescription expiration date: Date not available',
      );
    });

    it('should handle empty expiration date and show placeholder', () => {
      const rxWithEmptyDate = {
        ...mockRx,
        expirationDate: '',
      };
      const result = buildRxRenewalMessageBody(rxWithEmptyDate, false);

      expect(result).to.include(
        'Prescription expiration date: Date not available',
      );
    });

    it('should handle missing dispensed date and show placeholder', () => {
      const rxWithInvalidDate = {
        ...mockRx,
        sortedDispensedDate: null,
      };
      const result = buildRxRenewalMessageBody(rxWithInvalidDate, false);

      expect(result).to.include('Last filled on: Not filled yet');
    });

    it('should handle empty dispensed date and show placeholder', () => {
      const rxWithEmptyDate = {
        ...mockRx,
        sortedDispensedDate: '',
      };
      const result = buildRxRenewalMessageBody(rxWithEmptyDate, false);

      expect(result).to.include('Last filled on: Not filled yet');
    });

    it('should handle null rx object and show all placeholders', () => {
      const result = buildRxRenewalMessageBody(null, false);

      expect(result).to.include('Medication name, strength, and form:');
      expect(result).to.include(
        'Prescription number: Prescription number not available',
      );
      expect(result).to.include('Instructions: Instructions not available');
      expect(result).to.include(
        'Provider who prescribed it: Provider name not available',
      );
      expect(result).to.include(
        'Number of refills left: Number of refills left not available',
      );
      expect(result).to.include(
        'Prescription expiration date: Date not available',
      );
      expect(result).to.include('Last filled on: Not filled yet');
      expect(result).to.include('Reason for use: Reason for use not available');
      expect(result).to.include('Quantity: Quantity not available');
    });

    it('should handle undefined rx object and show all placeholders', () => {
      const result = buildRxRenewalMessageBody(undefined, false);

      expect(result).to.include('Medication name, strength, and form:');
      expect(result).to.include(
        'Prescription number: Prescription number not available',
      );
      expect(result).to.include('Instructions: Instructions not available');
      expect(result).to.include(
        'Provider who prescribed it: Provider name not available',
      );
      expect(result).to.include(
        'Number of refills left: Number of refills left not available',
      );
      expect(result).to.include(
        'Prescription expiration date: Date not available',
      );
      expect(result).to.include('Last filled on: Not filled yet');
      expect(result).to.include('Reason for use: Reason for use not available');
      expect(result).to.include('Quantity: Quantity not available');
    });

    it('should handle empty rx object and show all placeholders', () => {
      const result = buildRxRenewalMessageBody({}, false);

      expect(result).to.include('Medication name, strength, and form:');
      expect(result).to.include(
        'Prescription number: Prescription number not available',
      );
      expect(result).to.include('Instructions: Instructions not available');
      expect(result).to.include(
        'Provider who prescribed it: Provider name not available',
      );
      expect(result).to.include(
        'Number of refills left: Number of refills left not available',
      );
      expect(result).to.include(
        'Prescription expiration date: Date not available',
      );
      expect(result).to.include('Last filled on: Not filled yet');
      expect(result).to.include('Reason for use: Reason for use not available');
      expect(result).to.include('Quantity: Quantity not available');
    });

    it('should handle rxError defaulting to false', () => {
      const result = buildRxRenewalMessageBody(mockRx);

      expect(result).to.include(
        'Medication name, strength, and form: Lisinopril 10mg',
      );
      expect(result).to.include('Prescription number: 1234567890');
      expect(result).to.include('Instructions: Take one tablet by mouth daily');
    });

    it('should handle missing prescriptionName', () => {
      const rxWithoutName = {
        ...mockRx,
        prescriptionName: null,
      };
      const result = buildRxRenewalMessageBody(rxWithoutName, false);

      expect(result).to.include('Medication name, strength, and form:');
    });

    it('should handle missing prescriptionNumber and show placeholder', () => {
      const rxWithoutNumber = {
        ...mockRx,
        prescriptionNumber: null,
      };
      const result = buildRxRenewalMessageBody(rxWithoutNumber, false);

      expect(result).to.include(
        'Prescription number: Prescription number not available',
      );
    });

    it('should handle missing reason and show placeholder', () => {
      const rxWithoutReason = {
        ...mockRx,
        reason: null,
      };
      const result = buildRxRenewalMessageBody(rxWithoutReason, false);

      expect(result).to.include('Reason for use: Reason for use not available');
    });

    it('should handle missing quantity and show placeholder', () => {
      const rxWithoutQuantity = {
        ...mockRx,
        quantity: null,
      };
      const result = buildRxRenewalMessageBody(rxWithoutQuantity, false);

      expect(result).to.include('Quantity: Quantity not available');
    });

    it('should handle missing sig and show placeholder', () => {
      const rxWithoutSig = {
        ...mockRx,
        sig: null,
      };
      const result = buildRxRenewalMessageBody(rxWithoutSig, false);

      expect(result).to.include('Instructions: Instructions not available');
    });
  });

  describe('isValidDateValue', () => {
    it('should return false for empty string', () => {
      expect(isValidDateValue('')).to.be.false;
    });

    it('should return false for null', () => {
      expect(isValidDateValue(null)).to.be.false;
    });

    it('should return false for undefined', () => {
      expect(isValidDateValue(undefined)).to.be.false;
    });

    it('should return false for day only ("--04")', () => {
      expect(isValidDateValue('--04')).to.be.false;
    });

    it('should return false for month and day only ("-01-04")', () => {
      expect(isValidDateValue('-01-04')).to.be.false;
    });

    it('should return false for year and day only ("2026--04")', () => {
      expect(isValidDateValue('2026--04')).to.be.false;
    });

    it('should return false for year and month only ("2026-01-")', () => {
      expect(isValidDateValue('2026-01-')).to.be.false;
    });

    it('should return true for valid complete date', () => {
      expect(isValidDateValue('2026-01-13')).to.be.true;
    });

    it('should return true for valid date at year boundary', () => {
      expect(isValidDateValue('2025-12-31')).to.be.true;
    });

    it('should return false for invalid date (Feb 31st)', () => {
      expect(isValidDateValue('2026-02-31')).to.be.false;
    });

    it('should return false for invalid month (13)', () => {
      expect(isValidDateValue('2026-13-01')).to.be.false;
    });
  });
});
