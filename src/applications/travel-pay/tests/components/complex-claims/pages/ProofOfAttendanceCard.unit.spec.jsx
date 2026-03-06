import React from 'react';
import { expect } from 'chai';
import { render } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom-v5-compat';
import ProofOfAttendanceCard from '../../../../components/complex-claims/pages/ProofOfAttendanceCard';
import { PROOF_OF_ATTENDANCE_FILENAME } from '../../../../constants';

describe('ProofOfAttendanceCard', () => {
  const renderCard = (props = {}) => {
    return render(
      <MemoryRouter>
        <ProofOfAttendanceCard
          filename="test-file.pdf"
          apptId="12345"
          claimId="45678"
          {...props}
        />
      </MemoryRouter>,
    );
  };

  it('renders h3 header by default', () => {
    const { container } = renderCard();
    const h3 = container.querySelector('h3');
    expect(h3).to.exist;
    expect(h3.textContent).to.equal('File name');
  });

  it('renders h4 header when decreaseHeaderLevel is true', () => {
    const { container } = renderCard({ decreaseHeaderLevel: true });
    const h4 = container.querySelector('h4');
    expect(h4).to.exist;
    expect(h4.textContent).to.equal('File name');
    expect(container.querySelector('h3')).to.not.exist;
  });

  it('renders the filename', () => {
    const { getByText } = renderCard();
    expect(getByText('test-file.pdf')).to.exist;
  });

  it('renders the note about filename change', () => {
    const { container } = renderCard();
    expect(container.textContent).to.include('changed your file name to');
    expect(container.textContent).to.include(PROOF_OF_ATTENDANCE_FILENAME);
  });

  it('renders the Edit link', () => {
    const { getByText } = renderCard();
    expect(getByText('Edit')).to.exist;
  });

  it('Edit link points to the correct URL to edit the POA file', () => {
    const { getByTestId } = renderCard();
    const editLink = getByTestId('proof-of-attendance-edit-link');
    expect(editLink.getAttribute('href')).to.eq(
      '/file-new-claim/12345/45678/proof-of-attendance',
    );
  });

  it('renders the va-card', () => {
    const { getByTestId } = renderCard();
    expect(getByTestId('proof-of-attendance-card')).to.exist;
  });

  it('does not render Edit link when showEdit is false', () => {
    const { queryByText, queryByTestId } = renderCard({ showEdit: false });
    expect(queryByText('Edit')).to.not.exist;
    expect(queryByTestId('proof-of-attendance-edit-link')).to.not.exist;
  });
});
