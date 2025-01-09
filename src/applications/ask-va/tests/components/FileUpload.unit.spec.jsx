import { fireEvent, waitFor } from '@testing-library/dom';
import { render } from '@testing-library/react';
import { expect } from 'chai';
import React from 'react';
import FileUpload from '../../components/FileUpload';

describe('<FileUpload />', () => {
  it('allows the user to add a file', async () => {
    const screen = render(<FileUpload />);

    const file = new File(['hello'], 'hello.png', { type: 'image/png' });
    const input = screen.getByTestId('askVA_upload_first');

    await waitFor(() => fireEvent.change(input, { target: { files: [file] } }));
    expect(input.files[0].name).to.equal('hello.png');
  });
});
