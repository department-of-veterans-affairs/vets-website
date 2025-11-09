/**
 * @module tests/components/delete-modal/delete-confirmation-modal.unit.spec
 * @description Unit tests for DeleteConfirmationModal component
 */

import React from 'react';
import { render } from '@testing-library/react';
import { expect } from 'chai';
import DeleteConfirmationModal from './delete-confirmation-modal';

describe('DeleteConfirmationModal', () => {
  const mockOnClose = () => {};
  const mockOnDelete = () => {};

  describe('Initial Rendering', () => {
    it('should render without errors', () => {
      const { container } = render(
        <DeleteConfirmationModal
          isOpen
          onClose={mockOnClose}
          onDelete={mockOnDelete}
          modalTitle="service period"
        />,
      );

      expect(container).to.exist;
    });

    it('should render VaModal component', () => {
      const { container } = render(
        <DeleteConfirmationModal
          isOpen
          onClose={mockOnClose}
          onDelete={mockOnDelete}
          modalTitle="service period"
        />,
      );

      expect(container.querySelector('va-modal')).to.exist;
    });

    it('should display correct modal title', () => {
      const { container } = render(
        <DeleteConfirmationModal
          isOpen
          onClose={mockOnClose}
          onDelete={mockOnDelete}
          modalTitle="previous name"
        />,
      );

      const modal = container.querySelector('va-modal');
      expect(modal.getAttribute('modal-title')).to.equal(
        'Delete previous name?',
      );
    });
  });

  describe('Modal Props', () => {
    it('should be visible when isOpen is true', () => {
      const { container } = render(
        <DeleteConfirmationModal
          isOpen
          onClose={mockOnClose}
          onDelete={mockOnDelete}
          modalTitle="service period"
        />,
      );

      const modal = container.querySelector('va-modal');
      expect(modal.getAttribute('visible')).to.equal('true');
    });

    it('should not be visible when isOpen is false', () => {
      const { container } = render(
        <DeleteConfirmationModal
          isOpen={false}
          onClose={mockOnClose}
          onDelete={mockOnDelete}
          modalTitle="service period"
        />,
      );

      const modal = container.querySelector('va-modal');
      expect(modal.getAttribute('visible')).to.equal('false');
    });

    it('should have warning status', () => {
      const { container } = render(
        <DeleteConfirmationModal
          isOpen
          onClose={mockOnClose}
          onDelete={mockOnDelete}
          modalTitle="service period"
        />,
      );

      const modal = container.querySelector('va-modal');
      expect(modal.getAttribute('status')).to.equal('warning');
    });

    it('should have correct button text', () => {
      const { container } = render(
        <DeleteConfirmationModal
          isOpen
          onClose={mockOnClose}
          onDelete={mockOnDelete}
          modalTitle="service period"
        />,
      );

      const modal = container.querySelector('va-modal');
      expect(modal.getAttribute('primary-button-text')).to.equal(
        'Yes, delete this',
      );
      expect(modal.getAttribute('secondary-button-text')).to.equal('Cancel');
    });
  });

  describe('Different Modal Titles', () => {
    it('should handle service period title', () => {
      const { container } = render(
        <DeleteConfirmationModal
          isOpen
          onClose={mockOnClose}
          onDelete={mockOnDelete}
          modalTitle="service period"
        />,
      );

      const modal = container.querySelector('va-modal');
      expect(modal.getAttribute('modal-title')).to.include('service period');
    });

    it('should handle previous name title', () => {
      const { container } = render(
        <DeleteConfirmationModal
          isOpen
          onClose={mockOnClose}
          onDelete={mockOnDelete}
          modalTitle="previous name"
        />,
      );

      const modal = container.querySelector('va-modal');
      expect(modal.getAttribute('modal-title')).to.include('previous name');
    });

    it('should handle custom title', () => {
      const { container } = render(
        <DeleteConfirmationModal
          isOpen
          onClose={mockOnClose}
          onDelete={mockOnDelete}
          modalTitle="Army"
        />,
      );

      const modal = container.querySelector('va-modal');
      expect(modal.getAttribute('modal-title')).to.equal('Delete Army?');
    });
  });
});
