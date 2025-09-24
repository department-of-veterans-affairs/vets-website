import React from 'react';
import { expect } from 'chai';
import { render } from '@testing-library/react';

import PersonalInformationIntro from '../../../../components/01-personal-information-chapter/PersonalInformationIntro';

describe('PersonalInformationIntro', () => {
  it('renders the intro paragraph and all list items', () => {
    const { getByText, getAllByRole } = render(<PersonalInformationIntro />);

    expect(
      getByText(
        /Over the next few pages, we will ask you for some personal information.\s*You will need to provide the following:/,
      ),
    ).to.exist;

    const items = [
      'Whether you are applying to become an accredited attorney or claims agent',
      'Whether you currently hold a license to practice law',
      'Name, date of birth, and place of birth',
      'Contact information',
    ];
    const listItems = getAllByRole('listitem');
    expect(listItems.length).to.equal(items.length);
    items.forEach((text, idx) => {
      expect(listItems[idx].textContent).to.equal(text);
    });
  });
});
