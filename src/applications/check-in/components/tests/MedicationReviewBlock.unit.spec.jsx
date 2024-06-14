import React from 'react';
import { render } from '@testing-library/react';
import { expect } from 'chai';

import { setupI18n, teardownI18n } from '../../utils/i18n/i18n';
import CheckInProvider from '../../tests/unit/utils/CheckInProvider';
import MedicationReviewBlock from '../MedicationReviewBlock';

describe('MedicationReviewBlock', () => {
  beforeEach(() => {
    setupI18n();
  });
  afterEach(() => {
    teardownI18n();
  });
  it('renders correctly on details view', () => {
    const component = render(
      <CheckInProvider>
        <MedicationReviewBlock page="details" />
      </CheckInProvider>,
    );

    expect(component.getByTestId('medication-review-container')).to.exist;
    expect(component.getByTestId('medication-review-header')).to.have.class(
      'vads-u-font-size--sm',
    );
    expect(component.getByTestId('medication-review-what-to-share')).to.exist;
  });
  it('renders correctly on other views', () => {
    const component = render(
      <CheckInProvider>
        <MedicationReviewBlock page="complete" />
      </CheckInProvider>,
    );

    expect(component.getByTestId('medication-review-container')).to.exist;
    expect(component.getByTestId('medication-review-header')).to.not.have.class(
      'vads-u-font-size--sm',
    );
    expect(component.getByTestId('medication-review-what-to-share')).to.exist;
  });
});
