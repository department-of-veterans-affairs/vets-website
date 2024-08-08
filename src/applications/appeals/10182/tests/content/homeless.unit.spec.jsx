import React from 'react';
import { expect } from 'chai';
import { Provider } from 'react-redux';
import { render } from '@testing-library/react';

import { $ } from '@department-of-veterans-affairs/platform-forms-system/ui';

import { homelessReviewField } from '../../../shared/content/homeless';

const mockStore = () => ({
  getState: () => ({
    form: { data: {} },
    featureToggles: {},
  }),
  subscribe: () => {},
  dispatch: () => {},
});

describe('reviewField', () => {
  it('should render value', () => {
    const Field = homelessReviewField;
    const { container } = render(
      <Provider store={mockStore()}>
        <Field>{React.createElement('div', { formData: 'yes' }, 'yes')}</Field>
      </Provider>,
    );

    expect($('dt', container).textContent).to.contain(
      'Are you experiencing homelessness?',
    );
    expect($('dd', container).textContent).to.contain('yes');
  });
  it('should render null', () => {
    const Field = homelessReviewField;
    const { container } = render(
      <Provider store={mockStore()}>
        <Field />
      </Provider>,
    );

    expect($('dd', container).textContent).to.eq('');
  });
});
