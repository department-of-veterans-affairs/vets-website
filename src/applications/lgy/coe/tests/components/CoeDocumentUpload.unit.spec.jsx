import React from 'react';
import { render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { expect } from 'chai';

import { CoeDocumentUpload } from '../../components/CoeDocumentUpload';

describe('CoeDocumentUpload', () => {
  it('should render with the expected fields', () => {
    const screen = render(<CoeDocumentUpload />);
    expect(screen.getByRole('button', { name: /Upload this document/i })).to
      .exist;
    expect(screen.getAllByRole('combobox').length).to.equal(1);
  });

  it('should conditionally display a text field', () => {
    const screen = render(<CoeDocumentUpload />);
    expect(screen.getAllByRole('combobox').length).to.equal(1);
    userEvent.selectOptions(screen.getByRole('combobox'), ['Other']);
    expect(screen.getByRole('option', { name: 'Other' }).selected).to.be.true;
    expect(screen.getByLabelText(/Document description/i)).to.exist;
  });

  it('should display an uploaded file', () => {
    const file = new File(['hello'], 'hello.png', { type: 'image/png' });
    const screen = render(<CoeDocumentUpload />);
    const input = screen.getByLabelText(/Upload this document/i);
    expect(input).to.exist;
    userEvent.selectOptions(screen.getByRole('combobox'), [
      'Discharge or seperation papers (DD214)',
    ]);
    userEvent.upload(input, file);
    expect(input.files[0]).to.equal(file);
    expect(input.files.item(0)).to.equal(file);
    expect(input.files).to.have.lengthOf(1);
    expect(screen.getByText('hello.png')).to.exist;
  });
});
