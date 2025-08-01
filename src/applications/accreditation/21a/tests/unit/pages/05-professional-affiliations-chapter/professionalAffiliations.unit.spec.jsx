import React from 'react';
import { expect } from 'chai';
import { render } from '@testing-library/react';
import ProfessionalAffiliationsIntro from '../../../../components/05-professional-affiliations-chapter/ProfessionalAffiliationsIntro';

describe('Professional Affiliations Intro', () => {
  it('renders the intro paragraph and all list items', () => {
    const { getByText, getAllByRole } = render(
      <ProfessionalAffiliationsIntro />,
    );
    expect(
      getByText(
        /Over the next few pages, we will ask you to provide information about any jurisdictions, agencies, or courts you are admitted to practice before. For each jurisdiction, agency, or court, you will need to provide the following information:/,
      ),
    ).to.exist;
    const items = [
      'Name of jurisdiction, agency, or court',
      'Date of admission (month/year)',
      'Membership or registration number',
    ];
    const listItems = getAllByRole('listitem');
    expect(listItems.length).to.equal(items.length);
    items.forEach((text, idx) => {
      expect(listItems[idx].textContent).to.equal(text);
    });
  });
});
