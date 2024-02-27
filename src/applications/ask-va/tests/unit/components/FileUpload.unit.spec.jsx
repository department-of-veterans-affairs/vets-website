import { fireEvent, waitFor } from '@testing-library/dom';
import { render } from '@testing-library/react';
import { expect } from 'chai';
import React from 'react';
import FileUpload from '../../../components/FileUpload';

describe('<FileUpload />', () => {
  it('renders FileUpload component', async () => {
    const screen = render(<FileUpload />);

    expect(screen.getByTestId('file-upload-header')).to.exist;
    expect(screen.getByTestId('file-upload-header')).to.contain.text(
      'Upload your files',
    );
  });

  it('displays a message when there are no attachments', () => {
    const screen = render(<FileUpload />);

    expect(screen.getByText('There are no attachments.')).to.exist;
  });

  it('displays a success message for uploads', () => {
    const success = true;
    const props = { success };
    const screen = render(<FileUpload {...props} />);

    expect(screen.getByText('File attached successfully')).to.exist;
  });

  it('displays a failure message for uploads', () => {
    const success = false;
    const props = { success };
    const screen = render(<FileUpload {...props} />);

    expect(screen.getByText('Issue uploading your file')).to.exist;
  });

  it('allows the user to add a file', async () => {
    const screen = render(<FileUpload />);

    const file = new File(['hello'], 'hello.png', { type: 'image/png' });
    const input = screen.getByTestId('ask-va-file-upload-button');

    await waitFor(() => fireEvent.change(input, { target: { files: [file] } }));
    expect(input.files[0].name).to.equal('hello.png');
  });
});
