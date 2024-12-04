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
  });
});
