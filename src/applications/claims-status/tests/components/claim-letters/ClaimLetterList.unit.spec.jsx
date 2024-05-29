import React from 'react';
import { expect } from 'chai';
import { render, within } from '@testing-library/react';

import ClaimLetterList from '../../../components/claim-letters/ClaimLetterList';

const fakeLetters = [
  {
    documentId: '{27832B64-2D88-4DEE-9F6F-DF80E4CAAA87}',
    receivedAt: '2022-09-22',
    docType: '184',
    typeDescription: 'Notification Letter (e.g. VA 20-8993, VA 21-0290, PCGL)',
  },
  {
    documentId: '{27832B64-2D88-4DEE-9F6F-DF80E4CAAA87}',
    receivedAt: '2022-09-22',
    docType: '184',
    typeDescription: 'Notification Letter (e.g. VA 20-8993, VA 21-0290, PCGL)',
  },
];

describe('<ClaimLetterList>', () => {
  it('should render', () => {
    const { container } = render(<ClaimLetterList letters={fakeLetters} />);

    expect(container).to.exist;
  });

  it('should contain 2 elements', () => {
    const screen = render(<ClaimLetterList letters={fakeLetters} />);

    const list = screen.getByRole('list');

    const listItems = within(list).getAllByRole('listitem');
    expect(listItems).to.exist;
    expect(listItems.length).to.equal(2);
  });
});
