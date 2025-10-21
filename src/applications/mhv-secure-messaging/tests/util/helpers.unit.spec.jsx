import React from 'react';
import { render } from '@testing-library/react';
import CrisisPanel from 'platform/site-wide/va-footer/components/CrisisPanel';
import { openCrisisModal } from '@department-of-veterans-affairs/mhv/exports';
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
} from '../../util/helpers';
import {
  DefaultFolders as Folders,
  Paths,
  ErrorMessages,
} from '../../util/constants';
import threadWithDraftResponse from '../fixtures/message-thread-with-draft-response.json';
import CrisisLineConnectButton from '../../components/CrisisLineConnectButton';

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

  it('openCrisisModal should open the crisis modal and focus', () => {
    render(
      <>
        <CrisisLineConnectButton />
        <CrisisPanel />
      </>,
    );
    openCrisisModal();
    expect(document.querySelector('a[href="tel:988"]')).to.equal(
      document.activeElement,
    );
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
});
