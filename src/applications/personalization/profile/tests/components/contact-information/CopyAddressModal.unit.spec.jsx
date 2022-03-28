import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import chai, { expect } from 'chai';
import chaiDom from 'chai-dom';
import { setupServer } from 'msw/node';

import * as mocks from '@@profile/msw-mocks';
import CopyAddressModal from '@@profile/components/contact-information/addresses/CopyAddressModal';

import {
  createBasicInitialState,
  renderWithProfileReducers,
} from '../../unit-test-helpers';

chai.use(chaiDom);

let view;
let server;

const ui = (
  <MemoryRouter>
    <CopyAddressModal />
  </MemoryRouter>
);

describe('Copy Address Modal', () => {
  before(() => {
    server = setupServer(...mocks.transactionPending);
    server.listen();
  });
  beforeEach(() => {
    window.VetsGov = { pollTimeout: 5000 };
  });
  afterEach(() => {
    server.resetHandlers();
  });
  after(() => {
    server.close();
  });

  it('should render the prompt with address information', async () => {
    const initialState = {
      ...createBasicInitialState(),
      ...{
        vapService: {
          fieldTransactionMap: { mailingAddress: { transactionRequest: null } },
          copyAddressModal: 'prompt',
        },
      },
      ...{
        featureToggles: {
          profileShowAddressChangeModal: true,
          // eslint-disable-next-line camelcase
          profile_show_address_change_modal: true,
        },
      },
    };

    view = renderWithProfileReducers(ui, {
      initialState,
    });

    expect(view.getByRole('heading')).to.have.text(
      "We've updated your home address",
    );

    const yesButton = await view.findByTestId('save-edit-button');

    expect(yesButton).to.have.text('Yes');
  });

  it('should render the prompt with success', async () => {
    const initialState = {
      ...createBasicInitialState(),
      ...{
        vapService: {
          fieldTransactionMap: { mailingAddress: { transactionRequest: null } },
          copyAddressModal: 'success',
        },
      },
      ...{
        featureToggles: {
          profileShowAddressChangeModal: true,
          // eslint-disable-next-line camelcase
          profile_show_address_change_modal: true,
        },
      },
    };

    view = renderWithProfileReducers(ui, {
      initialState,
    });

    expect(view.getByRole('heading')).to.have.text(
      "We've updated your mailing address",
    );

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
          copyAddressModal: 'failure',
        },
      },
      ...{
        featureToggles: {
          profileShowAddressChangeModal: true,
          // eslint-disable-next-line camelcase
          profile_show_address_change_modal: true,
        },
      },
    };

    view = renderWithProfileReducers(ui, {
      initialState,
    });

    expect(view.getByRole('heading')).to.have.text(
      "We can't update your mailing address",
    );

    // should show generic error message
    const errorMessage = await view.findByText(
      new RegExp(
        `We’re sorry. We can’t update your information right now. We’re working to fix this problem. Please check back later.`,
        'i',
      ),
    );
    expect(errorMessage).to.exist;
  });
});
