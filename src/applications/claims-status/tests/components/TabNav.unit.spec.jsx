import React from 'react';
import { Provider } from 'react-redux';

import { render } from '@testing-library/react';

import { expect } from 'chai';

import { createStore } from 'redux';
import TabNav from '../../components/TabNav';

const getStore = (cstUseClaimDetailsV2Enabled = false) =>
  createStore(() => ({
    featureToggles: {
      // eslint-disable-next-line camelcase
      cst_use_claim_details_v2: cstUseClaimDetailsV2Enabled,
    },
  }));

describe('<TabNav>', () => {
  context('cstUseClaimDetailsV2 feature toggle false', () => {
    it('should render three tabs', () => {
      const screen = render(
        <Provider store={getStore()}>
          <TabNav id={1} />
        </Provider>,
      );

      expect(screen.getAllByRole('listitem').length).to.equal(3);
    });
  });

  context('cstUseClaimDetailsV2 feature toggle true', () => {
    it('should render four tabs', () => {
      const screen = render(
        <Provider store={getStore(true)}>
          <TabNav id={1} />
        </Provider>,
      );

      expect(screen.getAllByRole('listitem').length).to.equal(4);
    });
  });
});
