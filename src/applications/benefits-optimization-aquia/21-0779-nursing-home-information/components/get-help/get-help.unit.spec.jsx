import React from 'react';
import { render } from '@testing-library/react';
import { expect } from 'chai';

import { GetHelp } from './get-help';

describe('GetHelp Component', () => {
  describe('Rendering', () => {
    it('should render without errors', () => {
      const { container } = render(<GetHelp />);
      expect(container).to.exist;
    });

    it('should render help text about calling VA', () => {
      const { container } = render(<GetHelp />);
      expect(container.textContent).to.include(
        'If you have trouble using this online form',
      );
    });

    it('should render phone number component', () => {
      const { container } = render(<GetHelp />);
      const phoneElement = container.querySelector(
        'va-telephone[contact="8006982411"]',
      );
      expect(phoneElement).to.exist;
    });

    it('should render TTY phone number component', () => {
      const { container } = render(<GetHelp />);
      const ttyElement = container.querySelector('va-telephone[contact="711"]');
      expect(ttyElement).to.exist;
      expect(ttyElement.hasAttribute('tty')).to.be.true;
    });

    it('should render 24/7 availability text', () => {
      const { container } = render(<GetHelp />);
      expect(container.textContent).to.include('24/7');
    });

    it('should render VSO information', () => {
      const { container } = render(<GetHelp />);
      expect(container.textContent).to.include('Veterans Service Organization');
    });

    it('should render link to find VSO', () => {
      const { container } = render(<GetHelp />);
      const link = container.querySelector('a[href*="find-rep"]');
      expect(link).to.exist;
      expect(link.textContent).to.include(
        'Find a local Veterans Service Organization',
      );
    });

    it('should render link with correct href', () => {
      const { container } = render(<GetHelp />);
      const link = container.querySelector('a');
      expect(link.href).to.include(
        'https://www.va.gov/get-help-from-accredited-representative/find-rep/',
      );
    });

    it('should render multiple paragraphs', () => {
      const { container } = render(<GetHelp />);
      const paragraphs = container.querySelectorAll('p');
      expect(paragraphs.length).to.equal(3);
    });
  });

  describe('Content', () => {
    it('should mention filling out form help', () => {
      const { container } = render(<GetHelp />);
      expect(container.textContent).to.include('filling out your form');
    });

    it('should mention gathering information help', () => {
      const { container } = render(<GetHelp />);
      expect(container.textContent).to.include('gathering your information');
    });
  });
});
