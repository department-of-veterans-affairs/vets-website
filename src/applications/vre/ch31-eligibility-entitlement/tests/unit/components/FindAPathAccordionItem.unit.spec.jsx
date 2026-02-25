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

  it('renders 4 va-link items with expected attributes (Shadow DOM text not asserted)', () => {
    const { container } = render(<FindAPathAccordionItem />);
    const links = Array.from(container.querySelectorAll('va-link'));
    expect(links.length).to.equal(4);

    const byTextAttr = text =>
      container.querySelector(`va-link[text="${text}"]`);

    const orientation = byTextAttr('Orientation Video');
    expect(orientation).to.exist;
    expect(orientation.getAttribute('href')).to.equal(
      'https://www.youtube.com/watch?v=49eWvGitLPw',
    );
    expect(orientation.hasAttribute('external')).to.be.true;

    const employment = byTextAttr('Employment Options');
    expect(employment).to.exist;
    expect(employment.getAttribute('href')).to.equal(
      'https://www.careeronestop.org/ExploreCareers/Learn/self-employment.aspx?secondaryNavPanels=Ag%3D%3D',
    );
    expect(employment.hasAttribute('external')).to.be.true;

    const training = byTextAttr('Location Training Finder');
    expect(training).to.exist;
    expect(training.getAttribute('href')).to.equal(
      'https://www.careeronestop.org/Toolkit/Training/find-local-training.aspx',
    );
    expect(training.hasAttribute('external')).to.be.true;

    const cert = byTextAttr('Certification Finder');
    expect(cert).to.exist;
    expect(cert.getAttribute('href')).to.equal(
      'https://www.careeronestop.org/Toolkit/Training/find-certifications.aspx',
    );
    expect(cert.hasAttribute('external')).to.be.true;
  });

  it('renders descriptive text for each link in light DOM', () => {
    const { getByText } = render(<FindAPathAccordionItem />);
    getByText(/Learn more about the 5 tracks/i);
    getByText(/Return to your last employer/i);
    getByText(
      /Search for training programs, schools, and education opportunities/i,
    );
    getByText(/Explore certifications available for your chosen field/i);
  });
});
