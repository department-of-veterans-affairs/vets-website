import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { expect } from 'chai';
import { setupServer } from 'msw/node';

import { resetFetch } from 'platform/testing/unit/helpers';

import * as mocks from '@@profile/msw-mocks';
import PersonalInformation from '@@profile/components/personal-information/PersonalInformation';

import {
  createBasicInitialState,
  renderWithProfileReducers,
} from '../../unit-test-helpers';

describe('PersonalInformation', () => {
  let server;
  before(() => {
    // before we can use msw, we need to make sure that global.fetch has been
    // restored and is no longer a sinon stub.
    resetFetch();
    server = setupServer(...mocks.updateDD4CNPSuccess);
    server.listen();
  });
  afterEach(() => {
    server.resetHandlers();
  });
  after(() => {
    server.close();
  });

  const ui = (
    <MemoryRouter>
      <PersonalInformation />
    </MemoryRouter>
  );

  let initialState;
  it('should render personal info data from the Redux state', () => {
    initialState = createBasicInitialState();

    const view = renderWithProfileReducers(ui, {
      initialState,
    });

    expect(view.getByText(/^May 6, 1986$/)).to.exist;
    expect(view.getByText(/^Male$/)).to.exist;
  });

  it('should render the correct contact based on what exists in the Redux state', () => {
    initialState = createBasicInitialState();

    const {
      residentialAddress,
      mailingAddress,
    } = initialState.user.profile.vapContactInfo;

    const view = renderWithProfileReducers(ui, { initialState });

    expect(view.getByText(residentialAddress.addressLine1, { exact: false })).to
      .exist;
    expect(
      view.getByText(
        `${residentialAddress.city}, ${residentialAddress.stateCode} ${
          residentialAddress.zipCode
        }`,
        { exact: false },
      ),
    ).to.exist;

    expect(view.getByText(mailingAddress.addressLine1, { exact: false })).to
      .exist;
    expect(
      view.getByText(
        `${mailingAddress.city}, ${mailingAddress.stateCode} ${
          mailingAddress.zipCode
        }`,
        { exact: false },
      ),
    ).to.exist;

    // It's too cumbersome to convert the raw phone number data into what is
    // displayed so I'm using strings here.
    expect(view.getByText('555-555-5559', { exact: false })).to.exist;
    expect(view.getByText('804-205-5544, ext. 17747')).to.exist;
    expect(view.getByText('214-718-2112', { exact: false })).to.exist;

    expect(
      view.getByText(/please add your fax number/i, { selector: 'button' }),
    ).to.exist;
    expect(view.getByText('me@me.com')).to.exist;
  });
});
