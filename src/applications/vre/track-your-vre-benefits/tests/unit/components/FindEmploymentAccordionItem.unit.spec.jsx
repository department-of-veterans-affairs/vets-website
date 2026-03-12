import React from 'react';
import { expect } from 'chai';
import { render } from '@testing-library/react';
import FindEmploymentAccordionItem from '../../../components/FindEmploymentAccordionItem';

describe('<FindEmploymentAccordionItem>', () => {
  it('renders va-accordion-item with correct attributes', () => {
    const { container } = render(<FindEmploymentAccordionItem />);
    const accordionItem = container.querySelector('va-accordion-item');
    expect(accordionItem).to.exist;
    expect(accordionItem.getAttribute('header')).to.equal('3. Find Employment');
    expect(accordionItem.hasAttribute('open')).to.be.true;
    expect(accordionItem.hasAttribute('bordered')).to.be.true;
  });

  it('renders expected external links', () => {
    const { container } = render(<FindEmploymentAccordionItem />);
    expect(container.querySelectorAll('va-link').length).to.equal(3);
  });
});
