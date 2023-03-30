import React from 'react';
import { expect } from 'chai';

import { renderInReduxProvider } from '../../../testing/unit/react-testing-library-helpers';
import { Toggler } from '../../feature-toggles/Toggler';

describe('Toggler with enabled/disabled nested components', () => {
  it('should show enabled nested component', async () => {
    const view = renderInReduxProvider(
      <Toggler toggleName={Toggler.TOGGLE_NAMES.profileUseInfoCard}>
        <Toggler.Enabled>
          <p>Enabled</p>
        </Toggler.Enabled>
        <Toggler.Disabled>
          <p>Disabled</p>
        </Toggler.Disabled>
      </Toggler>,
      {
        initialState: {
          featureToggles: {
            [Toggler.TOGGLE_NAMES.profileUseInfoCard]: true,
          },
        },
      },
    );
    expect(view.getByText('Enabled')).to.exist;
    expect(await view.queryByText('Disabled')).to.not.exist;
  });

  it('should show enabled nested component', async () => {
    const view = renderInReduxProvider(
      <Toggler toggleName={Toggler.TOGGLE_NAMES.profileUseInfoCard}>
        <Toggler.Enabled>
          <p>Enabled</p>
        </Toggler.Enabled>
        <Toggler.Disabled>
          <p>Disabled</p>
        </Toggler.Disabled>
      </Toggler>,
      {
        initialState: {
          featureToggles: {
            [Toggler.TOGGLE_NAMES.profileUseInfoCard]: false,
          },
        },
      },
    );
    expect(view.getByText('Disabled')).to.exist;
    expect(await view.queryByText('Enabled')).to.not.exist;
  });
});

describe('Toggler HOC with render prop', () => {
  it('should provide toggle value in HOC and render Enabled based on the value', async () => {
    const view = renderInReduxProvider(
      <Toggler.Hoc toggleName={Toggler.TOGGLE_NAMES.profileUseInfoCard}>
        {toggleValue => <p>{toggleValue ? 'Enabled' : 'Disabled'}</p>}
      </Toggler.Hoc>,
      {
        initialState: {
          featureToggles: {
            [Toggler.TOGGLE_NAMES.profileUseInfoCard]: true,
          },
        },
      },
    );
    expect(view.getByText('Enabled')).to.exist;
    expect(await view.queryByText('Disabled')).to.not.exist;
  });

  it('should provide toggle value in HOC and render Disabled based on the value', async () => {
    const view = renderInReduxProvider(
      <Toggler.Hoc toggleName={Toggler.TOGGLE_NAMES.profileUseInfoCard}>
        {toggleValue => <p>{toggleValue ? 'Enabled' : 'Disabled'}</p>}
      </Toggler.Hoc>,
      {
        initialState: {
          featureToggles: {
            [Toggler.TOGGLE_NAMES.profileUseInfoCard]: false,
          },
        },
      },
    );
    expect(view.getByText('Disabled')).to.exist;
    expect(await view.queryByText('Enabled')).to.not.exist;
  });
});
