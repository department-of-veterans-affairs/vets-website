import React from 'react';
import { expect } from 'chai';
import { render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { DefinitionTester } from 'platform/testing/unit/schemaform-utils';
import { directDeposit } from '../../pages';

const { schema, uiSchema } = directDeposit;

const renderPage = (data = {}, onSubmit = () => {}) =>
  render(
    <DefinitionTester
      schema={schema}
      uiSchema={uiSchema}
      data={data}
      onSubmit={onSubmit}
      definitions={{}}
    />,
  );

describe('22 10297 Direct deposit page', () => {
  describe('prefilled/view state', () => {
    it('renders page', () => {
      const screen = renderPage({
        bankAccount: {
          accountType: 'Checking',
          routingNumber: '021000021',
          routingNumberConfirmation: '021000021',
          accountNumber: '1234567890',
          accountNumberConfirmation: '1234567890',
        },
      });

      expect(screen.getByText('Direct deposit information')).to.exist;

      expect(
        screen.getByText(
          /We make payments only through direct deposit, also called electronic funds transfer \(EFT\)./i,
        ),
      ).to.exist;
    });

    it('renders errors when data contains invalid values', () => {
      const screen = renderPage({
        bankAccount: {
          accountType: 'Checking',
          routingNumber: '021000021',
          routingNumberConfirmation: '',
          accountNumber: '1234567890',
          accountNumberConfirmation: '1234567890',
        },
      });

      expect(
        screen.getByText(
          "Banking information is missing or invalid. Please make sure it's correct.",
        ),
      ).to.exist;
    });
  });

  describe('manual entry/edit state', () => {
    it('renders page', () => {
      const screen = renderPage();
      expect(screen.getByText('Direct deposit information')).to.exist;
      expect(screen.getByText('Account type')).to.exist;
      expect(screen.getByText('Bank routing number')).to.exist;
      expect(screen.getByText('Confirm bank routing number')).to.exist;
      expect(screen.getByText('Bank account number')).to.exist;
      expect(screen.getByText('Confirm bank account number')).to.exist;
      expect(screen.getByText('Save')).to.exist;
    });

    it('renders errors when data contains invalid values', async () => {
      const screen = renderPage();

      const saveButton = screen.getByText('Save');
      await userEvent.click(saveButton);

      expect(screen.getAllByText('You must provide a response')).to.have.length(
        5,
      );
    });
  });
});
