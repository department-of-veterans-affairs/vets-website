import React from 'react';
import { expect } from 'chai';
import { render } from '@testing-library/react';

import NeedHelp from '../../components/NeedHelp';

describe('<NeedHelp />', () => {
  it('should render va-need-help with a va-link', () => {
    const { container } = render(<NeedHelp />);

    const needHelp = container.querySelector('va-need-help');
    expect(needHelp).to.exist;

    const link = container.querySelector('va-link');
    expect(link).to.exist;
    expect(link.getAttribute('href')).to.contain(
      'https://www.benefits.va.gov/gibill/resources/education_resources/school_certifying_officials/elr.asp',
    );
  });
});
