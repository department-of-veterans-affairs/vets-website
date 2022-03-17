import React from 'react';
import { render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { expect } from 'chai';

import DocumentUploader from '../../../components/DocumentUploader/DocumentUploader.jsx';
// import { testData } from '../../../../../../../../../vets-json-schema/test/schemas/26-1880/testData.js';

describe.skip('DocumentUploader', () => {
  it('should render with the expected fields', () => {
    const screen = render(<DocumentUploader />);
    expect(screen.getByRole('button', { name: /Upload your document/i })).to
      .exist;
    expect(screen.getAllByRole('combobox').length).to.equal(1);
  });

  it('should not submit with no documents', () => {
    const screen = render(<DocumentUploader />);
    userEvent.selectOptions(screen.getByRole('combobox'), [
      'Discharge or separation papers (DD214)',
    ]);
    userEvent.click(screen.getByRole('button', { name: /Submit files/ }));
    expect(screen.getByText(/Please choose a file to upload/i)).to.exist;
  });

  it('should uploaded file', () => {
    const file = new File(['hello'], 'hello.png', {
      type: 'image/png',
    });
    const screen = render(<DocumentUploader />);
    const input = screen.getByLabelText(/Upload your document/i);
    expect(input).to.exist;
    userEvent.selectOptions(screen.getByRole('combobox'), [
      'Discharge or separation papers (DD214)',
    ]);
    userEvent.upload(input, file);
    expect(input.files[0]).to.equal(file);
    expect(input.files.item(0)).to.equal(file);
    expect(input.files).to.have.lengthOf(1);
  });

  it('should upload multiple files', () => {
    const file1 = new File(['hello'], 'hello.png', { type: 'image/png' });
    const file2 = new File(['there'], 'there.png', { type: 'image/png' });
    const screen = render(<DocumentUploader />);
    const input = screen.getByLabelText(/Upload your document/i);
    expect(input).to.exist;
    userEvent.selectOptions(screen.getByRole('combobox'), [
      'Discharge or separation papers (DD214)',
    ]);
    userEvent.upload(input, file1);
    userEvent.upload(input, file2);
    expect(input.files[0]).to.equal(file2);
    expect(input.files.item(0)).to.equal(file2);
    expect(input.files).to.have.lengthOf(1);
  });
});
