import React from 'react';
import { expect } from 'chai';
import { render } from '@testing-library/react';

import { $ } from 'platform/forms-system/src/js/utilities/ui';

import ClaimLetterListItem from '../../../components/ClaimLetterListItem';

describe('<ClaimLetterListItem', () => {
  const mockLetter = {
    documentId: '{27832B64-2D88-4DEE-9F6F-DF80E4CAAA87}',
    receivedAt: '2022-09-22',
    typeDescription: 'Notification Letter (e.g. VA 20-8993, VA 21-0290, PCGL)',
  };

  it('should render', () => {
    const { container } = render(<ClaimLetterListItem letter={mockLetter} />);

    expect($('h2', container).textContent).to.equal(
      'Letter dated September 22, 2022',
    );
    expect($('h2 + div', container).textContent).to.equal(
      'Notification Letter (e.g. VA 20-8993, VA 21-0290, PCGL)',
    );
  });
});
