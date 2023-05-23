import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { expect } from 'chai';

import ContactInformation from '@@profile/components/contact-information/ContactInformation';

import {
  createBasicInitialState,
  createFeatureTogglesState,
  renderWithProfileReducers,
} from '../../unit-test-helpers';
import { Toggler } from '~/platform/utilities/feature-toggles';

const testContactInfo = toggleValue => {
  const ui = (
    <MemoryRouter>
      <ContactInformation />
    </MemoryRouter>
  );
  const initialState = {
    ...createBasicInitialState(),
    ...createFeatureTogglesState({
      [Toggler.TOGGLE_NAMES.profileUseInfoCard]: toggleValue || false,
    }),
  };
  initialState.user.profile.vapContactInfo.email.emailAddress =
    'alongusername@gmail.com';

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

  expect(view.getByText(/alongusername/)).to.exist;
};

describe('ContactInformation', () => {
  context(
    'correct contact info based on what exists in the Redux state',
    () => {
      it('renders when profileUseInfoCard toggle is off', () => {
        testContactInfo(false);
      });

      it('renders when profileUseInfoCard toggle is on', () => {
        testContactInfo(true);
      });
    },
  );
});
