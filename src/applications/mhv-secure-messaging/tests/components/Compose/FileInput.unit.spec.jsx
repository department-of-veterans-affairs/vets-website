import React from 'react';
import { expect } from 'chai';
import { render, waitFor } from '@testing-library/react';
import sinon from 'sinon';
import FileInput from '../../../components/ComposeForm/FileInput';

describe('File input component', () => {
  let stub;
  let sandbox;
  beforeEach(() => {
    sandbox = sinon.createSandbox();
  });

  afterEach(() => {
    sandbox.restore();
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

  const createTestFile = ({ name, sizeMb, mimeType, content }) => {
    const validFile = new File([content], name, {
      type: mimeType,
      lastModified: Date.now(),
    });
    Object.defineProperty(validFile, 'size', {
      value: sizeMb * 1024 * 1024, // Convert MB to bytes
      writable: false,
    });
    return validFile;
  };

  const attachments = [];
  it('renders without errors', () => {
    stubUseFeatureToggles({
      largeAttachmentsEnabled: false,
    });

    const { container } = render(<FileInput attachments={attachments} />);
    const main = container.getElementsByClassName('file-input');
    expect(main.length).to.equal(1);
  });

  it('should contain a file input', () => {
    stubUseFeatureToggles({
      largeAttachmentsEnabled: false,
    });

    const screen = render(<FileInput attachments={attachments} />);
    const attachFileInput = screen.getByTestId('attach-file-input');

    expect(attachFileInput).to.exist;
  });

  it('should allow a file to be attached', async () => {
    stubUseFeatureToggles({
      largeAttachmentsEnabled: false,
    });

    const setAttachments = sinon.spy();
    const setAttachFileError = sinon.spy();

    const file = createTestFile({
      name: 'test.png',
      sizeMb: 0.001,
      mimeType: 'image/png',
      content: '(⌐□_□)',
    });
    const screen = render(
      <FileInput
        attachments={attachments}
        setAttachments={setAttachments}
        setAttachFileError={setAttachFileError}
      />,
    );

    const fileInput = screen.getByTestId('attach-file-input');

    // Simulate the VaFileInputMultiple component's vaChange event
    const changeEvent = new CustomEvent('vaMultipleChange', {
      detail: { action: 'FILE_ADDED', file },
      bubbles: true,
    });

    await waitFor(() => {
      fileInput.dispatchEvent(changeEvent);
    });

    expect(setAttachments.called).to.be.true;
  });

  it('should allow multiple files to be attached', async () => {
    stubUseFeatureToggles({
      largeAttachmentsEnabled: false,
    });

    const oneAttachment = { name: 'test1.png', size: 1000, type: 'image/png' };
    const setAttachments = sinon.spy();
    const setAttachFileError = sinon.spy();

    const file = createTestFile({
      name: 'test2.png',
      sizeMb: 0.001,
      mimeType: 'image/png',
      content: '(⌐□_□)',
    });
    const screen = render(
      <FileInput
        attachments={[oneAttachment]}
        setAttachments={setAttachments}
        setAttachFileError={setAttachFileError}
      />,
    );

    const fileInput = screen.getByTestId('attach-file-input');

    const changeEvent = new CustomEvent('vaMultipleChange', {
      detail: { action: 'FILE_ADDED', file },
      bubbles: true,
    });

    await waitFor(() => {
      fileInput.dispatchEvent(changeEvent);
    });

    expect(setAttachments.called).to.be.true;
  });

  it('should not render when 4 files attached', () => {
    stubUseFeatureToggles({
      largeAttachmentsEnabled: false,
    });

    const fourAttachments = [
      { name: 'test1.png', size: 1000, type: 'image/png' },
      { name: 'test2.png', size: 1000, type: 'image/png' },
      { name: 'test3.png', size: 1000, type: 'image/png' },
      { name: 'test4.png', size: 1000, type: 'image/png' },
    ];
    const { container } = render(<FileInput attachments={fourAttachments} />);
    const fileInput = container.querySelector(
      '[data-testid="attach-file-input"]',
    );
    expect(fileInput).to.not.exist;
  });

  it('should not render when 10 files attached with largeAttachmentsEnabled feature flag', () => {
    stubUseFeatureToggles({
      largeAttachmentsEnabled: true,
    });

    const tenAttachments = [
      { name: 'test1.png', size: 1000, type: 'image/png' },
      { name: 'test2.png', size: 1000, type: 'image/png' },
      { name: 'test3.png', size: 1000, type: 'image/png' },
      { name: 'test4.png', size: 1000, type: 'image/png' },
      { name: 'test5.png', size: 1000, type: 'image/png' },
      { name: 'test6.png', size: 1000, type: 'image/png' },
      { name: 'test7.png', size: 1000, type: 'image/png' },
      { name: 'test8.png', size: 1000, type: 'image/png' },
      { name: 'test9.png', size: 1000, type: 'image/png' },
      { name: 'test10.png', size: 1000, type: 'image/png' },
    ];
    const { container } = render(<FileInput attachments={tenAttachments} />);
    const fileInput = container.querySelector(
      '[data-testid="attach-file-input"]',
    );
    expect(fileInput).to.not.exist;
  });

  it('should render when more than 4 and less than 10 files attached with largeAttachmentsEnabled feature flag', () => {
    stubUseFeatureToggles({
      largeAttachmentsEnabled: true,
    });

    const nineAttachments = [
      { name: 'test1.png', size: 1000, type: 'image/png' },
      { name: 'test2.png', size: 1000, type: 'image/png' },
      { name: 'test3.png', size: 1000, type: 'image/png' },
      { name: 'test4.png', size: 1000, type: 'image/png' },
      { name: 'test5.png', size: 1000, type: 'image/png' },
      { name: 'test6.png', size: 1000, type: 'image/png' },
      { name: 'test7.png', size: 1000, type: 'image/png' },
      { name: 'test8.png', size: 1000, type: 'image/png' },
      { name: 'test9.png', size: 1000, type: 'image/png' },
    ];
    const screen = render(<FileInput attachments={nineAttachments} />);
    const fileInput = screen.getByTestId('attach-file-input');
    expect(fileInput).to.exist;
  });

  describe('useLargeAttachments logic', () => {
    it('should use large attachments when cernerPilotSmFeatureFlag=true and isOhTriageGroup=true', () => {
      stubUseFeatureToggles({
        largeAttachmentsEnabled: false,
        cernerPilotSmFeatureFlag: true,
      });

      const nineAttachments = Array.from({ length: 9 }, (_, i) => ({
        name: `test${i + 1}.png`,
        size: 1000,
        type: 'image/png',
      }));

      const screen = render(
        <FileInput attachments={nineAttachments} isOhTriageGroup />,
      );
      const fileInput = screen.getByTestId('attach-file-input');
      expect(fileInput).to.exist;
    });

    it('should NOT use large attachments when cernerPilotSmFeatureFlag=true but isOhTriageGroup=false', () => {
      stubUseFeatureToggles({
        largeAttachmentsEnabled: false,
        cernerPilotSmFeatureFlag: true,
      });

      const fourAttachments = Array.from({ length: 4 }, (_, i) => ({
        name: `test${i + 1}.png`,
        size: 1000,
        type: 'image/png',
      }));

      const { container } = render(
        <FileInput attachments={fourAttachments} isOhTriageGroup={false} />,
      );
      const fileInput = container.querySelector(
        '[data-testid="attach-file-input"]',
      );
      expect(fileInput).to.not.exist;
    });

    it('should use large attachments when largeAttachmentsEnabled=true regardless of other flags', () => {
      stubUseFeatureToggles({
        largeAttachmentsEnabled: true,
        cernerPilotSmFeatureFlag: false,
      });

      const nineAttachments = Array.from({ length: 9 }, (_, i) => ({
        name: `test${i + 1}.png`,
        size: 1000,
        type: 'image/png',
      }));

      const screen = render(
        <FileInput attachments={nineAttachments} isOhTriageGroup={false} />,
      );
      const fileInput = screen.getByTestId('attach-file-input');
      expect(fileInput).to.exist;
    });

    it('should NOT use large attachments when all flags are false', () => {
      stubUseFeatureToggles({
        largeAttachmentsEnabled: false,
        cernerPilotSmFeatureFlag: false,
      });

      const fourAttachments = Array.from({ length: 4 }, (_, i) => ({
        name: `test${i + 1}.png`,
        size: 1000,
        type: 'image/png',
      }));

      const { container } = render(
        <FileInput attachments={fourAttachments} isOhTriageGroup={false} />,
      );
      const fileInput = container.querySelector(
        '[data-testid="attach-file-input"]',
      );
      expect(fileInput).to.not.exist;
    });
  });

  describe('setAttachFileError', () => {
    let setAttachFileErrorSpy;
    let setAttachments;

    beforeEach(() => {
      setAttachFileErrorSpy = sinon.spy();
      setAttachments = sinon.spy();
    });

    describe('when isOhTriageGroup is true', () => {
      it('validates file types - should accept extended file types like MP4, BMP, TIFF when cernerPilotSmFeatureFlag is enabled', async () => {
        stubUseFeatureToggles({
          largeAttachmentsEnabled: false,
          cernerPilotSmFeatureFlag: true,
        });

        const props = {
          attachments: [],
          isOhTriageGroup: true,
          setAttachFileError: setAttachFileErrorSpy,

          setAttachments,
        };

        const { getByTestId } = render(<FileInput {...props} />);
        const input = getByTestId('attach-file-input');

        const mp4File = createTestFile({
          name: 'test.mp4',
          sizeMb: 1,
          mimeType: 'video/mp4',
          content: 'test video content',
        });

        const changeEvent = new CustomEvent('vaMultipleChange', {
          detail: { action: 'FILE_ADDED', file: mp4File },
          bubbles: true,
        });

        await waitFor(() => {
          input.dispatchEvent(changeEvent);
        });

        // Test invalid file type
        const mp3File = createTestFile({
          name: 'test.mp3',
          sizeMb: 1,
          mimeType: 'audio/mp3',
          content: 'test audio content',
        });

        const invalidChangeEvent = new CustomEvent('vaMultipleChange', {
          detail: { action: 'FILE_ADDED', file: mp3File },
          bubbles: true,
        });

        await waitFor(() => {
          input.dispatchEvent(invalidChangeEvent);
        });

        const { message } = setAttachFileErrorSpy.lastCall.args[0];
        expect(message).to.include('file type');
      });

      it('validates single file size - should accept files up to 25MB', async () => {
        stubUseFeatureToggles({
          largeAttachmentsEnabled: false,
          cernerPilotSmFeatureFlag: true,
        });

        const props = {
          attachments: [],
          isOhTriageGroup: true,
          setAttachFileError: setAttachFileErrorSpy,

          setAttachments,
        };

        const { getByTestId } = render(<FileInput {...props} />);
        const input = getByTestId('attach-file-input');

        // Test valid file under 25MB
        const validFile = createTestFile({
          name: 'test.png',
          sizeMb: 24,
          mimeType: 'image/png',
          content: 'test content',
        });

        const validChangeEvent = new CustomEvent('vaMultipleChange', {
          detail: { action: 'FILE_ADDED', file: validFile },
          bubbles: true,
        });

        await waitFor(() => {
          input.dispatchEvent(validChangeEvent);
        });

        // Test file over 25MB
        const largeFile = createTestFile({
          name: 'test-large.png',
          sizeMb: 26,
          mimeType: 'image/png',
          content: 'test content',
        });

        const largeChangeEvent = new CustomEvent('vaMultipleChange', {
          detail: { action: 'FILE_ADDED', file: largeFile },
          bubbles: true,
        });

        await waitFor(() => {
          input.dispatchEvent(largeChangeEvent);
        });

        const { message } = setAttachFileErrorSpy.lastCall.args[0];
        expect(message).to.include('25MB');
      });

      it('validates total file size - should accept total files up to 25MB', async () => {
        stubUseFeatureToggles({
          largeAttachmentsEnabled: false,
          cernerPilotSmFeatureFlag: true,
        });

        const existingAttachments = [
          { name: 'existing.png', size: 20 * 1024 * 1024, type: 'image/png' },
        ];

        const props = {
          attachments: existingAttachments,
          isOhTriageGroup: true,
          setAttachFileError: setAttachFileErrorSpy,

          setAttachments,
        };

        const { getByTestId } = render(<FileInput {...props} />);
        const input = getByTestId('attach-file-input');

        // Test valid addition under total limit
        const newFile = createTestFile({
          name: 'test.png',
          sizeMb: 4,
          mimeType: 'image/png',
          content: 'test content',
        });

        const validChangeEvent = new CustomEvent('vaMultipleChange', {
          detail: { action: 'FILE_ADDED', file: newFile },
          bubbles: true,
        });

        await waitFor(() => {
          input.dispatchEvent(validChangeEvent);
        });

        // Test file that exceeds total limit
        const largeFile = createTestFile({
          name: 'test-large.png',
          sizeMb: 6,
          mimeType: 'image/png',
          content: 'test content',
        });

        const largeChangeEvent = new CustomEvent('vaMultipleChange', {
          detail: { action: 'FILE_ADDED', file: largeFile },
          bubbles: true,
        });

        await waitFor(() => {
          input.dispatchEvent(largeChangeEvent);
        });

        const { message } = setAttachFileErrorSpy.lastCall.args[0];
        expect(message).to.include('25MB');
      });
    });

    describe('when isOhTriageGroup is false', () => {
      it('validates file types - should only accept basic file types', async () => {
        stubUseFeatureToggles({
          largeAttachmentsEnabled: false,
          cernerPilotSmFeatureFlag: true,
        });

        const props = {
          attachments: [],
          isOhTriageGroup: false,
          setAttachFileError: setAttachFileErrorSpy,

          setAttachments,
        };

        const { getByTestId } = render(<FileInput {...props} />);
        const input = getByTestId('attach-file-input');

        // Test valid basic file type
        const pngFile = createTestFile({
          name: 'test.png',
          sizeMb: 1,
          mimeType: 'image/png',
          content: 'test content',
        });

        const validChangeEvent = new CustomEvent('vaMultipleChange', {
          detail: { action: 'FILE_ADDED', file: pngFile },
          bubbles: true,
        });

        await waitFor(() => {
          input.dispatchEvent(validChangeEvent);
        });

        // Test extended file type (should be rejected)
        const mp4File = createTestFile({
          name: 'test.mp4',
          sizeMb: 1,
          mimeType: 'video/mp4',
          content: 'test video content',
        });

        const invalidChangeEvent = new CustomEvent('vaMultipleChange', {
          detail: { action: 'FILE_ADDED', file: mp4File },
          bubbles: true,
        });

        await waitFor(() => {
          input.dispatchEvent(invalidChangeEvent);
        });

        const { message } = setAttachFileErrorSpy.lastCall.args[0];
        expect(message).to.include('file type');
      });

      it('validates single file size - should reject files over 6MB', async () => {
        stubUseFeatureToggles({
          largeAttachmentsEnabled: false,
          cernerPilotSmFeatureFlag: true,
        });

        const props = {
          attachments: [],
          isOhTriageGroup: false,
          setAttachFileError: setAttachFileErrorSpy,

          setAttachments,
        };

        const { getByTestId } = render(<FileInput {...props} />);
        const input = getByTestId('attach-file-input');

        // Test valid file under 6MB
        const validFile = createTestFile({
          name: 'test.png',
          content: 'test content',
          type: 'image/png',
          sizeMb: 5,
        });

        const validChangeEvent = new CustomEvent('vaMultipleChange', {
          detail: { action: 'FILE_ADDED', file: validFile },
          bubbles: true,
        });

        await waitFor(() => {
          input.dispatchEvent(validChangeEvent);
        });

        // Test file over 6MB
        const largeFile = createTestFile({
          name: 'test-large.png',
          type: 'image/png',
          sizeMb: 7,
          content: 'test content',
        });

        const largeChangeEvent = new CustomEvent('vaMultipleChange', {
          detail: { action: 'FILE_ADDED', file: largeFile },
          bubbles: true,
        });

        await waitFor(() => {
          input.dispatchEvent(largeChangeEvent);
        });

        const { message } = setAttachFileErrorSpy.lastCall.args[0];
        expect(message).to.include('6MB');
      });

      it('validates total file size - should reject when total exceeds 10MB', async () => {
        stubUseFeatureToggles({
          largeAttachmentsEnabled: false,
          cernerPilotSmFeatureFlag: true,
        });

        const existingAttachments = [
          { name: 'existing.png', size: 8 * 1024 * 1024, type: 'image/png' },
        ];

        const props = {
          attachments: existingAttachments,
          isOhTriageGroup: false,
          setAttachFileError: setAttachFileErrorSpy,

          setAttachments,
        };

        const { getByTestId } = render(<FileInput {...props} />);
        const input = getByTestId('attach-file-input');

        // Test valid addition under total limit
        const validFile = createTestFile({
          name: 'test.png',
          sizeMb: 1,
          mimeType: 'image/png',
        });

        const validChangeEvent = new CustomEvent('vaMultipleChange', {
          detail: { action: 'FILE_ADDED', file: validFile },
          bubbles: true,
        });

        await waitFor(() => {
          input.dispatchEvent(validChangeEvent);
        });

        // Test file that exceeds total limit
        const largeFile = createTestFile({
          content: 'test content',
          mimeType: 'image/png',
          sizeMb: 3,
          name: 'test-large.png',
        });

        const largeChangeEvent = new CustomEvent('vaMultipleChange', {
          detail: { action: 'FILE_ADDED', file: largeFile },
          bubbles: true,
        });

        await waitFor(() => {
          input.dispatchEvent(largeChangeEvent);
        });

        const { message } = setAttachFileErrorSpy.lastCall.args[0];
        expect(message).to.include('10MB');
      });
    });

    describe('when largeAttachmentsEnabled is true', () => {
      it('validates file types - should accept extended file types for all users', async () => {
        stubUseFeatureToggles({
          largeAttachmentsEnabled: true,
          cernerPilotSmFeatureFlag: false,
        });

        const props = {
          attachments: [],
          isOhTriageGroup: false,
          setAttachFileError: setAttachFileErrorSpy,

          setAttachments,
        };

        const { getByTestId } = render(<FileInput {...props} />);
        const input = getByTestId('attach-file-input');

        // Test BMP file
        const bmpFile = createTestFile({
          name: 'test.bmp',
          mimeType: 'image/bmp',
          sizeMb: 1,
          content: 'test content',
        });

        const bmpChangeEvent = new CustomEvent('vaMultipleChange', {
          detail: { action: 'FILE_ADDED', file: bmpFile },
          bubbles: true,
        });

        await waitFor(() => {
          input.dispatchEvent(bmpChangeEvent);
        });

        // Test MP4 file
        const mp4File = createTestFile({
          content: 'test video content',
          mimeType: 'video/mp4',
          sizeMb: 1,
          name: 'test.mp4',
        });

        const mp4ChangeEvent = new CustomEvent('vaMultipleChange', {
          detail: { action: 'FILE_ADDED', file: mp4File },
          bubbles: true,
        });

        await waitFor(() => {
          input.dispatchEvent(mp4ChangeEvent);
        });

        // Test invalid file type
        const mp3File = createTestFile({
          name: 'test.mp3',
          sizeMb: 1,
          mimeType: 'audio/mp3',
          content: 'test audio content',
        });

        const invalidChangeEvent = new CustomEvent('vaMultipleChange', {
          detail: { action: 'FILE_ADDED', file: mp3File },
          bubbles: true,
        });

        await waitFor(() => {
          input.dispatchEvent(invalidChangeEvent);
        });

        const { message } = setAttachFileErrorSpy.lastCall.args[0];
        expect(message).to.include('file type');
      });

      it('validates single file size - should accept files up to 25MB for all users', async () => {
        stubUseFeatureToggles({
          largeAttachmentsEnabled: true,
          cernerPilotSmFeatureFlag: false,
        });

        const props = {
          attachments: [],
          isOhTriageGroup: false,
          setAttachFileError: setAttachFileErrorSpy,

          setAttachments,
        };

        const { getByTestId } = render(<FileInput {...props} />);
        const input = getByTestId('attach-file-input');

        // Test valid file under 25MB
        const validFile = createTestFile({
          name: 'test.png',
          sizeMb: 24,
          mimeType: 'image/png',
          content: 'test content',
        });

        const validChangeEvent = new CustomEvent('vaMultipleChange', {
          detail: { action: 'FILE_ADDED', file: validFile },
          bubbles: true,
        });

        await waitFor(() => {
          input.dispatchEvent(validChangeEvent);
        });

        // Test file over 25MB
        const largeFile = createTestFile({
          name: 'test-large.png',
          sizeMb: 26,
          mimeType: 'image/png',
          content: 'test content',
        });

        const largeChangeEvent = new CustomEvent('vaMultipleChange', {
          detail: { action: 'FILE_ADDED', file: largeFile },
          bubbles: true,
        });

        await waitFor(() => {
          input.dispatchEvent(largeChangeEvent);
        });

        const { message } = setAttachFileErrorSpy.lastCall.args[0];
        expect(message).to.include('25MB');
      });

      it('validates total file size - should accept total files up to 25MB for all users', async () => {
        stubUseFeatureToggles({
          largeAttachmentsEnabled: true,
          cernerPilotSmFeatureFlag: false,
        });

        const existingAttachments = [
          { name: 'existing.png', size: 20 * 1024 * 1024, type: 'image/png' },
        ];

        const props = {
          attachments: existingAttachments,
          isOhTriageGroup: false,
          setAttachFileError: setAttachFileErrorSpy,

          setAttachments,
        };

        const { getByTestId } = render(<FileInput {...props} />);
        const input = getByTestId('attach-file-input');

        // Test valid addition under total limit
        const validFile = createTestFile({
          name: 'test.png',
          sizeMb: 4,
          mimeType: 'image/png',
          content: 'test content',
        });

        const validChangeEvent = new CustomEvent('vaMultipleChange', {
          detail: { action: 'FILE_ADDED', file: validFile },
          bubbles: true,
        });

        await waitFor(() => {
          input.dispatchEvent(validChangeEvent);
        });

        // Test file that exceeds total limit
        const largeFile = createTestFile({
          name: 'test-large.png',
          sizeMb: 6,
          mimeType: 'image/png',
          content: 'test content',
        });

        const largeChangeEvent = new CustomEvent('vaMultipleChange', {
          detail: { action: 'FILE_ADDED', file: largeFile },
          bubbles: true,
        });

        await waitFor(() => {
          input.dispatchEvent(largeChangeEvent);
        });

        const { message } = setAttachFileErrorSpy.lastCall.args[0];
        expect(message).to.include('25MB');
      });
    });

    describe('when largeAttachmentsEnabled is false', () => {
      it('validates file types - should use standard file type restrictions', async () => {
        stubUseFeatureToggles({
          largeAttachmentsEnabled: false,
          cernerPilotSmFeatureFlag: false,
        });

        const props = {
          attachments: [],
          isOhTriageGroup: false,
          setAttachFileError: setAttachFileErrorSpy,

          setAttachments,
        };

        const { getByTestId } = render(<FileInput {...props} />);
        const input = getByTestId('attach-file-input');

        // Test valid basic file type
        const pngFile = createTestFile({
          name: 'test.png',
          sizeMb: 1,
          mimeType: 'image/png',
          content: 'test content',
        });

        const validChangeEvent = new CustomEvent('vaMultipleChange', {
          detail: { action: 'FILE_ADDED', file: pngFile },
          bubbles: true,
        });

        await waitFor(() => {
          input.dispatchEvent(validChangeEvent);
        });

        // Test extended file type (should be rejected)
        const tiffFile = createTestFile({
          name: 'test.tiff',
          sizeMb: 1,
          mimeType: 'image/tiff',
          content: 'test content',
        });

        const invalidChangeEvent = new CustomEvent('vaMultipleChange', {
          detail: { action: 'FILE_ADDED', file: tiffFile },
          bubbles: true,
        });

        await waitFor(() => {
          input.dispatchEvent(invalidChangeEvent);
        });

        const { message } = setAttachFileErrorSpy.lastCall.args[0];
        expect(message).to.include('file type');
      });

      it('validates single file size - should use standard 6MB limit', async () => {
        stubUseFeatureToggles({
          largeAttachmentsEnabled: false,
          cernerPilotSmFeatureFlag: false,
        });

        const props = {
          attachments: [],
          isOhTriageGroup: false,
          setAttachFileError: setAttachFileErrorSpy,

          setAttachments,
        };

        const { getByTestId } = render(<FileInput {...props} />);
        const input = getByTestId('attach-file-input');

        // Test valid file under 6MB
        const validFile = createTestFile({
          name: 'test.png',
          sizeMb: 5,
          mimeType: 'image/png',
          content: 'test content',
        });

        const validChangeEvent = new CustomEvent('vaMultipleChange', {
          detail: { action: 'FILE_ADDED', file: validFile },
          bubbles: true,
        });

        await waitFor(() => {
          input.dispatchEvent(validChangeEvent);
        });

        // Test file over 6MB
        const largeFile = createTestFile({
          name: 'test-large.png',
          sizeMb: 7,
          mimeType: 'image/png',
          content: 'test content',
        });

        const largeChangeEvent = new CustomEvent('vaMultipleChange', {
          detail: { action: 'FILE_ADDED', file: largeFile },
          bubbles: true,
        });

        await waitFor(() => {
          input.dispatchEvent(largeChangeEvent);
        });

        const { message } = setAttachFileErrorSpy.lastCall.args[0];
        expect(message).to.include('6MB');
      });

      it('validates total file size - should use standard 10MB limit', async () => {
        stubUseFeatureToggles({
          largeAttachmentsEnabled: false,
          cernerPilotSmFeatureFlag: false,
        });

        const existingAttachments = [
          { name: 'existing.png', size: 8 * 1024 * 1024, type: 'image/png' },
        ];

        const props = {
          attachments: existingAttachments,
          isOhTriageGroup: false,
          setAttachFileError: setAttachFileErrorSpy,

          setAttachments,
        };

        const { getByTestId } = render(<FileInput {...props} />);
        const input = getByTestId('attach-file-input');

        // Test valid addition under total limit
        const validFile = createTestFile({
          name: 'test.png',
          sizeMb: 1,
          mimeType: 'image/png',
          content: 'test content',
        });

        const validChangeEvent = new CustomEvent('vaMultipleChange', {
          detail: { action: 'FILE_ADDED', file: validFile },
          bubbles: true,
        });

        await waitFor(() => {
          input.dispatchEvent(validChangeEvent);
        });

        // Test file that exceeds total limit
        const largeFile = createTestFile({
          name: 'test-large.png',
          sizeMb: 3,
          mimeType: 'image/png',
          content: 'test content',
        });

        const largeChangeEvent = new CustomEvent('vaMultipleChange', {
          detail: { action: 'FILE_ADDED', file: largeFile },
          bubbles: true,
        });

        await waitFor(() => {
          input.dispatchEvent(largeChangeEvent);
        });

        const { message } = setAttachFileErrorSpy.lastCall.args[0];
        expect(message).to.include('10MB');
      });
    });

    it('should reject empty files', async () => {
      stubUseFeatureToggles({
        largeAttachmentsEnabled: false,
      });

      const props = {
        attachments: [],
        setAttachFileError: setAttachFileErrorSpy,

        setAttachments,
      };

      const { getByTestId } = render(<FileInput {...props} />);
      const input = getByTestId('attach-file-input');

      const emptyFile = createTestFile({
        name: 'empty.png',
        sizeMb: 0,
        mimeType: 'image/png',
        content: '',
      });

      const changeEvent = new CustomEvent('vaMultipleChange', {
        detail: { action: 'FILE_ADDED', file: emptyFile },
        bubbles: true,
      });

      await waitFor(() => {
        input.dispatchEvent(changeEvent);
      });

      const { message } = setAttachFileErrorSpy.lastCall.args[0];
      expect(message).to.equal(
        'Your file is empty. Try attaching a different file.',
      );
    });

    it('should reject duplicate files', async () => {
      stubUseFeatureToggles({
        largeAttachmentsEnabled: false,
      });

      const existingFile = { name: 'test.png', size: 1000, type: 'image/png' };

      const props = {
        attachments: [existingFile],
        setAttachFileError: setAttachFileErrorSpy,

        setAttachments,
      };

      const { getByTestId } = render(<FileInput {...props} />);
      const input = getByTestId('attach-file-input');

      const duplicateFile = createTestFile({
        name: 'test.png',
        sizeMb: 1,
        mimeType: 'image/png',
        content: 'content',
      });

      const changeEvent = new CustomEvent('vaMultipleChange', {
        detail: { action: 'FILE_ADDED', file: duplicateFile },
        bubbles: true,
      });

      await waitFor(() => {
        input.dispatchEvent(changeEvent);
      });

      const { message } = setAttachFileErrorSpy.lastCall.args[0];
      expect(message).to.equal('You have already attached this file.');
    });

    it('should handle file removal', async () => {
      stubUseFeatureToggles({
        largeAttachmentsEnabled: false,
      });

      const existingFiles = [
        { name: 'test1.png', size: 1000, type: 'image/png' },
        { name: 'test2.png', size: 1000, type: 'image/png' },
      ];

      const props = {
        attachments: existingFiles,
        setAttachFileError: setAttachFileErrorSpy,

        setAttachments,
      };

      const { getByTestId } = render(<FileInput {...props} />);
      const input = getByTestId('attach-file-input');

      const removeEvent = new CustomEvent('vaMultipleChange', {
        detail: { action: 'FILE_REMOVED', file: { name: 'test1.png' } },
        bubbles: true,
      });

      await waitFor(() => {
        input.dispatchEvent(removeEvent);
      });

      expect(setAttachments.called).to.be.true;
    });
  });

  it('should render with virus error and display component', () => {
    stubUseFeatureToggles({
      largeAttachmentsEnabled: false,
    });

    const testFile = createTestFile({
      name: 'test.pdf',
      sizeMb: 1,
      mimeType: 'application/pdf',
      content: 'test content',
    });

    const { container } = render(
      <FileInput
        attachments={[testFile]}
        attachmentScanError
        setAttachments={() => {}}
        setAttachFileError={() => {}}
        setAttachFileSuccess={() => {}}
      />,
    );
    const fileInput = container.querySelector(
      '[data-testid="attach-file-input"]',
    );
    // FileInput should still render even with virus error (not hidden)
    expect(fileInput).to.exist;
  });
});
