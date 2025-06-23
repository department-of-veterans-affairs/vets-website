import React from 'react';
import { expect } from 'chai';
import { fireEvent, render, waitFor } from '@testing-library/react';
import sinon from 'sinon';

import FileInput from '../../../components/ComposeForm/FileInput';

describe('File input component', () => {
  let stub;
  afterEach(() => {
    if (stub) {
      stub.restore();
      stub = null;
    }
  });
  const stubUseFeatureToggles = value => {
    const useFeatureToggles = require('../../../hooks/useFeatureToggles');
    stub = sinon.stub(useFeatureToggles, 'default').returns(value);
    return stub;
  };

  const attachments = [];
  it('renders without errors', () => {
    const useFeatureTogglesStub = stubUseFeatureToggles({
      largeAttachmentsEnabled: false,
    });
    useFeatureTogglesStub;

    const { container } = render(<FileInput attachments={attachments} />);
    const main = container.getElementsByClassName('file-input');
    expect(main.length).to.equal(1);
  });

  it('should contain a file input', () => {
    const useFeatureTogglesStub = stubUseFeatureToggles({
      largeAttachmentsEnabled: false,
    });
    useFeatureTogglesStub;

    const screen = render(<FileInput attachments={attachments} />);
    const attachFileButton = screen.getByTestId('attach-file-input');

    expect(attachFileButton).to.exist;
  });

  it('should contain a button to attach files', () => {
    const useFeatureTogglesStub = stubUseFeatureToggles({
      largeAttachmentsEnabled: false,
    });
    useFeatureTogglesStub;

    const screen = render(<FileInput attachments={attachments} />);
    const attachFileButton = screen.getByTestId('attach-file-button');

    expect(attachFileButton).to.exist;
    fireEvent.click(attachFileButton);
  });

  it('should allow a file to be attached', async () => {
    const useFeatureTogglesStub = stubUseFeatureToggles({
      largeAttachmentsEnabled: false,
    });
    useFeatureTogglesStub;

    const file = new File(['(⌐□_□)'], 'test.png', { type: 'image/png' });
    const screen = render(<FileInput attachments={attachments} />);

    const uploader = screen.getByTestId('attach-file-input');

    await waitFor(() =>
      fireEvent.change(uploader, {
        target: { files: [file] },
      }),
    );

    expect(uploader.files[0].name).to.equal('test.png');
    expect(uploader.files.length).to.equal(1);
  });

  it('should allow multiple files to be attached', async () => {
    const useFeatureTogglesStub = stubUseFeatureToggles({
      largeAttachmentsEnabled: false,
    });
    useFeatureTogglesStub;

    const oneAttachment = [{ name: 'test1.png', size: 100, type: 'image/png' }];
    const file = new File(['(⌐□_□)'], 'test.png', { type: 'image/png' });
    const screen = render(<FileInput attachments={oneAttachment} />);

    const uploader = screen.getByTestId('attach-file-input');

    await waitFor(() =>
      fireEvent.change(uploader, {
        target: { files: [file] },
      }),
    );

    expect(uploader.files[0].name).to.equal('test.png');
    expect(uploader.files.length).to.equal(1);
  });

  it('attach button should be hidden when 4 files attached', async () => {
    const useFeatureTogglesStub = stubUseFeatureToggles({
      largeAttachmentsEnabled: false,
    });
    useFeatureTogglesStub;

    const fourAttachments = [
      { name: 'test1.png', size: 100, type: 'image/png' },
      { name: 'test2.png', size: 200, type: 'image/png' },
      { name: 'test2.png', size: 300, type: 'image/png' },
      { name: 'test4.png', size: 400, type: 'image/png' },
    ];
    const screen = render(<FileInput attachments={fourAttachments} />);
    expect(screen.queryByTestId('attach-file-button')).to.not.exist;
    expect(screen.queryByTestId('attach-file-input')).to.not.exist;
  });

  it('attach button should be hidden when 10 files attached with largeAttachmentsEnabled feature flag', async () => {
    const useFeatureTogglesStub = stubUseFeatureToggles({
      largeAttachmentsEnabled: true,
    });
    useFeatureTogglesStub;

    const tenAttachments = [
      { name: 'test1.png', size: 100, type: 'image/png' },
      { name: 'test2.png', size: 200, type: 'image/png' },
      { name: 'test3.png', size: 300, type: 'image/png' },
      { name: 'test4.png', size: 400, type: 'image/png' },
      { name: 'test5.png', size: 100, type: 'image/png' },
      { name: 'test6.png', size: 100, type: 'image/png' },
      { name: 'test7.png', size: 100, type: 'image/png' },
      { name: 'test8.png', size: 100, type: 'image/png' },
      { name: 'test9.png', size: 100, type: 'image/png' },
      { name: 'test10.png', size: 100, type: 'image/png' },
    ];
    const screen = render(<FileInput attachments={tenAttachments} />);
    expect(screen.queryByTestId('attach-file-button')).to.not.exist;
    expect(screen.queryByTestId('attach-file-input')).to.not.exist;
  });

  it('attach button should be visible when more than 4 and less than 10 files attached with largeAttachmentsEnabled feature flag', async () => {
    const useFeatureTogglesStub = stubUseFeatureToggles({
      largeAttachmentsEnabled: true,
    });
    useFeatureTogglesStub;

    const tenAttachments = [
      { name: 'test1.png', size: 100, type: 'image/png' },
      { name: 'test2.png', size: 200, type: 'image/png' },
      { name: 'test3.png', size: 300, type: 'image/png' },
      { name: 'test4.png', size: 400, type: 'image/png' },
      { name: 'test5.png', size: 100, type: 'image/png' },
      { name: 'test6.png', size: 100, type: 'image/png' },
      { name: 'test7.png', size: 100, type: 'image/png' },
      { name: 'test8.png', size: 100, type: 'image/png' },
      { name: 'test9.png', size: 100, type: 'image/png' },
    ];
    const screen = render(<FileInput attachments={tenAttachments} />);
    expect(screen.getByTestId('attach-file-button')).to.exist;
    expect(screen.getByTestId('attach-file-input')).to.exist;
  });
});
