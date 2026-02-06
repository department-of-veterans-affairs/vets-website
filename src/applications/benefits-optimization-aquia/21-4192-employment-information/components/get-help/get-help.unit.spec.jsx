/**
 * @module tests/components/get-help.unit.spec
 * @description Unit tests for GetHelp component
 */

import { expect } from 'chai';
import React from 'react';
import { render } from '@testing-library/react';
import { GetHelp } from './get-help';

describe('GetHelp Component', () => {
  describe('Component Rendering', () => {
    it('should render without errors', () => {
      const { container } = render(<GetHelp />);
      expect(container).to.exist;
    });

    it('should display help text', () => {
      const { container } = render(<GetHelp />);
      const text = container.textContent;
      expect(text).to.include('If you have trouble using this online form');
    });

    it('should display MyVA411 information', () => {
      const { container } = render(<GetHelp />);
      const text = container.textContent;
      expect(text).to.include('MyVA411');
    });

    it('should mention 24/7 availability', () => {
      const { container } = render(<GetHelp />);
      const text = container.textContent;
      expect(text).to.include('24/7');
    });
  });

  describe('Phone Numbers', () => {
    it('should render main phone number', () => {
      const { container } = render(<GetHelp />);
      const mainPhone = container.querySelector(
        'va-telephone[contact="8006982411"]',
      );
      expect(mainPhone).to.exist;
    });

    it('should render TTY phone number', () => {
      const { container } = render(<GetHelp />);
      const ttyPhone = container.querySelector('va-telephone[contact="711"]');
      expect(ttyPhone).to.exist;
      expect(ttyPhone.hasAttribute('tty')).to.be.true;
    });
  });

  describe('Layout and Styling', () => {
    it('should have proper margin classes on help text', () => {
      const { container } = render(<GetHelp />);
      const helpText = container.querySelector(
        '.vads-u-margin-top--0.vads-u-margin-bottom--2',
      );
      expect(helpText).to.exist;
    });

    it('should have strong tag for emphasis', () => {
      const { container } = render(<GetHelp />);
      const strong = container.querySelector('strong');
      expect(strong).to.exist;
      expect(strong.textContent).to.include(
        'If you have trouble using this online form',
      );
    });
  });
});
