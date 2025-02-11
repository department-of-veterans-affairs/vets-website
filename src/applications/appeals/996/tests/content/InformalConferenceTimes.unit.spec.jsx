import React from 'react';
import { expect } from 'chai';
import { render } from '@testing-library/react';

import { $ } from '@department-of-veterans-affairs/platform-forms-system/ui';

import {
  informalConferenceTimeReviewField as ReviewField,
  informalConferenceTimeRepReviewField as RepReviewField,
  informalConferenceTimeSelectTitle,
  informalConferenceTimeSelectTitleRep,
} from '../../content/InformalConferenceTimes';

describe('informalConferenceTimeReviewField', () => {
  it('should render', () => {
    const screen = render(<ReviewField>Nope</ReviewField>);

    screen.getByText(informalConferenceTimeSelectTitle);
    expect($('dd', screen.container).textContent).to.eq('Nope');
  });
});

describe('informalConferenceTimeRepReviewField', () => {
  it('should render', () => {
    const screen = render(<RepReviewField>Test</RepReviewField>);

    screen.getByText(informalConferenceTimeSelectTitleRep);
    expect($('dd', screen.container).textContent).to.eq('Test');
  });
});
