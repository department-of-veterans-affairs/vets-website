import React from 'react';
import { expect } from 'chai';
import { render } from '@testing-library/react';
import { Provider } from 'react-redux';

import { $ } from 'platform/forms-system/src/js/utilities/ui';

import {
  homelessReviewField as Field,
  homelessTitle,
  homelessRiskTitle,
} from '../../content/homeless';
import { mockStore } from '../test-helpers';

describe('homelessReviewField', () => {
  it('should render', () => {
    const store = mockStore();
    const { container } = render(
      <Provider store={store}>
        <Field>Yes</Field>
      </Provider>,
    );

    expect($('dt', container).textContent).to.eq(homelessTitle);
    expect($('dd', container).textContent).to.eq('Yes');
  });

  it('should render new content', () => {
    const store = mockStore({
      toggles: {
        // eslint-disable-next-line camelcase
        hlr_updateed_contnet: true,
        hlrUpdateedContnet: true,
      },
    });
    const { container } = render(
      <Provider store={store}>
        <Field>No</Field>
      </Provider>,
    );

    expect($('dt', container).textContent).to.eq(homelessRiskTitle);
    expect($('dd', container).textContent).to.eq('No');
  });
});
