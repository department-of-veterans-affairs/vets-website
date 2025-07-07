import React from 'react';
import { render, within } from '@testing-library/react';
import { expect } from 'chai';
import ClaimantInfoViewField from '../../../components/ClaimantInfoViewField';

describe('ClaimantInfoViewField', () => {
  const defaultEditButton = () => <va-button text="edit" />;

  it('shows correct information for dependent claim', () => {
    const formData = {
      veteranSsn: '123-45-6789',
      veteranFullName: { first: 'John', last: 'Doe' },
      address: { postalCode: '12345' },
      vaFileNumber: '123456789',
      claimantSsn: '987-65-4321',
      claimantFullName: { first: 'Jane', last: 'Doe' },
      claimantDateOfBirth: '2010-05-21',
    };

    const { getByText } = render(
      <ClaimantInfoViewField
        formData={formData}
        defaultEditButton={defaultEditButton}
      />,
    );

    const claimantHeader = getByText('Claimant information');
    const veteranHeader = getByText('Veteran identification information');

    const claimantSection = claimantHeader.closest('div');
    const veteranSection = veteranHeader.closest('div');

    const getDtDdValue = (section, label) => {
      const dt = within(section).getByText(label);
      const dd = dt.parentNode.querySelector('dd');
      return dd.textContent.trim();
    };

    expect(getDtDdValue(claimantSection, 'First name')).to.equal('Jane');
    expect(getDtDdValue(claimantSection, 'Last name')).to.equal('Doe');
    expect(getDtDdValue(claimantSection, 'Date of birth')).to.equal(
      '05-21-2010',
    );
    expect(getDtDdValue(claimantSection, 'Social Security Number')).to.include(
      '4321',
    );

    expect(getDtDdValue(veteranSection, 'First name')).to.equal('John');
    expect(getDtDdValue(veteranSection, 'Last name')).to.equal('Doe');
    expect(getDtDdValue(veteranSection, 'Social Security Number')).to.include(
      '6789',
    );
    expect(getDtDdValue(veteranSection, 'Postal code')).to.equal('12345');
    expect(getDtDdValue(veteranSection, 'VA file number')).to.include('6789');
  });

  it('shows veteran info when claimant is the veteran', () => {
    const formData = {
      veteranSsn: '123-45-6789',
      veteranFullName: { first: 'John', last: 'Doe' },
      address: { postalCode: '54321' },
      veteranDateOfBirth: '1975-09-15',
      vaFileNumber: '987654321',
      claimantSsn: undefined,
      claimantFullName: { first: undefined, last: undefined },
      claimantDateOfBirth: undefined,
    };

    const { getByText, queryByText } = render(
      <ClaimantInfoViewField
        formData={formData}
        defaultEditButton={defaultEditButton}
      />,
    );

    const claimantSection = getByText('Claimant information').closest('div');

    const getDtDdValue = (section, label) => {
      const dt = within(section).getByText(label);
      const dd = dt.parentNode.querySelector('dd');
      return dd.textContent.trim();
    };

    expect(getDtDdValue(claimantSection, 'First name')).to.equal('John');
    expect(getDtDdValue(claimantSection, 'Last name')).to.equal('Doe');
    expect(getDtDdValue(claimantSection, 'Date of birth')).to.equal(
      '09-15-1975',
    );
    expect(getDtDdValue(claimantSection, 'Social Security Number')).to.include(
      '6789',
    );
    expect(getDtDdValue(claimantSection, 'Postal code')).to.equal('54321');
    expect(getDtDdValue(claimantSection, 'VA file number')).to.include('4321');

    expect(queryByText('Veteran identification information')).to.be.null;
  });
});
