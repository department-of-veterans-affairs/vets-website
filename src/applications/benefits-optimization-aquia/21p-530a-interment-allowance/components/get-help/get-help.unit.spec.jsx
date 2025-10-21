/**
 * @module tests/components/get-help.unit.spec
 * @description Unit tests for GetHelp component
 */

import React from 'react';
import { render } from '@testing-library/react';
import { expect } from 'chai';
import { GetHelp } from './get-help';

describe('GetHelp', () => {
  describe('Initial Rendering', () => {
    it('should render without errors', () => {
      const { container } = render(<GetHelp />);

      expect(container).to.exist;
    });

    it('should display help information', () => {
      const { container } = render(<GetHelp />);

      expect(container.textContent).to.include(
        'If you have trouble using this online form',
      );
    });

    it('should display MyVA411 phone number', () => {
      const { container } = render(<GetHelp />);

      const phoneLink = container.querySelector(
        'va-telephone[contact="8006982411"]',
      );
      expect(phoneLink).to.exist;
    });

    it('should display TTY phone number', () => {
      const { container } = render(<GetHelp />);

      const ttyLink = container.querySelector('va-telephone[contact="711"]');
      expect(ttyLink).to.exist;
    });

    it('should indicate 24/7 availability', () => {
      const { container } = render(<GetHelp />);

      expect(container.textContent).to.include('24/7');
    });
  });
});
