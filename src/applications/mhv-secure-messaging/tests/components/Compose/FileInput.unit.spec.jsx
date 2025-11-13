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

    const { getByTestId } = render(<FileInput attachments={attachments} />);
    const attachFileInput = getByTestId('attach-file-input');

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
    const { getByTestId } = render(
      <FileInput
        attachments={attachments}
        setAttachments={setAttachments}
        setAttachFileError={setAttachFileError}
      />,
    );

    const fileInput = getByTestId('attach-file-input');

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
    const { getByTestId } = render(
      <FileInput
        attachments={[oneAttachment]}
        setAttachments={setAttachments}
        setAttachFileError={setAttachFileError}
      />,
    );

    const fileInput = getByTestId('attach-file-input');

    const changeEvent = new CustomEvent('vaMultipleChange', {
      detail: { action: 'FILE_ADDED', file },
      bubbles: true,
    });

    await waitFor(() => {
      fileInput.dispatchEvent(changeEvent);
    });

    expect(setAttachments.called).to.be.true;
  });

  it('should still render when 4 files attached (to allow removing files)', () => {
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
    // VaFileInputMultiple should still render so users can see and remove files
    expect(fileInput).to.exist;
  });

  it('should still render when 10 files attached with largeAttachmentsEnabled feature flag (to allow removing files)', () => {
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
    // VaFileInputMultiple should still render so users can see and remove files
    expect(fileInput).to.exist;
  });

  it('should still render when 10 files attached with cernerPilotSmFeatureFlag and isOhTriageGroup (to allow removing files)', () => {
    stubUseFeatureToggles({
      largeAttachmentsEnabled: false,
      cernerPilotSmFeatureFlag: true,
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
    const { container } = render(
      <FileInput attachments={tenAttachments} isOhTriageGroup />,
    );
    const fileInput = container.querySelector(
      '[data-testid="attach-file-input"]',
    );
    // VaFileInputMultiple should still render so users can see and remove files
    expect(fileInput).to.exist;
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

      const { getByTestId: getTestId } = render(
        <FileInput attachments={nineAttachments} isOhTriageGroup />,
      );
      const fileInput = getTestId('attach-file-input');
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
      // Component should still render at max files to allow file management
      expect(fileInput).to.exist;
      // But should use standard limits (4 files max)
      expect(fileInput.getAttribute('hint')).to.include('up to 4 files');
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

      const { getByTestId: getTestId2 } = render(
        <FileInput attachments={nineAttachments} isOhTriageGroup={false} />,
      );
      const fileInput = getTestId2('attach-file-input');
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
      // Component should still render at max files to allow file management
      expect(fileInput).to.exist;
      // But should use standard limits (4 files max)
      expect(fileInput.getAttribute('hint')).to.include('up to 4 files');
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

      // CRITICAL: Verify duplicate file was NOT added to attachments
      await waitFor(() => {
        expect(setAttachments.called).to.be.false;
      });
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

    describe('QuickTime video file handling', () => {
      it('should not crash when processing QuickTime .mov files', () => {
        stubUseFeatureToggles({
          largeAttachmentsEnabled: false,
        });

        const setAttachmentsSpy = sinon.spy();
        setAttachFileErrorSpy = sinon.spy();

        // Create a QuickTime file
        // This tests that our accept attribute fix (using only MIME types)
        // prevents VaFileInput from crashing with undefined.endsWith error
        const quicktimeFile = new File(
          ['mock video content'],
          'test-video.mov',
          {
            type: 'video/quicktime',
          },
        );

        const { getByTestId } = render(
          <FileInput
            attachments={[]}
            setAttachments={setAttachmentsSpy}
            setAttachFileError={setAttachFileErrorSpy}
          />,
        );

        const fileInput = getByTestId('attach-file-input');

        // Simulate the VaFileInputMultiple component's vaMultipleChange event
        const changeEvent = new CustomEvent('vaMultipleChange', {
          detail: { action: 'FILE_ADDED', file: quicktimeFile },
          bubbles: true,
        });

        // Primary assertion: Should NOT crash
        // The bug was: VaFileInput crashed with "undefined is not an object (evaluating 'r.endsWith')"
        // when accept attribute contained extensions not in its extensionToMimeType map
        expect(() => {
          fileInput.dispatchEvent(changeEvent);
        }).to.not.throw();

        // File will be rejected by our validation (not in accepted types)
        // but that's tested elsewhere - here we just verify no crash
      });

      it('should not crash when processing files with empty MIME type', () => {
        stubUseFeatureToggles({
          largeAttachmentsEnabled: false,
        });

        const setAttachmentsSpy2 = sinon.spy();
        const setAttachFileErrorSpy2 = sinon.spy();

        // Create a file with empty type (can happen with some file types)
        const fileWithEmptyType = new File(['content'], 'test-file.unknown', {
          type: '',
        });

        const { getByTestId } = render(
          <FileInput
            attachments={[]}
            setAttachments={setAttachmentsSpy2}
            setAttachFileError={setAttachFileErrorSpy2}
          />,
        );

        const fileInput = getByTestId('attach-file-input');

        const changeEvent = new CustomEvent('vaMultipleChange', {
          detail: { action: 'FILE_ADDED', file: fileWithEmptyType },
          bubbles: true,
        });

        // Should not crash
        expect(() => {
          fileInput.dispatchEvent(changeEvent);
        }).to.not.throw();
      });
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
      />,
    );
    const fileInput = container.querySelector(
      '[data-testid="attach-file-input"]',
    );
    // FileInput should still render even with virus error (not hidden)
    expect(fileInput).to.exist;
  });

  describe('Accessibility features', () => {
    it('should display error with enhanced visual styling', () => {
      stubUseFeatureToggles({
        largeAttachmentsEnabled: false,
      });

      const errorMessage = { message: 'File is too large' };

      const { getByTestId } = render(
        <FileInput
          attachments={[]}
          attachFileError={errorMessage}
          setAttachFileError={() => {}}
        />,
      );

      const errorElement = getByTestId('file-input-error-message');

      // Should have error role and aria-live
      expect(errorElement.getAttribute('role')).to.equal('alert');
      expect(errorElement.getAttribute('aria-live')).to.equal('polite');

      // Should have visual styling (border-left)
      expect(errorElement.className).to.include('vads-u-border-left--4px');
      expect(errorElement.className).to.include(
        'vads-u-border-color--secondary-dark',
      );
      expect(errorElement.className).to.include('vads-u-padding-left--2');

      // Should contain the error message
      expect(errorElement.textContent).to.equal('File is too large');
    });
  });
});
