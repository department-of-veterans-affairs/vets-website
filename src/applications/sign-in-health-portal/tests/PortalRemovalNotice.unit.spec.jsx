import React from 'react';
import { render } from '@testing-library/react';
import { expect } from 'chai';
import PortalRemovalNotice from '../components/PortalRemovalNotice';

describe('PortalRemovalNotice Component', () => {
  describe('H1 Heading', () => {
    it('should render the h1 heading', () => {
      const { container } = render(<PortalRemovalNotice />);
      const h1 = container.querySelector('h1');
      expect(h1).to.exist;
    });

    it('should render h1 with correct text', () => {
      const { container } = render(<PortalRemovalNotice />);
      const h1 = container.querySelector('h1');
      expect(h1.textContent).to.equal(
        'Manage your health care for all VA facilities on VA.gov',
      );
    });
  });

  describe('Paragraphs', () => {
    it('should render 3 paragraphs', () => {
      const { container } = render(<PortalRemovalNotice />);
      const paragraphs = container.querySelectorAll('p');
      expect(paragraphs).to.have.lengthOf(3);
    });

    it('should render first paragraph with correct text', () => {
      const { container } = render(<PortalRemovalNotice />);
      const paragraphs = container.querySelectorAll('p');
      expect(paragraphs[0].textContent).to.equal(
        'We’ve brought all your VA health care data together so you can manage your care in one place.',
      );
    });

    it('should render second paragraph with correct text', () => {
      const { container } = render(<PortalRemovalNotice />);
      const paragraphs = container.querySelectorAll('p');
      expect(paragraphs[1].textContent).to.equal(
        'You can now manage your care for all facilities through My HealtheVet on VA.gov',
      );
    });

    it('should render third paragraph with correct text', () => {
      const { container } = render(<PortalRemovalNotice />);
      const paragraphs = container.querySelectorAll('p');
      expect(paragraphs[2].textContent).to.equal(
        'You can still access your health information through the My VA Health portal if you’d like.',
      );
    });
  });

  describe('Unordered List', () => {
    it('should render a ul element', () => {
      const { container } = render(<PortalRemovalNotice />);
      const list = container.querySelector('ul');
      expect(list).to.exist;
    });

    it('should render 6 list items', () => {
      const { container } = render(<PortalRemovalNotice />);
      const listItems = container.querySelectorAll('li');
      expect(listItems).to.have.lengthOf(6);
    });

    it('should render list items with correct content', () => {
      const { container } = render(<PortalRemovalNotice />);
      const listItems = container.querySelectorAll('li');
      const expectedTexts = [
        'Refill your VA prescriptions and manage your medications',
        'Schedule and manage some VA health appointments',
        'Send secure messages to your VA health care team',
        'Review your medical records, including lab and test results',
        'Order some medical supplies',
        'File travel reimbursement claims',
      ];

      listItems.forEach((item, index) => {
        expect(item.textContent).to.equal(expectedTexts[index]);
      });
    });
  });

  describe('H2 Heading', () => {
    it('should render the h2 heading', () => {
      const { container } = render(<PortalRemovalNotice />);
      const h2 = container.querySelector('h2');
      expect(h2).to.exist;
    });

    it('should render h2 with correct text', () => {
      const { container } = render(<PortalRemovalNotice />);
      const h2 = container.querySelector('h2');
      expect(h2.textContent).to.equal(
        'Still want to use My VA Health for now?',
      );
    });
  });

  describe('Action Links', () => {
    it('should render primary va-link-action with correct attributes', () => {
      const { container } = render(<PortalRemovalNotice />);
      const primaryLink = container.querySelector(
        'va-link-action[type="primary"]',
      );
      expect(primaryLink).to.exist;
      expect(primaryLink.getAttribute('text')).to.equal(
        'Go to My HealtheVet on VA.gov',
      );
      expect(primaryLink.getAttribute('label')).to.equal(
        'Go to My HealtheVet on VA.gov',
      );
      expect(primaryLink.getAttribute('type')).to.equal('primary');
      expect(primaryLink.getAttribute('href')).to.exist;
      expect(primaryLink.getAttribute('href')).to.equal('/my-health');
    });

    it('should render secondary va-link-action with correct attributes', () => {
      const { container } = render(<PortalRemovalNotice />);
      const secondaryLink = container.querySelector(
        'va-link-action[type="secondary"]',
      );
      expect(secondaryLink).to.exist;
      expect(secondaryLink.getAttribute('text')).to.equal('Go to My VA Health');
      expect(secondaryLink.getAttribute('label')).to.equal(
        'Go to My VA Health',
      );
      expect(secondaryLink.getAttribute('type')).to.equal('secondary');
      expect(secondaryLink.getAttribute('href')).to.exist;
      expect(secondaryLink.getAttribute('href')).to.equal(
        'patientportal.myhealth.va.gov',
      );
    });
  });
});
