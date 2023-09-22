import React from 'react';
import { expect } from 'chai';
import { render } from '@testing-library/react';

import ClaimLetterListItem from '../../../components/ClaimLetterListItem';

const mockLetter = {
  documentId: '{27832B64-2D88-4DEE-9F6F-DF80E4CAAA87}',
  receivedAt: '2022-09-22',
  docType: '184',
  typeDescription: 'Notification Letter (e.g. VA 20-8993, VA 21-0290, PCGL)',
};

const mockLetterWithoutDocType = { ...mockLetter };
delete mockLetterWithoutDocType.docType;

describe('<ClaimLetterListItem>', () => {
  it('should render', () => {
    const { container } = render(<ClaimLetterListItem letter={mockLetter} />);

    expect(container).to.exist;
  });

  it('should have the correct title', () => {
    const screen = render(<ClaimLetterListItem letter={mockLetter} />);

    const title = screen.getByRole('heading', { level: 2 });
    expect(title.textContent).to.eq('September 22, 2022 letter');
  });

  it('should have the correct description', () => {
    const screen = render(<ClaimLetterListItem letter={mockLetter} />);

    expect(screen.getByText(/Notification Letter/i)).to.exist;
  });

  it('should use the default description when no `docType` is provided', () => {
    const screen = render(
      <ClaimLetterListItem letter={mockLetterWithoutDocType} />,
    );

    expect(screen.getByText(/Notification Letter/i)).to.exist;
  });
});
