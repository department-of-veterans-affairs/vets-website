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
});
