import React from 'react';
import { expect } from 'chai';
import sinon from 'sinon';
import { render, fireEvent, waitFor } from '@testing-library/react';
import { DefinitionTester } from 'platform/testing/unit/schemaform-utils';

import createDirectDepositPage from '../../pages/DirectDeposit';

const { schema, uiSchema } = createDirectDepositPage();

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
  it('renders heading, top note, custom routing label, and help trigger', () => {
    const { getByText, container } = renderPage();

    expect(getByText('Direct deposit')).to.exist;

    expect(
      getByText(
        /direct deposit information is not required to determine eligibility/i,
      ),
    ).to.exist;

    expect(
      container.querySelector(
        'va-text-input[label="Bank’s 9-digit routing number"]',
      ),
    ).to.exist;

    expect(
      container.querySelector(
        'va-additional-info[trigger="What if I don’t have a bank account?"]',
      ),
    ).to.exist;
  });

  it('renders Account type before the check guide image (order check)', () => {
    const { container } = renderPage();

    const accountType = container.querySelector(
      'va-radio[name="root_bankAccount_accountType"]',
    );
    const image = container.querySelector(
      'img[alt*="bank’s 9-digit routing number"]',
    );

    expect(accountType).to.exist;
    expect(image).to.exist;

    const allNodes = Array.from(container.querySelectorAll('va-radio, img'));
    const acctIdx = allNodes.indexOf(accountType);
    const imgIdx = allNodes.indexOf(image);
    expect(acctIdx).to.be.lessThan(imgIdx);
  });

  it('rejects invalid routing number (fails pattern/checksum)', async () => {
    const badData = {
      bankAccount: {
        accountType: 'checking',
        routingNumber: '12345678',
        accountNumber: '123456789',
      },
    };

    const { getByRole, container } = renderPage(badData);

    fireEvent.click(getByRole('button', { name: /submit|continue/i }));

    await waitFor(() => {
      const routingError = container
        .querySelector('va-text-input[name="root_bankAccount_routingNumber"]')
        ?.getAttribute('error');

      expect(routingError).to.equal(
        'Please enter a valid 9 digit routing number',
      );
    });
  });

  it('submits successfully with valid data', () => {
    const onSubmit = sinon.spy();
    const goodBank = {
      accountType: 'savings',
      routingNumber: '021000021',
      accountNumber: '456789123456',
    };

    const { getByRole } = renderPage({ bankAccount: goodBank }, onSubmit);

    fireEvent.click(getByRole('button', { name: /submit|continue/i }));

    expect(onSubmit.calledOnce).to.be.true;

    const submitted = onSubmit.firstCall.args[0].formData.bankAccount;

    expect(submitted).to.include(goodBank);
  });
});
