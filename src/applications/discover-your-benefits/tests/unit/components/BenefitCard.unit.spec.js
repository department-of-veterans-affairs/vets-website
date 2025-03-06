import React from 'react';
import { render } from '@testing-library/react';
import { expect } from 'chai';
import { BENEFITS_LIST } from '../../../constants/benefits';

import BenefitCard from '../../../components/BenefitCard';

describe('<BenefitCard>', () => {
  it('renders benefit card', () => {
    const benefit = BENEFITS_LIST[0];
    const { container } = render(<BenefitCard benefit={benefit} />);

    expect(container.querySelector('h3')).to.contain.text(benefit.name);
    expect(container.querySelector('p')).to.have.text(benefit.description);
    expect(container.querySelectorAll('va-link')).to.have.lengthOf(1);
    expect(container.querySelectorAll('va-link-action')).to.have.lengthOf(1);
  });

  it('renders time sensitive benefit card', () => {
    const benefit = BENEFITS_LIST.find(b => b.isTimeSensitive);
    const { container } = render(<BenefitCard benefit={benefit} />);

    expect(container.querySelector('h3')).to.contain.text(benefit.name);
    expect(container.querySelector('p')).to.have.text(benefit.description);
    expect(container.querySelector('div.blue-heading')).to.exist;
    expect(container.querySelectorAll('va-link')).to.have.lengthOf(1);
  });
});
