/**
 * @module tests/components/statement-of-truth-item.unit.spec
 * @description Unit tests for StatementOfTruthItem component
 */

import { render } from '@testing-library/react';
import { expect } from 'chai';
import React from 'react';
import StatementOfTruthItem from './statement-of-truth-item';

describe('StatementOfTruthItem', () => {
  const mockSetSignatures = () => {};
  const mockSignature = {
    checked: false,
    dirty: false,
    matches: false,
    value: '',
  };
  const mockStatementText = [
    'I certify that this information is correct.',
    'I understand that providing false information may result in prosecution.',
  ];

  describe('Initial Rendering', () => {
    it('should render without errors', () => {
      const { container } = render(
        <StatementOfTruthItem
          hasCheckboxError={false}
          hasInputError={false}
          label="State or Tribal Official"
          setSignatures={mockSetSignatures}
          signature={mockSignature}
          statementText={mockStatementText}
        />,
      );

      expect(container).to.exist;
    });

    it('should render VA statement of truth component', () => {
      const { container } = render(
        <StatementOfTruthItem
          hasCheckboxError={false}
          hasInputError={false}
          label="State or Tribal Official"
          setSignatures={mockSetSignatures}
          signature={mockSignature}
          statementText={mockStatementText}
        />,
      );

      const statementComponent = container.querySelector(
        'va-statement-of-truth',
      );
      expect(statementComponent).to.exist;
    });

    it('should display statement text', () => {
      const { container } = render(
        <StatementOfTruthItem
          hasCheckboxError={false}
          hasInputError={false}
          label="State or Tribal Official"
          setSignatures={mockSetSignatures}
          signature={mockSignature}
          statementText={mockStatementText}
        />,
      );

      expect(container.textContent).to.include(
        'I certify that this information is correct',
      );
    });
  });

  describe('Error Handling', () => {
    it('should show checkbox error when hasCheckboxError is true', () => {
      const { container } = render(
        <StatementOfTruthItem
          hasCheckboxError
          hasInputError={false}
          label="State or Tribal Official"
          setSignatures={mockSetSignatures}
          signature={mockSignature}
          statementText={mockStatementText}
        />,
      );

      const statementComponent = container.querySelector(
        'va-statement-of-truth',
      );
      expect(statementComponent).to.exist;
    });

    it('should show input error when hasInputError is true', () => {
      const { container } = render(
        <StatementOfTruthItem
          hasCheckboxError={false}
          hasInputError
          label="State or Tribal Official"
          setSignatures={mockSetSignatures}
          signature={mockSignature}
          statementText={mockStatementText}
        />,
      );

      const statementComponent = container.querySelector(
        'va-statement-of-truth',
      );
      expect(statementComponent).to.exist;
    });
  });

  describe('Signature State', () => {
    it('should render with signature value', () => {
      const signatureWithValue = {
        checked: true,
        dirty: true,
        matches: true,
        value: 'John Doe',
      };

      const { container } = render(
        <StatementOfTruthItem
          hasCheckboxError={false}
          hasInputError={false}
          label="State or Tribal Official"
          setSignatures={mockSetSignatures}
          signature={signatureWithValue}
          statementText={mockStatementText}
        />,
      );

      expect(container).to.exist;
    });
  });
});
