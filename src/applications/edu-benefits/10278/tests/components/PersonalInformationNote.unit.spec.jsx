import React from 'react';
import { expect } from 'chai';
import { render } from '@testing-library/react';

import PersonalInformationNote from '../../components/PersonalInformationNote';

describe('<PersonalInformationNote />', () => {
  it('should render the link with correct text and href', () => {
    const { container } = render(<PersonalInformationNote />);
    const link = container.querySelector('va-link');
    expect(link).to.exist;
    expect(link.getAttribute('text')).to.equal(
      'Find more detailed instructions for how to change your legal name',
    );
    expect(link.getAttribute('href')).to.equal(
      'https://www.va.gov/resources/how-to-change-your-legal-name-on-file-with-va/',
    );
    expect(link).to.have.attribute('external');
  });
});
