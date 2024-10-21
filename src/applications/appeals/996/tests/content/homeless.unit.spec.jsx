import React from 'react';
import { expect } from 'chai';
import { Provider } from 'react-redux';
import { render } from '@testing-library/react';

import { $ } from '@department-of-veterans-affairs/platform-forms-system/ui';

import { homelessReviewField as HomelessRF } from '../../../shared/content/homeless';

const mockStore = () => ({
  getState: () => ({
    form: { data: { hlrUpdatedContent: true } },
    featureToggles: {
      // eslint-disable-next-line camelcase
      hlr_updateed_contnet: true,
      hlrUpdateedContnet: true,
    },
  }),
  subscribe: () => {},
  dispatch: () => {},
});

describe('homelessReviewField', () => {
  it('should return a review row element with a label & value', () => {
    const { container } = render(
      <Provider store={mockStore()}>
        <HomelessRF>No</HomelessRF>
        );
      </Provider>,
    );
    const row = $('.review-row', container);
    expect(row.innerHTML).to.contain('experiencing or at risk');
    expect(row.innerHTML).to.contain('No');
  });
});
