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

  it('renders 5 va-link items with expected attributes (Shadow DOM text not asserted)', () => {
    const { container } = render(<AssessYourInterestsAccordionItem />);
    const links = Array.from(container.querySelectorAll('va-link'));
    expect(links.length).to.equal(5);

    const byTextAttr = text =>
      container.querySelector(`va-link[text="${text}"]`);

    const skills = byTextAttr('View Skills Matcher on Career One Stop website');
    expect(skills).to.exist;
    expect(skills.getAttribute('href')).to.equal(
      'https://www.careeronestop.org/Toolkit/Skills/skills-matcher.aspx',
    );
    expect(skills.hasAttribute('external')).to.be.true;

    const interest = byTextAttr(
      'View Interest Assessment on Career One Stop website',
    );
    expect(interest).to.exist;
    expect(interest.getAttribute('href')).to.equal(
      'https://www.careeronestop.org/Toolkit/Careers/interest-assessment.aspx',
    );
    expect(interest.hasAttribute('external')).to.be.true;

    const occupation = byTextAttr(
      'View Occupation Profile on Career One Stop website',
    );
    expect(occupation).to.exist;
    expect(occupation.getAttribute('href')).to.equal(
      'https://www.careeronestop.org/Toolkit/Careers/Occupations/occupation-profile.aspx',
    );
    expect(occupation.hasAttribute('external')).to.be.true;

    const lmi = byTextAttr(
      'View Labor Market Information on U.S Bureau of Labor Statistics website',
    );
    expect(lmi).to.exist;
    expect(lmi.getAttribute('href')).to.equal('https://www.bls.gov');
    expect(lmi.hasAttribute('external')).to.be.true;

    const resume = byTextAttr('View Resume Builder on Career One Stop website');
    expect(resume).to.exist;
    expect(resume.getAttribute('href')).to.equal(
      'https://www.careeronestop.org/JobSearch/Resumes/ResumeGuide/introduction.aspx?secondaryNavPanels=CA%3D%3D',
    );
    expect(resume.hasAttribute('external')).to.be.true;
  });

  it('renders descriptive text for each link in light DOM', () => {
    const { getByText } = render(<AssessYourInterestsAccordionItem />);
    getByText(
      /Discover how your existing skills, including those from military service,/i,
    );
    getByText(
      /Identify your strengths, preferences, and work interests to find career paths/i,
    );
    getByText(
      /Get detailed information about specific occupations, including job duties, required skills,/i,
    );
    getByText(
      /Explore current job trends, in-demand occupations, and projected growth to help/i,
    );
    getByText(
      /Follow a step-by-step guide to create a professional resume that showcases your experience, skills, and achievements./i,
    );
  });
});
