import React from 'react';
import { expect } from 'chai';
import { fireEvent, render, waitFor } from '@testing-library/react';
import sinon from 'sinon';
import { renderInReduxProvider } from '@department-of-veterans-affairs/platform-testing/react-testing-library-helpers';
import reducer from '../../../reducers/index';
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

    const file = createTestFile({
      name: 'test.png',
      sizeMb: 0.001,
      mimeType: 'image/png',
      content: '(⌐□_□)',
    });
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
    const file = createTestFile({
      name: 'test.png',
      sizeMb: 0.001,
      mimeType: 'image/png',
      content: '(⌐□_□)',
    });
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

  describe('useLargeAttachments logic', () => {
    it('should use large attachments when cernerPilotSmFeatureFlag=true and isOhTriageGroup=true', () => {
      const useFeatureTogglesStub = stubUseFeatureToggles({
        largeAttachmentsEnabled: false,
        cernerPilotSmFeatureFlag: true,
      });
      useFeatureTogglesStub;

      const screen = render(
        <FileInput
          attachments={[]}
          isOhTriageGroup
          setAttachFileError={() => {}}
          setAttachFileSuccess={() => {}}
          setAttachments={() => {}}
        />,
      );

      // With large attachments enabled, should allow up to 10 files
      // Add 9 files first
      const nineAttachments = Array.from({ length: 9 }, (_, i) => ({
        name: `test${i + 1}.png`,
        size: 100,
        type: 'image/png',
      }));

      const { rerender } = screen;
      rerender(
        <FileInput
          attachments={nineAttachments}
          isOhTriageGroup
          setAttachFileError={() => {}}
          setAttachFileSuccess={() => {}}
          setAttachments={() => {}}
        />,
      );

      // Should still show attach button for the 10th file
      expect(screen.getByTestId('attach-file-button')).to.exist;
      expect(screen.getByTestId('attach-file-input')).to.exist;
    });

    it('should NOT use large attachments when cernerPilotSmFeatureFlag=true but isOhTriageGroup=false', () => {
      const useFeatureTogglesStub = stubUseFeatureToggles({
        largeAttachmentsEnabled: false,
        cernerPilotSmFeatureFlag: true,
      });
      useFeatureTogglesStub;

      const screen = render(
        <FileInput
          attachments={[]}
          isOhTriageGroup={false}
          setAttachFileError={() => {}}
          setAttachFileSuccess={() => {}}
          setAttachments={() => {}}
        />,
      );

      // With large attachments disabled, should only allow up to 4 files
      // Add 4 files
      const fourAttachments = Array.from({ length: 4 }, (_, i) => ({
        name: `test${i + 1}.png`,
        size: 100,
        type: 'image/png',
      }));

      const { rerender } = screen;
      rerender(
        <FileInput
          attachments={fourAttachments}
          isOhTriageGroup={false}
          setAttachFileError={() => {}}
          setAttachFileSuccess={() => {}}
          setAttachments={() => {}}
        />,
      );

      // Should hide attach button after 4 files
      expect(screen.queryByTestId('attach-file-button')).to.not.exist;
      expect(screen.queryByTestId('attach-file-input')).to.not.exist;
    });

    it('should use large attachments when largeAttachmentsEnabled=true regardless of other flags', () => {
      const useFeatureTogglesStub = stubUseFeatureToggles({
        largeAttachmentsEnabled: true,
        cernerPilotSmFeatureFlag: false,
      });
      useFeatureTogglesStub;

      const screen = render(
        <FileInput
          attachments={[]}
          isOhTriageGroup={false}
          setAttachFileError={() => {}}
          setAttachFileSuccess={() => {}}
          setAttachments={() => {}}
        />,
      );

      // With large attachments enabled, should allow up to 10 files
      // Add 9 files first
      const nineAttachments = Array.from({ length: 9 }, (_, i) => ({
        name: `test${i + 1}.png`,
        size: 100,
        type: 'image/png',
      }));

      const { rerender } = screen;
      rerender(
        <FileInput
          attachments={nineAttachments}
          isOhTriageGroup={false}
          setAttachFileError={() => {}}
          setAttachFileSuccess={() => {}}
          setAttachments={() => {}}
        />,
      );

      // Should still show attach button for the 10th file
      expect(screen.getByTestId('attach-file-button')).to.exist;
      expect(screen.getByTestId('attach-file-input')).to.exist;
    });

    it('should NOT use large attachments when all flags are false', () => {
      const useFeatureTogglesStub = stubUseFeatureToggles({
        largeAttachmentsEnabled: false,
        cernerPilotSmFeatureFlag: false,
      });
      useFeatureTogglesStub;

      const screen = render(
        <FileInput
          attachments={[]}
          isOhTriageGroup={false}
          setAttachFileError={() => {}}
          setAttachFileSuccess={() => {}}
          setAttachments={() => {}}
        />,
      );

      // With large attachments disabled, should only allow up to 4 files
      // Add 4 files
      const fourAttachments = Array.from({ length: 4 }, (_, i) => ({
        name: `test${i + 1}.png`,
        size: 100,
        type: 'image/png',
      }));

      const { rerender } = screen;
      rerender(
        <FileInput
          attachments={fourAttachments}
          isOhTriageGroup={false}
          setAttachFileError={() => {}}
          setAttachFileSuccess={() => {}}
          setAttachments={() => {}}
        />,
      );

      // Should hide attach button after 4 files
      expect(screen.queryByTestId('attach-file-button')).to.not.exist;
      expect(screen.queryByTestId('attach-file-input')).to.not.exist;
    });
  });

  describe('setAttachFileError', () => {
    let setAttachFileErrorSpy;
    let setAttachFileSuccessSpy;
    let setAttachments;

    beforeEach(() => {
      setAttachFileErrorSpy = sandbox.spy();
      setAttachFileSuccessSpy = sandbox.spy();
      setAttachments = sandbox.spy();
    });

    describe('when isOhTriageGroup is true', () => {
      it('validates file types - should accept extended file types like MP4, BMP, TIFF when cernerPilotSmFeatureFlag is enabled', async () => {
        const useFeatureTogglesStub = stubUseFeatureToggles({
          largeAttachmentsEnabled: false,
          cernerPilotSmFeatureFlag: true,
        });
        useFeatureTogglesStub;

        // const setAttachFileErrorSpy = sandbox.spy();
        // const setAttachFileSuccessSpy = sandbox.spy();
        // const setAttachments = sandbox.spy();

        const props = {
          attachments: [],
          isOhTriageGroup: true,
          setAttachFileError: setAttachFileErrorSpy,
          setAttachFileSuccess: setAttachFileSuccessSpy,
          setAttachments,
        };
        const { getByTestId } = renderInReduxProvider(
          <FileInput {...props} />,
          { reducers: reducer },
        );
        const input = getByTestId('attach-file-input');

        // Test MP4 file (extended type) - should be accepted for OH users
        const mp4File = createTestFile({
          name: 'test.mp4',
          sizeMb: 0.001,
          mimeType: 'video/mp4',
          content: 'video content',
        });

        fireEvent.change(input, {
          target: { files: [mp4File] },
        });

        // For OH users with cernerPilotSmFeatureFlag=true, MP4 should be accepted
        await waitFor(() => {
          expect(setAttachFileSuccessSpy.calledWith(true)).to.be.true;
        });

        // Reset spies for next test
        sandbox.resetHistory();

        // Test MP3 file (not an accepted extended type) - should be rejected
        const mp3File = createTestFile({
          name: 'test.mp3',
          sizeMb: 2,
          mimeType: 'audio/mpeg',
          content: 'music content',
        });

        fireEvent.change(input, {
          target: { files: [mp3File] },
        });

        await waitFor(() => {
          const error = `We can't attach this file type. Try attaching a DOC, DOCX, GIF, JPG, JPEG, PDF, PNG, RTF, TXT, XLS, XLSX, BMP, TIFF, TIF, PPT, PPTX, PPS, PPSX, ODT, MP4, M4V, MOV, WMV, MPG, JFIF, PJPEG, or PJP.`;
          expect(setAttachFileErrorSpy.calledWith({ message: error })).to.be
            .true;
        });
      });

      it('validates single file size - should accept files up to 25MB', async () => {
        const useFeatureTogglesStub = stubUseFeatureToggles({
          largeAttachmentsEnabled: false,
          cernerPilotSmFeatureFlag: true,
        });
        useFeatureTogglesStub;

        // const setAttachFileErrorSpy = sandbox.spy();
        // const setAttachFileSuccessSpy = sandbox.spy();
        // const setAttachments = sandbox.spy();

        const props = {
          attachments: [],
          isOhTriageGroup: true,
          setAttachFileError: setAttachFileErrorSpy,
          setAttachFileSuccess: setAttachFileSuccessSpy,
          setAttachments,
        };
        const { getByTestId } = renderInReduxProvider(
          <FileInput {...props} />,
          { reducers: reducer },
        );
        const input = getByTestId('attach-file-input');

        // Create a 20MB file (under 25MB limit for OH users)

        const validFile = createTestFile({
          name: 'test.png',
          sizeMb: 20,
          mimeType: 'image/png',
          content: 'content',
        });

        fireEvent.change(input, {
          target: { files: [validFile] },
        });

        // Should accept 20MB file for OH users (25MB limit)
        await waitFor(() => {
          expect(setAttachFileSuccessSpy.calledWith(true)).to.be.true;
        });

        // Reset spies for next test
        sandbox.resetHistory();

        // Test a file over 25MB limit - should be rejected
        const largeFile = createTestFile({
          name: 'test.png',
          sizeMb: 30,
          mimeType: 'image/png',
          content: 'content',
        });

        fireEvent.change(input, {
          target: { files: [largeFile] },
        });

        await waitFor(() => {
          expect(
            setAttachFileErrorSpy.calledWith({
              message:
                'Your file is too large. Try attaching a file smaller than 25MB.',
            }),
          ).to.be.true;
        });
      });

      it('validates total file size - should accept total files up to 25MB', async () => {
        const useFeatureTogglesStub = stubUseFeatureToggles({
          largeAttachmentsEnabled: false,
          cernerPilotSmFeatureFlag: true,
        });
        useFeatureTogglesStub;

        // const setAttachFileErrorSpy = sandbox.spy();
        // const setAttachFileSuccessSpy = sandbox.spy();
        // const setAttachments = sandbox.spy();

        // Create existing attachments totaling 15MB
        const existingAttachments = [
          { name: 'existing.png', size: 15 * 1024 * 1024, type: 'image/png' },
        ];

        const props = {
          attachments: existingAttachments,
          isOhTriageGroup: true,
          setAttachFileError: setAttachFileErrorSpy,
          setAttachFileSuccess: setAttachFileSuccessSpy,
          setAttachments,
        };
        const { getByTestId } = renderInReduxProvider(
          <FileInput {...props} />,
          { reducers: reducer },
        );
        const input = getByTestId('attach-file-input');

        // Add 9MB file (total would be 24MB, under 25MB limit for OH users)
        const newFile = createTestFile({
          name: 'test.png',
          sizeMb: 9,
          mimeType: 'image/png',
          content: 'content',
        });

        fireEvent.change(input, {
          target: { files: [newFile] },
        });

        // Should accept when total is under 25MB for OH users
        await waitFor(() => {
          // Check that setAttachments was called, which means file was accepted
          expect(setAttachments.called).to.be.true;
        });

        // Reset spies for next test
        sandbox.resetHistory();

        // Test file that would exceed total limit (15MB + 12MB = 27MB > 25MB)
        const largeFile = createTestFile({
          name: 'test2.png',
          sizeMb: 12,
          mimeType: 'image/png',
          content: 'content',
        });

        fireEvent.change(input, {
          target: { files: [largeFile] },
        });

        await waitFor(() => {
          expect(
            setAttachFileErrorSpy.calledWith({
              message:
                'Your files are too large. The total size of all files must be smaller than 25MB.',
            }),
          ).to.be.true;
        });
      });
    });

    describe('when isOhTriageGroup is false', () => {
      it('validates file types - should only accept basic file types', async () => {
        const useFeatureTogglesStub = stubUseFeatureToggles({
          largeAttachmentsEnabled: false,
          cernerPilotSmFeatureFlag: true,
        });
        useFeatureTogglesStub;

        const props = {
          attachments: [],
          isOhTriageGroup: false, // Non-OH users
          setAttachFileError: setAttachFileErrorSpy,
          setAttachFileSuccess: setAttachFileSuccessSpy,
          setAttachments,
        };
        const { getByTestId } = renderInReduxProvider(
          <FileInput {...props} />,
          { reducers: reducer },
        );
        const input = getByTestId('attach-file-input');

        // Test basic file type (PNG) - should be accepted for non-OH users
        const pngFile = createTestFile({
          name: 'test.png',
          sizeMb: 2,
          mimeType: 'image/png',
          content: 'image content',
        });

        fireEvent.change(input, {
          target: { files: [pngFile] },
        });

        await waitFor(() => {
          expect(setAttachFileSuccessSpy.calledWith(true)).to.be.true;
        });

        // Reset spies for next test
        sandbox.resetHistory();

        // Test MP4 file (extended type) - should be rejected for non-OH users
        const mp4File = createTestFile({
          name: 'test.mp4',
          sizeMb: 2,
          mimeType: 'video/mp4',
          content: 'video content',
        });

        fireEvent.change(input, {
          target: { files: [mp4File] },
        });

        await waitFor(() => {
          expect(
            setAttachFileErrorSpy.calledWith({
              message: `We can't attach this file type. Try attaching a DOC, DOCX, GIF, JPG, JPEG, PDF, PNG, RTF, TXT, XLS, XLSX, JFIF, PJPEG, or PJP.`,
            }),
          ).to.be.true;
        });
      });

      it('validates single file size - should reject files over 6MB', async () => {
        const useFeatureTogglesStub = stubUseFeatureToggles({
          largeAttachmentsEnabled: false,
          cernerPilotSmFeatureFlag: true,
        });
        useFeatureTogglesStub;

        const props = {
          attachments: [],
          isOhTriageGroup: false, // Non-OH users
          setAttachFileError: setAttachFileErrorSpy,
          setAttachFileSuccess: setAttachFileSuccessSpy,
          setAttachments,
        };
        const { getByTestId } = renderInReduxProvider(
          <FileInput {...props} />,
          { reducers: reducer },
        );
        const input = getByTestId('attach-file-input');

        // Test valid file under 6MB limit
        const validFile = createTestFile({
          name: 'test.png',
          content: 'content',
          type: 'image/png',
          sizeMb: 5,
        });

        fireEvent.change(input, {
          target: { files: [validFile] },
        });

        await waitFor(() => {
          expect(setAttachFileSuccessSpy.calledWith(true)).to.be.true;
        });

        // Reset spies for next test
        sandbox.resetHistory();

        // Create an 8MB file (over 6MB limit)
        const largeFile = createTestFile({
          name: 'test.png',
          type: 'image/png',
          sizeMb: 8,
          content: 'content-image',
        });

        fireEvent.change(input, {
          target: { files: [largeFile] },
        });

        await waitFor(() => {
          expect(
            setAttachFileErrorSpy.calledWith({
              message:
                'Your file is too large. Try attaching a file smaller than 6MB.',
            }),
          ).to.be.true;
        });
      });

      it('validates total file size - should reject when total exceeds 10MB', async () => {
        const useFeatureTogglesStub = stubUseFeatureToggles({
          largeAttachmentsEnabled: false,
          cernerPilotSmFeatureFlag: true,
        });
        useFeatureTogglesStub;

        // Create existing attachments totaling 7MB
        const existingAttachments = [
          { name: 'existing.png', size: 7 * 1024 * 1024, type: 'image/png' },
        ];

        const props = {
          attachments: existingAttachments,
          isOhTriageGroup: false, // Non-OH users
          setAttachFileError: setAttachFileErrorSpy,
          setAttachFileSuccess: setAttachFileSuccessSpy,
          setAttachments,
        };
        const { getByTestId } = renderInReduxProvider(
          <FileInput {...props} />,
          { reducers: reducer },
        );
        const input = getByTestId('attach-file-input');

        // Add 2MB file (total would be 9MB, under 10MB limit)

        const validFile = createTestFile({
          name: 'test.png',
          sizeMb: 2,
          mimeType: 'image/png',
        });

        fireEvent.change(input, {
          target: { files: [validFile] },
        });

        await waitFor(() => {
          // Check that setAttachments was called, which means file was accepted
          expect(setAttachments.called).to.be.true;
        });

        // Reset spies for next test
        sandbox.resetHistory();

        // Add 5MB file (total would be 12MB, over 10MB limit)
        const largeFile = createTestFile({
          content: 'content',
          mimeType: 'image/png',
          sizeMb: 5,
          name: 'test2.png',
        });

        fireEvent.change(input, {
          target: { files: [largeFile] },
        });

        await waitFor(() => {
          expect(
            setAttachFileErrorSpy.calledWith({
              message:
                'Your files are too large. The total size of all files must be smaller than 10MB.',
            }),
          ).to.be.true;
        });
      });
    });

    describe('when largeAttachmentsEnabled is true', () => {
      it('validates file types - should accept extended file types for all users', async () => {
        const useFeatureTogglesStub = stubUseFeatureToggles({
          largeAttachmentsEnabled: true,
          cernerPilotSmFeatureFlag: false,
        });
        useFeatureTogglesStub;

        const props = {
          attachments: [],
          isOhTriageGroup: false, // Even non-OH users get extended types when largeAttachmentsEnabled=true
          setAttachFileError: setAttachFileErrorSpy,
          setAttachFileSuccess: setAttachFileSuccessSpy,
          setAttachments,
        };
        const { getByTestId } = renderInReduxProvider(
          <FileInput {...props} />,
          { reducers: reducer },
        );
        const input = getByTestId('attach-file-input');

        // Test BMP file (extended type) - should be accepted when largeAttachmentsEnabled=true
        const bmpFile = createTestFile({
          name: 'test.bmp',
          mimeType: 'image/bmp',
          sizeMb: 1,
          content: 'image content',
        });

        fireEvent.change(input, {
          target: { files: [bmpFile] },
        });

        await waitFor(() => {
          expect(setAttachFileSuccessSpy.calledWith(true)).to.be.true;
        });

        // Reset spies for next test
        sandbox.resetHistory();

        // Test MP4 file (extended type) - should also be accepted when largeAttachmentsEnabled=true
        const mp4File = createTestFile({
          content: 'video content',
          mimeType: 'video/mp4',
          sizeMb: 1,
          name: 'test.mp4',
        });

        fireEvent.change(input, {
          target: { files: [mp4File] },
        });

        await waitFor(() => {
          expect(setAttachFileSuccessSpy.calledWith(true)).to.be.true;
        });

        // Reset spies for next test
        sandbox.resetHistory();

        // Test unsupported file type (MP3) - should be rejected
        const mp3File = createTestFile({
          name: 'test.mp3',
          sizeMb: 0.001,
          mimeType: 'audio/mpeg',
          content: 'audio content',
        });

        fireEvent.change(input, {
          target: { files: [mp3File] },
        });

        await waitFor(() => {
          expect(
            setAttachFileErrorSpy.calledWith({
              message: `We can't attach this file type. Try attaching a DOC, DOCX, GIF, JPG, JPEG, PDF, PNG, RTF, TXT, XLS, XLSX, BMP, TIFF, TIF, PPT, PPTX, PPS, PPSX, ODT, MP4, M4V, MOV, WMV, MPG, JFIF, PJPEG, or PJP.`,
            }),
          ).to.be.true;
        });
      });

      it('validates single file size - should accept files up to 25MB for all users', async () => {
        const useFeatureTogglesStub = stubUseFeatureToggles({
          largeAttachmentsEnabled: true,
          cernerPilotSmFeatureFlag: false,
        });
        useFeatureTogglesStub;

        const props = {
          attachments: [],
          isOhTriageGroup: false, // Even non-OH users get 25MB limit when largeAttachmentsEnabled=true
          setAttachFileError: setAttachFileErrorSpy,
          setAttachFileSuccess: setAttachFileSuccessSpy,
          setAttachments,
        };
        const { getByTestId } = renderInReduxProvider(
          <FileInput {...props} />,
          { reducers: reducer },
        );
        const input = getByTestId('attach-file-input');

        // Create a 20MB file (under 25MB limit when largeAttachmentsEnabled=true)
        const validFile = createTestFile({
          name: 'test.png',
          sizeMb: 20,
          mimeType: 'image/png',
          content: 'content',
        });

        fireEvent.change(input, {
          target: { files: [validFile] },
        });

        await waitFor(() => {
          expect(setAttachFileSuccessSpy.calledWith(true)).to.be.true;
          expect(setAttachFileSuccessSpy.calledWith(true)).to.be.true;
        });

        // Reset spies for next test

        // Test file over 25MB limit - should be rejected
        const largeFile = createTestFile({
          name: 'test.png',
          sizeMb: 30,
          mimeType: 'image/png',
          content: 'content',
        });

        fireEvent.change(input, {
          target: { files: [largeFile] },
        });

        await waitFor(() => {
          expect(
            setAttachFileErrorSpy.calledWith({
              message:
                'Your file is too large. Try attaching a file smaller than 25MB.',
            }),
          ).to.be.true;
        });
      });

      it('validates total file size - should accept total files up to 25MB for all users', async () => {
        const useFeatureTogglesStub = stubUseFeatureToggles({
          largeAttachmentsEnabled: true,
          cernerPilotSmFeatureFlag: false,
        });
        useFeatureTogglesStub;

        // Create existing attachments totaling 15MB
        const existingAttachments = [
          { name: 'existing.png', size: 15 * 1024 * 1024, type: 'image/png' },
        ];

        const props = {
          attachments: existingAttachments,
          isOhTriageGroup: false, // Even non-OH users get 25MB total limit when largeAttachmentsEnabled=true
          setAttachFileError: setAttachFileErrorSpy,
          setAttachFileSuccess: setAttachFileSuccessSpy,
          setAttachments,
        };
        const { getByTestId } = renderInReduxProvider(
          <FileInput {...props} />,
          { reducers: reducer },
        );
        const input = getByTestId('attach-file-input');

        // Add 9MB file (total would be 24MB, under 25MB limit when largeAttachmentsEnabled=true)
        const validFile = createTestFile({
          name: 'test.png',
          sizeMb: 9,
          mimeType: 'image/png',
          content: 'content',
        });

        fireEvent.change(input, {
          target: { files: [validFile] },
        });

        await waitFor(() => {
          // Check that setAttachments was called, which means file was accepted
          expect(setAttachments.called).to.be.true;
        });

        // Reset spies for next test
        sandbox.resetHistory();

        // Test file that would exceed total limit (15MB + 12MB = 27MB > 25MB)
        const largeFile = createTestFile({
          name: 'test2.png',
          sizeMb: 12,
          mimeType: 'image/png',
          content: 'content',
        });

        fireEvent.change(input, {
          target: { files: [largeFile] },
        });

        await waitFor(() => {
          expect(
            setAttachFileErrorSpy.calledWith({
              message:
                'Your files are too large. The total size of all files must be smaller than 25MB.',
            }),
          ).to.be.true;
        });
      });
    });

    describe('when largeAttachmentsEnabled is false', () => {
      it('validates file types - should use standard file type restrictions', async () => {
        const useFeatureTogglesStub = stubUseFeatureToggles({
          largeAttachmentsEnabled: false,
          cernerPilotSmFeatureFlag: false,
        });
        useFeatureTogglesStub;

        const props = {
          attachments: [],
          isOhTriageGroup: false, // Standard rules apply when both flags are false
          setAttachFileError: setAttachFileErrorSpy,
          setAttachFileSuccess: setAttachFileSuccessSpy,
          setAttachments,
        };
        const { getByTestId } = renderInReduxProvider(
          <FileInput {...props} />,
          { reducers: reducer },
        );
        const input = getByTestId('attach-file-input');

        // Test basic file type (PNG) - should be accepted
        const pngFile = createTestFile({
          name: 'test.png',
          sizeMb: 0.001,
          mimeType: 'image/png',
          content: 'image content',
        });

        fireEvent.change(input, {
          target: { files: [pngFile] },
        });

        await waitFor(() => {
          expect(setAttachFileSuccessSpy.calledWith(true)).to.be.true;
          expect(setAttachFileSuccessSpy.calledWith(true)).to.be.true;
        });

        // Reset spies for next test

        // Test TIFF file (extended type) - should be rejected when largeAttachmentsEnabled=false
        const tiffFile = createTestFile({
          name: 'test.tiff',
          sizeMb: 0.001,
          mimeType: 'image/tiff',
          content: 'image content',
        });

        fireEvent.change(input, {
          target: { files: [tiffFile] },
        });

        await waitFor(() => {
          expect(
            setAttachFileErrorSpy.calledWith({
              message: `We can't attach this file type. Try attaching a DOC, DOCX, GIF, JPG, JPEG, PDF, PNG, RTF, TXT, XLS, XLSX, JFIF, PJPEG, or PJP.`,
            }),
          ).to.be.true;
        });
      });

      it('validates single file size - should use standard 6MB limit', async () => {
        const useFeatureTogglesStub = stubUseFeatureToggles({
          largeAttachmentsEnabled: false,
          cernerPilotSmFeatureFlag: false,
        });
        useFeatureTogglesStub;

        const props = {
          attachments: [],
          isOhTriageGroup: false, // Standard 6MB limit when both flags are false
          setAttachFileError: setAttachFileErrorSpy,
          setAttachFileSuccess: setAttachFileSuccessSpy,
          setAttachments,
        };
        const { getByTestId } = renderInReduxProvider(
          <FileInput {...props} />,
          { reducers: reducer },
        );
        const input = getByTestId('attach-file-input');

        // Test valid file under 6MB limit
        const validFile = createTestFile({
          name: 'test.png',
          sizeMb: 5,
          mimeType: 'image/png',
          content: 'content',
        });

        fireEvent.change(input, {
          target: { files: [validFile] },
        });

        await waitFor(() => {
          expect(setAttachFileSuccessSpy.calledWith(true)).to.be.true;
          expect(setAttachFileSuccessSpy.calledWith(true)).to.be.true;
        });

        // Reset spies for next test

        // Create a 7MB file (over 6MB limit)
        const largeFile = createTestFile({
          name: 'test.png',
          sizeMb: 7,
          mimeType: 'image/png',
          content: 'content',
        });

        fireEvent.change(input, {
          target: { files: [largeFile] },
        });

        await waitFor(() => {
          expect(
            setAttachFileErrorSpy.calledWith({
              message:
                'Your file is too large. Try attaching a file smaller than 6MB.',
            }),
          ).to.be.true;
        });
      });

      it('validates total file size - should use standard 10MB limit', async () => {
        const useFeatureTogglesStub = stubUseFeatureToggles({
          largeAttachmentsEnabled: false,
          cernerPilotSmFeatureFlag: false,
        });
        useFeatureTogglesStub;

        // Create existing attachments totaling 7MB
        const existingAttachments = [
          { name: 'existing.png', size: 7 * 1024 * 1024, type: 'image/png' },
        ];

        const props = {
          attachments: existingAttachments,
          isOhTriageGroup: false, // Standard 10MB total limit when both flags are false
          setAttachFileError: setAttachFileErrorSpy,
          setAttachFileSuccess: setAttachFileSuccessSpy,
          setAttachments,
        };
        const { getByTestId } = renderInReduxProvider(
          <FileInput {...props} />,
          { reducers: reducer },
        );
        const input = getByTestId('attach-file-input');

        // Add 2MB file (total would be 9MB, under 10MB limit)
        const validFile = createTestFile({
          name: 'test.png',
          sizeMb: 2,
          mimeType: 'image/png',
          content: 'content',
        });

        fireEvent.change(input, {
          target: { files: [validFile] },
        });

        await waitFor(() => {
          // Check that setAttachments was called, which means file was accepted
          expect(setAttachments.called).to.be.true;
        });

        // Reset spies for next test
        sandbox.resetHistory();

        // Add 5MB file (total would be 12MB, over 10MB limit)
        const largeFile = createTestFile({
          name: 'test2.png',
          sizeMb: 5,
          mimeType: 'image/png',
          content: 'content',
        });

        fireEvent.change(input, {
          target: { files: [largeFile] },
        });

        await waitFor(() => {
          expect(
            setAttachFileErrorSpy.calledWith({
              message:
                'Your files are too large. The total size of all files must be smaller than 10MB.',
            }),
          ).to.be.true;
        });
      });
    });
  });
});
