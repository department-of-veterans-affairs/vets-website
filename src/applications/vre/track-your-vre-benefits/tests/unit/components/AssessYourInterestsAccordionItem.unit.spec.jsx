import React from 'react';
import { expect } from 'chai';
import { render } from '@testing-library/react';
import AssessYourInterestsAccordionItem from '../../../components/AssessYourInterestsAccordionItem';

describe('<AssessYourInterestsAccordionItem>', () => {
  it('renders va-accordion-item with correct attributes', () => {
    const { container } = render(<AssessYourInterestsAccordionItem />);
    const accordionItem = container.querySelector('va-accordion-item');
    expect(accordionItem).to.exist;
    expect(accordionItem.getAttribute('header')).to.equal(
      '1. Assess your interests',
    );
    expect(accordionItem.hasAttribute('open')).to.be.true;
    expect(accordionItem.hasAttribute('bordered')).to.be.true;
  });

  it('renders expected external links', () => {
    const { container } = render(<AssessYourInterestsAccordionItem />);
    const links = Array.from(container.querySelectorAll('va-link'));
    expect(links.length).to.equal(5);
  });
});
