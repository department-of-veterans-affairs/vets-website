import React from 'react';
import { expect } from 'chai';
import { render } from '@testing-library/react';
import EmploymentIntro from '../../../../components/03-employment-information-chapter/EmploymentInformationIntro';

describe('Employment Information Intro Page', () => {
  it('renders the intro page paragraphs and list items', () => {
    const { getByText, getAllByRole } = render(<EmploymentIntro />);
    // Check for key phrases in the remaining paragraphs
    expect(
      getByText(
        /Over the next few pages, we will ask you questions about your employment information./,
      ),
    ).to.exist;
    expect(
      getByText(
        /employment encompasses all part-time and full-time employment, including self-employment, externships, internships/,
      ),
    );
    expect(
      getByText(
        /to include educational services and consulting, regardless of when this employment took place./,
      ),
    ).to.exist;
    expect(getByText(/You will need to provide your current employment status/))
      .to.exist;
    const items = [
      'Name of employer',
      'Position title',
      'Supervisor name',
      'Employer address and phone number',
      'Employment start and end dates (month/year)',
      'Reason for leaving (if applicable)',
      'Whether you have been involved in specific professional activities related to Veterans',
    ];
    const listItems = getAllByRole('listitem');
    expect(listItems.length).to.equal(items.length);
    items.forEach((text, idx) => {
      expect(listItems[idx].textContent).to.equal(text);
    });
  });
});
