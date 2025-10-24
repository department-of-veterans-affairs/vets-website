import React from 'react';
import sinon from 'sinon';
import { expect } from 'chai';
import { fireEvent, waitFor } from '@testing-library/react';
import { renderInReduxProvider as render } from '@department-of-veterans-affairs/platform-testing/react-testing-library-helpers';

import * as reactRedux from 'react-redux';
import ConfirmEmailButton from '../../components/ConfirmEmailButton';

describe('<ConfirmEmailButton />', () => {
  let useDispatchStub;

  afterEach(() => {
    if (useDispatchStub && useDispatchStub.restore) useDispatchStub.restore();
    if (typeof sinon.restore === 'function') {
      sinon.restore();
    }
  });

  it('renders nothing when no email object present', async () => {
    const initialState = {
      user: { profile: { vapContactInfo: {} } },
    };

    const { container } = render(
      <ConfirmEmailButton>Confirm</ConfirmEmailButton>,
      {
        initialState,
      },
    );

    await waitFor(() => {
      expect(container).to.be.empty;
    });
  });

  it('dispatches createTransaction and calls onSuccess when transaction returned', async () => {
    // stub useDispatch to return a dispatch that resolves to a transaction object
    const dispatchStub = sinon.stub().resolves({ data: { attributes: {} } });
    useDispatchStub = sinon
      .stub(reactRedux, 'useDispatch')
      .returns(dispatchStub);

    const onSuccess = sinon.spy();
    const onError = sinon.spy();

    const initialState = {
      user: {
        profile: {
          vapContactInfo: {
            email: { id: '1', emailAddress: 'vet@va.gov' },
          },
        },
      },
    };

    const { container } = render(
      <ConfirmEmailButton onSuccess={onSuccess} onError={onError}>
        Confirm
      </ConfirmEmailButton>,
      {
        initialState,
      },
    );

    const btn = container.querySelector('va-button[text="Confirm"]');
    fireEvent.click(btn);

    await waitFor(() => {
      expect(dispatchStub.called).to.be.true;
      expect(onSuccess.called).to.be.true;
      expect(onError.called).to.be.false;
    });
  });

  it('calls onError when transaction creation returns null', async () => {
    const dispatchStub = sinon.stub().resolves(null);
    useDispatchStub = sinon
      .stub(reactRedux, 'useDispatch')
      .returns(dispatchStub);

    const onSuccess = sinon.spy();
    const onError = sinon.spy();

    const initialState = {
      user: {
        profile: {
          vapContactInfo: {
            email: { id: '1', emailAddress: 'vet@va.gov' },
          },
        },
      },
    };

    const { container } = render(
      <ConfirmEmailButton onSuccess={onSuccess} onError={onError}>
        Confirm
      </ConfirmEmailButton>,
      {
        initialState,
      },
    );

    const btn = container.querySelector('va-button[text="Confirm"]');
    fireEvent.click(btn);

    await waitFor(() => {
      expect(dispatchStub.called).to.be.true;
      expect(onSuccess.called).to.be.false;
      expect(onError.called).to.be.true;
    });
  });
});
