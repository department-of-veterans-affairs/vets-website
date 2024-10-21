import React from 'react';
import { expect } from 'chai';
import { render } from '@testing-library/react';
import { Provider } from 'react-redux';

import { $ } from '@department-of-veterans-affairs/platform-forms-system/ui';

import {
  informalConferenceTimeReviewField as VetReviewField,
  informalConferenceTimeRepReviewField as RepReviewField,
  informalConferenceTimeSelectTitleOriginal,
  informalConferenceTimeSelectTitle,
  informalConferenceTimeSelectTitleRepOriginal,
  informalConferenceTimeSelectTitleRep,
} from '../../content/InformalConferenceTimes';

import { mockStore } from '../../../shared/tests/test-helpers';

describe('RepresentativeReviewWidget', () => {
  it('should render', () => {
    const { getByText, container } = render(
      <Provider store={mockStore()}>
        <VetReviewField>some value</VetReviewField>
      </Provider>,
    );
    getByText(informalConferenceTimeSelectTitleOriginal);
    expect($('dd', container).textContent).to.eq('some value');
  });

  it('should render new content', () => {
    const store = mockStore({
      toggles: {
        // eslint-disable-next-line camelcase
        hlr_updateed_contnet: true,
        hlrUpdateedContnet: true,
      },
    });
    const { getByText, container } = render(
      <Provider store={store}>
        <VetReviewField>some value</VetReviewField>
      </Provider>,
    );
    getByText(informalConferenceTimeSelectTitle);
    expect($('dd', container).textContent).to.eq('some value');
  });
});

describe('RepresentativeReviewWidget', () => {
  it('should render', () => {
    const { getByText, container } = render(
      <Provider store={mockStore()}>
        <RepReviewField>some value</RepReviewField>
      </Provider>,
    );
    getByText(informalConferenceTimeSelectTitleRepOriginal);
    expect($('dd', container).textContent).to.eq('some value');
  });

  it('should render', () => {
    const store = mockStore({
      toggles: {
        // eslint-disable-next-line camelcase
        hlr_updateed_contnet: true,
        hlrUpdateedContnet: true,
      },
    });
    const { getByText, container } = render(
      <Provider store={store}>
        <RepReviewField>some value</RepReviewField>
      </Provider>,
    );
    getByText(informalConferenceTimeSelectTitleRep);
    expect($('dd', container).textContent).to.eq('some value');
  });
});
