import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { expect } from 'chai';

import ContactInformation from '@@profile/components/contact-information/ContactInformation';

import {
  createBasicInitialState,
  createFeatureTogglesState,
  renderWithProfileReducers,
} from '../../unit-test-helpers';

const testContactInfo = () => {
  const ui = (
    <MemoryRouter>
      <ContactInformation />
    </MemoryRouter>
  );
  const initialState = {
    ...createBasicInitialState(),
    ...createFeatureTogglesState(),
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

  // Checking that va-telephone shadow dom values exist is done with Cypress at:
  // personalization/profile/tests/e2e/contact-information/

  // expect(view.getByText('555-555-5559', { exact: false })).to.exist;
  // expect(view.getByText('804-205-5544, ext. 17747')).to.exist;
  // expect(view.getByText('214-718-2112', { exact: false })).to.exist;

  // check for multiple alongusername in email address when alert is rendered and
  // contact email is also rendered (confirm + edit)
  expect(view.getAllByText(/alongusername/)).to.have.length.above(0);
};

describe('ContactInformation', () => {
  context(
    'correct contact info based on what exists in the Redux state',
    () => {
      it('renders in ProfileInfoCard', () => {
        testContactInfo();
      });
    },
  );
});
