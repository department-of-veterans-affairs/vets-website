import React from 'react';
import { expect } from 'chai';
import { render } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom-v5-compat';
import ProofOfAttendanceCard from '../../../../components/complex-claims/pages/ProofOfAttendanceCard';
import { PROOF_OF_ATTENDANCE_FILENAME } from '../../../../constants';

describe('ProofOfAttendanceCard', () => {
  const renderCard = () => {
    return render(
      <MemoryRouter>
        <va-accordion>
          <ProofOfAttendanceCard filename="test-file.pdf" />
        </va-accordion>
      </MemoryRouter>,
    );
  };

  it('renders the accordion item with correct header', () => {
    const { container } = renderCard();
    const accordionItem = container.querySelector('va-accordion-item');
    expect(accordionItem).to.exist;
    expect(accordionItem.getAttribute('header')).to.equal(
      'Proof of attendance',
    );
  });

  it('renders the filename', () => {
    const { getByText } = renderCard();
    expect(getByText('test-file.pdf')).to.exist;
  });

  it('renders the note about filename change', () => {
    const { getByText } = renderCard();
    expect(
      getByText(
        `We've changed your file name to "${PROOF_OF_ATTENDANCE_FILENAME}."`,
        { exact: false },
      ),
    ).to.exist;
  });

  it('renders the Edit link', () => {
    const { getByText } = renderCard();
    expect(getByText('Edit')).to.exist;
  });

  // TODO: Update this test when the proof of attendance page is implemented.
  // This currently points to '/' as a placeholder.
  it('Edit link points to placeholder URL', () => {
    const { getByTestId } = renderCard();
    const editLink = getByTestId('proof-of-attendance-edit-link');
    expect(editLink.getAttribute('href')).to.eq('/');
  });

  it('renders the va-card', () => {
    const { getByTestId } = renderCard();
    expect(getByTestId('proof-of-attendance-card')).to.exist;
  });
});
