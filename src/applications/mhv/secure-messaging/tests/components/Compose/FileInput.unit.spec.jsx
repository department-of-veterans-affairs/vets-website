import React from 'react';
import { expect } from 'chai';
import { fireEvent, render, waitFor } from '@testing-library/react';
import FileInput from '../../../components/ComposeForm/FileInput';

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
  });

  it('should allow a file to be attached', async () => {
    const file = new File(['(⌐□_□)'], 'test.png', { type: 'image/png' });
    const screen = render(
      <FileInput attachments={attachments} setAttachments={() => {}} />,
    );

    const uploader = screen.getByTestId('attach-file-input');

    await waitFor(() =>
      fireEvent.change(uploader, {
        target: { files: [file] },
      }),
    );

    const image = screen.getByTestId('attach-file-input');
    expect(image.files[0].name).to.equal('test.png');
    expect(image.files.length).to.equal(1);
  });

  it('attach button should be hidden when 4 files attached', () => {
    const fourAttachments = [
      { name: 'test1.png', size: 100, type: 'image/png' },
      { name: 'test2.png', size: 200, type: 'image/png' },
      { name: 'test2.png', size: 300, type: 'image/png' },
      { name: 'test4.png', size: 400, type: 'image/png' },
    ];
    const screen = render(<FileInput attachments={fourAttachments} />);
    expect(screen.queryByTestId('attach-file-button')).to.not.exist;
  });
});
