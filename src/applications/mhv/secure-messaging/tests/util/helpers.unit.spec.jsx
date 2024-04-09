import React from 'react';
import { render } from '@testing-library/react';
import CrisisPanel from 'platform/site-wide/va-footer/components/CrisisPanel';
import { openCrisisModal } from '@department-of-veterans-affairs/mhv/exports';
import { expect } from 'chai';
import sinon from 'sinon';
import {
  folderPathByFolderId,
  getLastSentMessage,
  navigateToFolderByFolderId,
  navigateToFoldersPage,
  setCaretToPos,
  titleCase,
} from '../../util/helpers';
import { DefaultFolders as Folders, Paths } from '../../util/constants';
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

  it('navigateToFolderByFolderId shold redirect to correct path', () => {
    const mockHistory = {
      push: sinon.spy(),
    };
    const folderId = '123';
    navigateToFolderByFolderId(folderId, mockHistory);
    sinon.assert.calledWith(mockHistory.push, '/folders/123/');
  });

  it('navigateToFoldersPage shold redirect to correct path', () => {
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
    expect(input.selectionStart).to.equal(0);
    expect(input.selectionEnd).to.equal(0);
    setCaretToPos(input, 2);
    expect(input.selectionStart).to.equal(2);
    expect(input.selectionEnd).to.equal(2);
    setCaretToPos(input, 0);
    expect(input.selectionStart).to.equal(0);
    expect(input.selectionEnd).to.equal(0);
  });
});
