import React from 'react';
import { expect } from 'chai';
import { render } from '@testing-library/react';
import FindAPathAccordionItem from '../../../components/FindAPathAccordionItem';

describe('<FindAPathAccordionItem>', () => {
  it('renders va-accordion-item with correct attributes', () => {
    const { container } = render(<FindAPathAccordionItem />);
    const accordionItem = container.querySelector('va-accordion-item');
    expect(accordionItem).to.exist;
    expect(accordionItem.getAttribute('header')).to.equal('2. Find a Path');
    expect(accordionItem.hasAttribute('open')).to.be.true;
    expect(accordionItem.hasAttribute('bordered')).to.be.true;
  });

  it('renders expected external links', () => {
    const { container } = render(<FindAPathAccordionItem />);
    expect(container.querySelectorAll('va-link').length).to.equal(4);
  });
});
