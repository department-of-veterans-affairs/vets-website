import React from 'react';
import { expect } from 'chai';
import { fireEvent, render, waitFor } from '@testing-library/react';
import FileInput from '../../../components/ComposeForm/FileInput';

describe('File input component', () => {
  it('renders without errors', () => {
    const { container } = render(<FileInput />);
    const main = container.getElementsByClassName('file-input');
    expect(main.length).to.equal(1);
  });

  it('should contain a file input', () => {
    const screen = render(<FileInput />);
    const attachFileButton = screen.getByTestId('attach-file-input');

    expect(attachFileButton).to.exist;
  });

  it('should contain an button to attach files', () => {
    const screen = render(<FileInput />);
    const attachFileButton = screen.getByTestId('attach-file-button');

    expect(attachFileButton).to.exist;
  });

  it('should contain an button to attach files', () => {
    const screen = render(<FileInput />);
    const attachFileButton = screen.getByTestId('attach-file-button');

    expect(attachFileButton).to.exist;
  });

  it('should allow a file to be attached', async () => {
    const file = new File(['(⌐□_□)'], 'test.png', { type: 'image/png' });
    const screen = render(<FileInput />);

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
});
