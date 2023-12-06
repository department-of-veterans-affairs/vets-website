import React from 'react';
import set from 'lodash/set';
import { expect } from 'chai';

import {
  createBasicInitialState,
  createFeatureTogglesState,
  renderWithProfileReducersAndRouter,
} from '../../unit-test-helpers';
import { Toggler } from '~/platform/utilities/feature-toggles';

import DirectDeposit from '../../../components/direct-deposit/DirectDeposit';

const createDirectDepositState = (outageToggleValue = true) => {
  const initialState = {
    ...createBasicInitialState(),
    ...createFeatureTogglesState({
      coolThingBro: true,
      [Toggler.TOGGLE_NAMES.authExpVbaDowntimeMessage]: outageToggleValue,
      [Toggler.TOGGLE_NAMES.profileHideDirectDepositCompAndPen]: false,
    }),
  };

  // set up state that direct deposit selectors need
  set(initialState, 'user.profile.loa.current', 3);
  set(initialState, 'user.profile.signIn.serviceName', 'idme');
  set(initialState, 'user.profile.multifactor', true);
  set(initialState, 'vaProfile.cnpPaymentInformationUiState.isSaving', false);
  set(initialState, 'vaProfile.eduPaymentInformationUiState.isSaving', false);

  return initialState;
};

describe('Direct Deposit - whole page outage', () => {
  it('toggle `authExpVbaDowntimeMessage` turned on triggers alert banner and hides direct deposit content', () => {
    const initialState = createDirectDepositState();

    const view = renderWithProfileReducersAndRouter(<DirectDeposit />, {
      initialState,
    });

    // should always render the page heading - sanity check
    expect(view.getByRole('heading', { name: 'Direct deposit information' })).to
      .exist;

    // should render alert banner message
    expect(view.getByText(/We’re updating our systems right now/)).to.exist;

    // should not render direct deposit sections
    expect(view.queryByText(/Disability compensation and pension benefits/)).not
      .to.exist;
    expect(view.queryByText(/Education benefits/)).not.to.exist;
  });

  it('toggle `authExpVbaDowntimeMessage` turned off does not render alert banner and renders direct deposit content', () => {
    const initialState = createDirectDepositState(false);

    const view = renderWithProfileReducersAndRouter(<DirectDeposit />, {
      initialState,
    });

    // should always render the page heading - sanity check
    expect(view.getByRole('heading', { name: 'Direct deposit information' })).to
      .exist;

    // should not render alert banner
    expect(view.queryByText(/We’re updating our systems right now/)).not.to
      .exist;

    // should render direct deposit sections
    expect(view.getByText(/Disability compensation and pension benefits/)).to
      .exist;
    expect(view.getByText(/Education benefits/)).to.exist;
  });
});
