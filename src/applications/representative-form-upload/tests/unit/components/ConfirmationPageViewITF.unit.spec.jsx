import React from 'react';
import { render } from '@testing-library/react';
import { expect } from 'chai';
import { ConfirmationPageViewITF } from '../../../components/ConfirmationPageViewITF';

const veteranFullName = {
  first: 'John',
  middle: '',
  last: 'Veteran',
};
const address = {
  city: 'Boston',
  state: 'MA',
  postalCode: '12345',
};

describe('ConfirmationPageViewITF', () => {
  it('shows status success and the correct confirmation number and submitted date', () => {
    const submitDate = new Date(2024, 4, 21);
    const expirationDate = new Date(2025, 4, 21);

    const { getByText, container } = render(
      <ConfirmationPageViewITF
        submitDate={submitDate}
        expirationDate={expirationDate}
        benefitType="compensation"
        childContent={null}
        name={veteranFullName}
        address={address}
      />,
    );

    expect(container.querySelector('va-alert')).to.have.attr(
      'status',
      'success',
    );
    expect(
      getByText('This information was recorded for the new intent to file.'),
    ).to.exist;
    expect(getByText('May 21, 2025 at 12:00 a.m. ET')).to.exist;
  });
});
