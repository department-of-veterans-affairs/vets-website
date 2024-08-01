import React from 'react';
import { expect } from 'chai';
import { render, fireEvent } from '@testing-library/react';
import { Provider } from 'react-redux';

import {
  $,
  $$,
} from '@department-of-veterans-affairs/platform-forms-system/ui';

import { IntroText } from '../../content/introduction';

import { mockStore } from '../../../shared/tests/test-helpers';

describe('RepresentativeReviewWidget', () => {
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
        <IntroText />
      </Provider>,
    );

    expect($('.va-introtext', container)).to.exist;
    expect($$('h2', container).length).to.eq(0);
  });

  it('should render', () => {
    const { container } = render(
      <Provider store={mockStore()}>
        <IntroText />
      </Provider>,
    );

    expect($('.va-introtext', container)).to.not.exist;
    expect($$('h2', container).length).to.eq(3);
  });

  it('should record GA when restarting the subtask', () => {
    global.window.dataLayer = [];
    const { container } = render(
      <Provider store={mockStore()}>
        <IntroText />
      </Provider>,
    );

    fireEvent.click($('.va-button-link', container));

    const event = global.window.dataLayer.slice(-1)[0];
    expect(event).to.deep.equal({
      event: 'howToWizard-start-over',
    });
  });
});
