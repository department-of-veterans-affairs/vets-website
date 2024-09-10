import React from 'react';
import { expect } from 'chai';
import { fireEvent, render, waitFor } from '@testing-library/react';
import FileInput from '../../../components/ComposeForm/FileInput';
import { ErrorMessages } from '../../../util/constants';

describe('File input component', () => {
  const attachments = [];
  it('renders without errors', () => {
    const { container } = render(<FileInput attachments={attachments} />);
    const main = container.getElementsByClassName('file-input');
    expect(main.length).to.equal(1);
  });

  it('should contain a file input', () => {
    const screen = render(<FileInput attachments={attachments} />);
    const attachFileButton = screen.getByTestId('attach-file-input');

    expect(attachFileButton).to.exist;
  });

  it('should contain a button to attach files', () => {
    const screen = render(<FileInput attachments={attachments} />);
    const attachFileButton = screen.getByTestId('attach-file-button');

    expect(attachFileButton).to.exist;
    fireEvent.click(attachFileButton);
  });

  it('should allow a file to be attached', async () => {
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

  it('should display an error message when a file is 0B', async () => {
    const file = new File([''], 'test.png', { type: 'image/png' });
    const screen = render(<FileInput attachments={attachments} />);

    const uploader = screen.getByTestId('attach-file-input');

    await waitFor(() =>
      fireEvent.change(uploader, {
        target: { files: [file] },
      }),
    );

    const error = screen.getByTestId('file-input-error-message');
    expect(error).to.exist;
    expect(error.textContent).to.equal(
      ErrorMessages.ComposeForm.ATTACHMENTS.FILE_EMPTY,
    );
  });

  it('should display an error message when a file is not an accepted file type', async () => {
    const file = new File(['(⌐□_□)'], 'test.zip', {
      type: 'application/zip',
    });
    const screen = render(<FileInput attachments={attachments} />);

    const uploader = screen.getByTestId('attach-file-input');

    await waitFor(() =>
      fireEvent.change(uploader, {
        target: { files: [file] },
      }),
    );

    const error = screen.getByTestId('file-input-error-message');
    expect(error).to.exist;
    expect(error.textContent).to.equal(
      ErrorMessages.ComposeForm.ATTACHMENTS.INVALID_FILE_TYPE,
    );
  });

  it('should display an error message when a file is a duplicate', async () => {
    const file = new File(['(⌐□_□)'], 'test.png', { type: 'image/png' });

    const customAttachments = [];
    customAttachments.push(file);
    const screen = render(<FileInput attachments={customAttachments} />);
    const uploader = screen.getByTestId('attach-file-input');
    await waitFor(() =>
      fireEvent.change(uploader, {
        target: { files: [file] },
      }),
    );
    const error = screen.getByTestId('file-input-error-message');
    expect(error.textContent).to.equal('You have already attached this file.');
  });

  it('should display an error message when a file with the same name but different size is a duplicate', async () => {
    const oneAttachment = [{ name: 'test.png', size: 100, type: 'image/png' }];
    const file = new File(['(⌐□_□)'], 'test.png', {
      type: 'image/png',
      size: 200,
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
    const error = screen.getByTestId('file-input-error-message');
    expect(error.textContent).to.equal('You have already attached this file.');
  });

  it('should display an error message when a file is over 6MB', async () => {
    const largeFileSizeInBytes = 7 * 1024 * 1024; // 7MB

    const largeFileBuffer = new ArrayBuffer(largeFileSizeInBytes);
    const largeFileBlob = new Blob([largeFileBuffer], {
      type: 'application/octet-stream',
    });

    const largeFile = new File([largeFileBlob], 'large_file.txt', {
      type: 'application/octet-stream',
      lastModified: new Date().getTime(),
    });

    const screen = render(<FileInput attachments={attachments} />);
    const uploader = screen.getByTestId('attach-file-input');
    await waitFor(() =>
      fireEvent.change(uploader, {
        target: { files: [largeFile] },
      }),
    );
    const error = screen.getByTestId('file-input-error-message');
    expect(error.textContent).to.equal(
      ErrorMessages.ComposeForm.ATTACHMENTS.FILE_TOO_LARGE,
    );
  });

  it(' should display an error message when attaching a new file increases total atatchments size over 10MB', async () => {
    const oneMB = 1024 * 1024;
    const customAttachments = [
      { name: 'test1.png', size: 4 * oneMB, type: 'image/png' },
      { name: 'test2.png', size: 4 * oneMB, type: 'image/png' },
    ];
    const largeFileSizeInBytes = 3 * oneMB; // 7MB

    const largeFileBuffer = new ArrayBuffer(largeFileSizeInBytes);
    const largeFileBlob = new Blob([largeFileBuffer], {
      type: 'application/octet-stream',
    });

    const largeFile = new File([largeFileBlob], 'large_file.txt', {
      type: 'application/octet-stream',
      lastModified: new Date().getTime(),
    });

    const screen = render(<FileInput attachments={customAttachments} />);
    const uploader = screen.getByTestId('attach-file-input');
    await waitFor(() =>
      fireEvent.change(uploader, {
        target: { files: [largeFile] },
      }),
    );
    const error = screen.getByTestId('file-input-error-message');
    expect(error.textContent).to.equal(
      ErrorMessages.ComposeForm.ATTACHMENTS.TOTAL_MAX_FILE_SIZE_EXCEEDED,
    );
  });
});
