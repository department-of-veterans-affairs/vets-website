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

  it('renders 3 va-link items with expected attributes (Shadow DOM text not asserted)', () => {
    const { container } = render(<FindEmploymentAccordionItem />);
    const links = Array.from(container.querySelectorAll('va-link'));
    expect(links.length).to.equal(3);

    const byTextAttr = text =>
      container.querySelector(`va-link[text="${text}"]`);

    const costs = byTextAttr('Compare Costs of Living');
    expect(costs).to.exist;
    expect(costs.getAttribute('href')).to.equal(
      'https://www.careeronestop.org/Toolkit/Wages/cost-of-living.aspx',
    );
    expect(costs.hasAttribute('external')).to.be.true;

    const salary = byTextAttr('Salary Finder');
    expect(salary).to.exist;
    expect(salary.getAttribute('href')).to.equal(
      'https://www.careeronestop.org/Toolkit/Wages/find-salary.aspx',
    );
    expect(salary.hasAttribute('external')).to.be.true;

    const jobs = byTextAttr('Employment Finder');
    expect(jobs).to.exist;
    expect(jobs.getAttribute('href')).to.equal(
      'https://www.careeronestop.org/Toolkit/Jobs/find-jobs.aspx',
    );
    expect(jobs.hasAttribute('external')).to.be.true;
  });

  it('renders descriptive text for each link in light DOM', () => {
    const { getByText } = render(<FindEmploymentAccordionItem />);
    getByText(/Evaluate how your income and expenses might vary/i);
    getByText(/Compare typical earnings for different occupations/i);
    getByText(/Search for current job openings/i);
  });
});
