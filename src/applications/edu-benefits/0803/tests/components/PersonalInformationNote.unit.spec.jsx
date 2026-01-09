import React from 'react';
import { expect } from 'chai';
import { render } from '@testing-library/react';

import PersonalInformationNote from '../../components/PersonalInformationNote';

describe('<PersonalInformationNote />', () => {
  it('should contain the correct text', () => {
    const { container } = render(<PersonalInformationNote />);

    expect(container.textContent).to.contain(
      'To protect your personal information, we don’t allow online changes to your name, Social Security number, or date of birth',
    );
    const link = container.querySelector('va-link');
    expect(link).to.exist;
    expect(link.getAttribute('text')).to.eq(
      'Learn how to change your legal name',
    );
  });
});
