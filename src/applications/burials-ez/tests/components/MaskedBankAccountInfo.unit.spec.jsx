import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react';
import { expect } from 'chai';
import sinon from 'sinon';

import MaskedBankAccountInfo from '../../components/MaskedBankAccountInfo';

describe('MaskedBankAccountInfo', () => {
  let mapStub;
  let maskStub;

  const stubMapping = mappedProps => {
    mapStub = sinon
      .stub(
        require('platform/forms-system/src/js/web-component-fields/vaTextInputFieldMapping'),
        'default',
      )
      .returns(mappedProps);
  };

  beforeEach(() => {
    maskStub = sinon.stub(
      require('../../utils/helpers'),
      'maskBankInformation',
    );
  });

  afterEach(() => {
    if (mapStub) mapStub.restore();
    if (maskStub) maskStub.restore();
  });

  it('masks the prefilled value for display', async () => {
    const onInput = sinon.spy();
    const onBlur = sinon.spy();

    maskStub.callsFake((val, len) => `MASKED(${val})-${len}`);

    stubMapping({
      id: 'routingNumber',
      name: 'routingNumber',
      value: '123456789',
      onInput,
      onBlur,
      label: 'Routing number',
    });

    const { container } = render(<MaskedBankAccountInfo />);

    await waitFor(() => {
      const el = container.querySelector('va-text-input');
      expect(el).to.exist;
      expect(el.getAttribute('value')).to.equal('MASKED(123456789)-4');
    });
  });

  it('calls onInput with the typed value', async () => {
    const onInput = sinon.spy();
    const onBlur = sinon.spy();

    stubMapping({
      id: 'accountNumber',
      name: 'accountNumber',
      value: '0000111122223333',
      onInput,
      onBlur,
      label: 'Account number',
    });

    const { container } = render(<MaskedBankAccountInfo />);
    const el = container.querySelector('va-text-input');
    expect(el).to.exist;

    el.value = '9999000011112222';
    fireEvent.input(el);

    await waitFor(() => {
      expect(onInput.calledOnce).to.be.true;
      expect(onInput.args[0][1]).to.equal('9999000011112222');
    });
  });
});
