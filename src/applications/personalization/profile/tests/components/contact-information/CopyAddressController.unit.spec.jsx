import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import chai, { expect } from 'chai';
import chaiDom from 'chai-dom';
import set from 'lodash/set';
import {
  COPY_ADDRESS_MODAL_STATUS,
  DEFAULT_ERROR_MESSAGE,
} from '@@vap-svc/constants';

import CopyAddressModal from '@@profile/components/contact-information/addresses/CopyAddressModalController';

import {
  createBasicInitialState,
  renderWithProfileReducers,
} from '../../unit-test-helpers';

chai.use(chaiDom);

let view;

const ui = (
  <MemoryRouter>
    <CopyAddressModal />
  </MemoryRouter>
);

describe('Copy Address Modal', () => {
  it('should render the prompt with address information', async () => {
    const initialState = {
      ...createBasicInitialState(),
      ...{
        vapService: {
          fieldTransactionMap: { mailingAddress: { transactionRequest: null } },
          copyAddressModal: COPY_ADDRESS_MODAL_STATUS.PROMPT,
        },
      },
      ...{
        featureToggles: {},
      },
    };

    view = renderWithProfileReducers(ui, {
      initialState,
    });

    const updateMessage = await view.findByText(
      new RegExp('Your updated home address:', 'i'),
    );

    expect(updateMessage).to.exist;

    const updatePrompt = await view.findByText(
      new RegExp(
        'Do you want to update your mailing address to match this home address?',
        'i',
      ),
    );

    expect(updatePrompt).to.exist;

    const yesButton = await view.findByTestId('save-edit-button');

    expect(yesButton).to.have.text('Yes');
  });

  it('should render the prompt with different content when mailing address is missing', async () => {
    const basicState = createBasicInitialState();

    const initialState = {
      ...set(basicState, 'user.profile.vapContactInfo.mailingAddress', null),
      ...{
        vapService: {
          fieldTransactionMap: { mailingAddress: { transactionRequest: null } },
          copyAddressModal: COPY_ADDRESS_MODAL_STATUS.PROMPT,
        },
      },
      ...{
        featureToggles: {},
      },
    };

    view = renderWithProfileReducers(ui, {
      initialState,
    });

    const noMailingAddressText = await view.findByText(
      new RegExp(`We don’t have a mailing address on file for you.`, 'i'),
    );

    expect(noMailingAddressText).to.exist;
  });

  it('should render the prompt with success', async () => {
    const initialState = {
      ...createBasicInitialState(),
      ...{
        vapService: {
          fieldTransactionMap: { mailingAddress: { transactionRequest: null } },
          copyAddressModal: COPY_ADDRESS_MODAL_STATUS.SUCCESS,
        },
      },
      ...{
        featureToggles: {},
      },
    };

    view = renderWithProfileReducers(ui, {
      initialState,
    });

    // should show the newly updated mailing address messaging
    const updateMessage = await view.findByText(
      new RegExp(
        `We’ve updated your mailing address to match your home address.`,
        'i',
      ),
    );
    expect(updateMessage).to.exist;

    const updateStreet = await view.findByText(
      new RegExp(`34 Blanchard Rd`, 'i'),
    );
    expect(updateStreet).to.exist;

    const updateCityState = await view.findByText(
      new RegExp(`Shirley Mills, ME 04485`, 'i'),
    );
    expect(updateCityState).to.exist;
  });

  it('should render the prompt with failure alert', async () => {
    const initialState = {
      ...createBasicInitialState(),
      ...{
        vapService: {
          fieldTransactionMap: { mailingAddress: { transactionRequest: null } },
          copyAddressModal: COPY_ADDRESS_MODAL_STATUS.FAILURE,
        },
      },
      ...{
        featureToggles: {},
      },
    };

    view = renderWithProfileReducers(ui, {
      initialState,
    });

    // should show default generic error message
    const errorMessage = await view.findByText(
      new RegExp(DEFAULT_ERROR_MESSAGE, 'i'),
    );
    expect(errorMessage).to.exist;
  });
});
