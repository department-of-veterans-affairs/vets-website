/* eslint-disable camelcase */
import React from 'react';
import { expect } from 'chai';

import { Toggler } from '@department-of-veterans-affairs/platform-utilities/feature-toggles/Toggler';
import { renderWithProfileReducers as render } from '../unit-test-helpers';

describe('Toggler', () => {
  it('renders Toggler.Enabled with value set to True', () => {
    const initialState = {
      featureToggles: {
        profile_use_info_card: true,
      },
    };
    const ui = (
      <Toggler toggleName={Toggler.TOGGLE_NAMES.profileUseInfoCard}>
        <Toggler.Enabled>
          <div>Enabled</div>
        </Toggler.Enabled>
        <Toggler.Disabled>
          <div>Disabled</div>
        </Toggler.Disabled>
      </Toggler>
    );

    const wrapper = render(ui, { initialState });

    const enabled = wrapper.queryByText('Enabled');
    expect(enabled).to.exist;

    const disabled = wrapper.queryByText('Disabled');
    expect(disabled).to.not.exist;
  });

  it('renders Toggler.Disabled with value set to False', () => {
    const initialState = {
      featureToggles: {
        profile_use_info_card: false,
      },
    };
    const ui = (
      <Toggler toggleName={Toggler.TOGGLE_NAMES.profileUseInfoCard}>
        <Toggler.Enabled>
          <div>Enabled</div>
        </Toggler.Enabled>
        <Toggler.Disabled>
          <div>Disabled</div>
        </Toggler.Disabled>
      </Toggler>
    );

    const wrapper = render(ui, { initialState });

    const enabled = wrapper.queryByText('Enabled');
    expect(enabled).to.not.exist;

    const disabled = wrapper.queryByText('Disabled');
    expect(disabled).to.exist;
  });

  it('renders Toggler.Disabled with value not set', () => {
    const initialState = {
      featureToggles: {},
    };
    const ui = (
      <Toggler toggleName={Toggler.TOGGLE_NAMES.profileUseInfoCard}>
        <Toggler.Enabled>
          <div>Enabled</div>
        </Toggler.Enabled>
        <Toggler.Disabled>
          <div>Disabled</div>
        </Toggler.Disabled>
      </Toggler>
    );

    const wrapper = render(ui, { initialState });

    const enabled = wrapper.queryByText('Enabled');
    expect(enabled).to.not.exist;

    const disabled = wrapper.queryByText('Disabled');
    expect(disabled).to.exist;
  });
});
